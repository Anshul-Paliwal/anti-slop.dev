import { parentPort } from 'node:worker_threads';
import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import {
  WorkerBatchResult,
  WorkerInboundMessage,
  WorkerOutboundMessage,
  SlopIssue,
} from '@anti-slop/shared';
import { parseSource } from '../ast/parser';
import { buildLineMap } from '../ast/visitor';
import { executeRules } from '../rules';

if (!parentPort) {
  throw new Error('anti-slop worker must be spawned via Node.js worker_threads');
}

/**
 * Handle incoming messages from the main thread worker pool.
 */
parentPort.on('message', async (message: WorkerInboundMessage) => {
  if (!parentPort) return;

  if (message.type === 'SHUTDOWN') {
    process.exit(0);
  }

  if (message.type === 'PROCESS_BATCH') {
    const { batchId, files } = message.payload;
    const startTime = performance.now();
    const issues: SlopIssue[] = [];
    const errors: Array<{ file: string; message: string }> = [];
    let processedFiles = 0;

    try {
      for (const file of files) {
        try {
          // 1. Read file contents from disk
          const source = await fs.promises.readFile(file.absolutePath, 'utf-8');

          // 2. Parse source code into AST
          const parseResult = parseSource(source, file.absolutePath);

          if (parseResult.ast) {
            // 3. Build line map for offset → line:column conversion
            const lineMap = buildLineMap(source);

            // 4. Run all registered rules against the AST
            const fileIssues = executeRules(
              parseResult.ast,
              source,
              file.relativePath,
              lineMap
            );

            issues.push(...fileIssues);
          } else if (parseResult.error) {
            errors.push({
              file: file.relativePath,
              message: `Parse error: ${parseResult.error}`,
            });
          }

          processedFiles++;
        } catch (err: any) {
          errors.push({
            file: file.relativePath,
            message: err?.message || 'Failed to read file',
          });
        }
      }

      const durationMs = Math.round(performance.now() - startTime);

      const result: WorkerBatchResult = {
        batchId,
        processedFiles,
        durationMs,
        issues,
        errors,
      };

      const response: WorkerOutboundMessage = {
        type: 'BATCH_SUCCESS',
        payload: result,
      };

      parentPort.postMessage(response);
    } catch (fatalErr: any) {
      const errorResponse: WorkerOutboundMessage = {
        type: 'BATCH_ERROR',
        batchId,
        error: fatalErr?.message || 'Fatal worker thread error',
      };
      parentPort.postMessage(errorResponse);
    }
  }
});

// Notify parent thread that worker is ready
const readyMessage: WorkerOutboundMessage = { type: 'WORKER_READY' };
parentPort.postMessage(readyMessage);
