import os from 'node:os';
import { DiscoveredFile, WorkerBatchTask } from '@anti-slop/shared';

/**
 * Determine default hardware concurrency safely (min 1, capped at available CPU cores).
 */
export function getDefaultConcurrency(): number {
  const cpus = os.cpus();
  return cpus && cpus.length > 0 ? cpus.length : 1;
}

/**
 * Partition discovered files into balanced batches for worker threads.
 *
 * @param files List of discovered files
 * @param concurrency Desired number of concurrent worker threads
 * @param verbose Optional verbose logging flag
 * @returns Array of WorkerBatchTask ready to be dispatched to workers
 */
export function createFileBatches(
  files: DiscoveredFile[],
  concurrency: number = getDefaultConcurrency(),
  verbose: boolean = false
): WorkerBatchTask[] {
  if (!files || files.length === 0) {
    return [];
  }

  const effectiveConcurrency = Math.max(1, Math.min(concurrency, files.length));
  const batchSize = Math.ceil(files.length / effectiveConcurrency);
  const batches: WorkerBatchTask[] = [];

  for (let i = 0; i < files.length; i += batchSize) {
    const batchFiles = files.slice(i, i + batchSize);
    batches.push({
      batchId: batches.length + 1,
      files: batchFiles,
      verbose,
    });
  }

  return batches;
}
