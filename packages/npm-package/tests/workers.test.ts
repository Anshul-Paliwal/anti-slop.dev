import { describe, it, expect, afterEach } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { createFileBatches, getDefaultConcurrency } from '../src/workers/batcher';
import { WorkerPool } from '../src/workers/pool';
import { DiscoveredFile } from '@anti-slop/shared';

describe('createFileBatches', () => {
  const createMockFiles = (count: number): DiscoveredFile[] => {
    return Array.from({ length: count }, (_, i) => ({
      absolutePath: `/workspace/file_${i}.ts`,
      relativePath: `file_${i}.ts`,
      extension: '.ts',
      category: 'typescript',
      sizeBytes: 100,
    }));
  };

  it('should return empty array when no files are provided', () => {
    expect(createFileBatches([])).toEqual([]);
  });

  it('should partition files into batches based on concurrency', () => {
    const files = createMockFiles(10);
    const batches = createFileBatches(files, 4);

    expect(batches.length).toBeLessThanOrEqual(4);
    const totalBatchedFiles = batches.reduce((sum, b) => sum + b.files.length, 0);
    expect(totalBatchedFiles).toBe(10);
  });

  it('should assign incremental batchIds', () => {
    const files = createMockFiles(5);
    const batches = createFileBatches(files, 3);

    expect(batches[0].batchId).toBe(1);
    expect(batches[1].batchId).toBe(2);
  });

  it('should return a sensible default concurrency', () => {
    const concurrency = getDefaultConcurrency();
    expect(concurrency).toBeGreaterThan(0);
  });
});

describe('WorkerPool execution', () => {
  let pool: WorkerPool;

  afterEach(async () => {
    if (pool) {
      await pool.terminate();
    }
  });

  it('should successfully execute batches and return processed count', async () => {
    pool = new WorkerPool(2);
    await pool.initialize();

    const mockFiles: DiscoveredFile[] = [
      {
        absolutePath: __filename,
        relativePath: 'workers.test.ts',
        extension: '.ts',
        category: 'typescript',
        sizeBytes: 500,
      },
    ];

    const batches = createFileBatches(mockFiles, 1);
    const results = await pool.executeBatches(batches);

    expect(results.length).toBe(1);
    expect(results[0].processedFiles).toBe(1);
    expect(results[0].errors.length).toBe(0);
  });
});
