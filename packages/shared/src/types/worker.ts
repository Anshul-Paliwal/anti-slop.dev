import { DiscoveredFile } from './config';
import { SlopIssue } from './issue';

/**
 * Payload sent to a worker thread to process a batch of files.
 */
export interface WorkerBatchTask {
  batchId: number;
  files: DiscoveredFile[];
  verbose?: boolean;
}

/**
 * Result returned by a worker thread after processing a batch.
 */
export interface WorkerBatchResult {
  batchId: number;
  processedFiles: number;
  durationMs: number;
  issues: SlopIssue[];
  errors: Array<{
    file: string;
    message: string;
  }>;
}

/**
 * Inter-process message envelope between main thread and worker threads.
 */
export type WorkerInboundMessage =
  | { type: 'PROCESS_BATCH'; payload: WorkerBatchTask }
  | { type: 'SHUTDOWN' };

export type WorkerOutboundMessage =
  | { type: 'WORKER_READY' }
  | { type: 'BATCH_SUCCESS'; payload: WorkerBatchResult }
  | { type: 'BATCH_ERROR'; batchId: number; error: string };
