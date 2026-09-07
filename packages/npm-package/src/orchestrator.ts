import { performance } from 'node:perf_hooks';
import {
  FileDiscoveryResult,
  ScanOptions,
  WorkerBatchResult,
} from '@anti-slop/shared';
import { discoverFiles } from './discovery';
import { createFileBatches, getDefaultConcurrency, WorkerPool } from './workers';
import { logger } from './utils/logger';

export interface PipelineResult {
  discovery: FileDiscoveryResult;
  batchResults: WorkerBatchResult[];
  totalProcessedFiles: number;
  totalDurationMs: number;
}

/**
 * Execute the AntiSlop Stage 1 workspace discovery and worker scheduling pipeline.
 */
export async function runScanPipeline(options: ScanOptions): Promise<PipelineResult> {
  const pipelineStart = performance.now();
  const concurrency = options.concurrency ?? getDefaultConcurrency();

  if (options.verbose) {
    logger.banner();
    logger.info(`Scanning target: "${options.targetPath || process.cwd()}"`);
  }

  // 1. Stage 1: File Discovery
  const discovery = await discoverFiles(options);

  if (options.verbose || options.dryRun) {
    logger.printDiscoverySummary(discovery, concurrency);
  }

  // If dry-run requested, return discovery results immediately
  if (options.dryRun) {
    const totalDurationMs = Math.round(performance.now() - pipelineStart);
    logger.success(`Dry run completed in ${totalDurationMs}ms. Ready for Stage 2.`);
    return {
      discovery,
      batchResults: [],
      totalProcessedFiles: discovery.totalCount,
      totalDurationMs,
    };
  }

  if (discovery.totalCount === 0) {
    logger.warn('No matching source files discovered in target path.');
    return {
      discovery,
      batchResults: [],
      totalProcessedFiles: 0,
      totalDurationMs: Math.round(performance.now() - pipelineStart),
    };
  }

  // 2. Partition files into batches
  const batches = createFileBatches(discovery.files, concurrency, options.verbose);

  // 3. Dispatch to worker pool
  const pool = new WorkerPool(concurrency);
  let batchResults: WorkerBatchResult[] = [];

  try {
    await pool.initialize();
    batchResults = await pool.executeBatches(batches);
  } finally {
    await pool.terminate();
  }

  const totalProcessedFiles = batchResults.reduce((sum, r) => sum + r.processedFiles, 0);
  const totalDurationMs = Math.round(performance.now() - pipelineStart);

  if (options.verbose) {
    logger.success(
      `Dispatched ${batches.length} batch(es) across ${concurrency} workers. Processed ${totalProcessedFiles} files in ${totalDurationMs}ms.`
    );
  }

  return {
    discovery,
    batchResults,
    totalProcessedFiles,
    totalDurationMs,
  };
}
