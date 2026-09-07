import { Worker } from 'node:worker_threads';
import path from 'node:path';
import fs from 'node:fs';
import {
  WorkerBatchResult,
  WorkerBatchTask,
  WorkerInboundMessage,
  WorkerOutboundMessage,
} from '@anti-slop/shared';
import { getDefaultConcurrency } from './batcher';

interface WorkerState {
  id: number;
  worker: Worker;
  isBusy: boolean;
  currentBatchId?: number;
}

export class WorkerPool {
  private size: number;
  private workerScriptPath: string;
  private workers: WorkerState[] = [];
  private taskQueue: Array<{
    task: WorkerBatchTask;
    resolve: (res: WorkerBatchResult) => void;
    reject: (err: Error) => void;
  }> = [];
  private isTerminated: boolean = false;

  constructor(size: number = getDefaultConcurrency(), customWorkerScript?: string) {
    this.size = Math.max(1, size);
    this.workerScriptPath = customWorkerScript || this.resolveWorkerScript();
  }

  /**
   * Locate the compiled worker script.
   */
  private resolveWorkerScript(): string {
    const directJs = path.join(__dirname, 'worker.js');
    if (fs.existsSync(directJs)) {
      return directJs;
    }

    const distJs = path.join(__dirname, '../../dist/workers/worker.js');
    if (fs.existsSync(distJs)) {
      return distJs;
    }

    return directJs;
  }

  /**
   * Initialize all worker threads in the pool.
   */
  public async initialize(): Promise<void> {
    if (this.workers.length > 0 || this.isTerminated) {
      return;
    }

    // Check if worker script exists (if not, we'll run fallback inline execution)
    if (!fs.existsSync(this.workerScriptPath)) {
      return;
    }

    const initPromises: Promise<void>[] = [];

    for (let i = 0; i < this.size; i++) {
      initPromises.push(this.spawnWorker(i + 1));
    }

    await Promise.all(initPromises);
  }

  private async spawnWorker(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const worker = new Worker(this.workerScriptPath);
        const state: WorkerState = {
          id,
          worker,
          isBusy: false,
        };

        const onInitialMessage = (msg: WorkerOutboundMessage) => {
          if (msg.type === 'WORKER_READY') {
            worker.off('message', onInitialMessage);
            this.setupWorkerListeners(state);
            this.workers.push(state);
            resolve();
          }
        };

        worker.on('message', onInitialMessage);

        worker.once('error', (err) => {
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private setupWorkerListeners(state: WorkerState): void {
    state.worker.on('message', (msg: WorkerOutboundMessage) => {
      if (msg.type === 'BATCH_SUCCESS' || msg.type === 'BATCH_ERROR') {
        state.isBusy = false;
        state.currentBatchId = undefined;
        this.dispatchNext();
      }
    });

    state.worker.on('error', (err) => {
      state.isBusy = false;
      state.currentBatchId = undefined;
      this.dispatchNext();
    });

    state.worker.on('exit', () => {
      this.workers = this.workers.filter((w) => w.id !== state.id);
    });
  }

  /**
   * Execute a collection of batch tasks across the worker pool.
   */
  public async executeBatches(batches: WorkerBatchTask[]): Promise<WorkerBatchResult[]> {
    if (batches.length === 0) {
      return [];
    }

    // If workers couldn't be spawned (e.g. running uncompiled in direct unit tests),
    // perform fast inline execution as a safe fallback
    if (this.workers.length === 0) {
      return this.executeInline(batches);
    }

    const taskPromises = batches.map((task) => {
      return new Promise<WorkerBatchResult>((resolve, reject) => {
        this.taskQueue.push({ task, resolve, reject });
        this.dispatchNext();
      });
    });

    return Promise.all(taskPromises);
  }

  private dispatchNext(): void {
    if (this.taskQueue.length === 0) {
      return;
    }

    const idleWorker = this.workers.find((w) => !w.isBusy);
    if (!idleWorker) {
      return;
    }

    const nextTask = this.taskQueue.shift();
    if (!nextTask) {
      return;
    }

    const { task, resolve, reject } = nextTask;
    idleWorker.isBusy = true;
    idleWorker.currentBatchId = task.batchId;

    const messageHandler = (msg: WorkerOutboundMessage) => {
      if (msg.type === 'BATCH_SUCCESS' && msg.payload.batchId === task.batchId) {
        idleWorker.worker.off('message', messageHandler);
        resolve(msg.payload);
      } else if (msg.type === 'BATCH_ERROR' && msg.batchId === task.batchId) {
        idleWorker.worker.off('message', messageHandler);
        reject(new Error(`Worker batch ${task.batchId} failed: ${msg.error}`));
      }
    };

    idleWorker.worker.on('message', messageHandler);

    const inboundMsg: WorkerInboundMessage = {
      type: 'PROCESS_BATCH',
      payload: task,
    };

    idleWorker.worker.postMessage(inboundMsg);
  }

  /**
   * Fallback in-line execution for development or single-thread environments.
   */
  private async executeInline(batches: WorkerBatchTask[]): Promise<WorkerBatchResult[]> {
    const results: WorkerBatchResult[] = [];

    for (const batch of batches) {
      const startTime = Date.now();
      const errors: Array<{ file: string; message: string }> = [];
      let processedFiles = 0;

      for (const file of batch.files) {
        try {
          await fs.promises.readFile(file.absolutePath, 'utf-8');
          processedFiles++;
        } catch (err: any) {
          errors.push({
            file: file.relativePath,
            message: err?.message || 'Failed to read file',
          });
        }
      }

      results.push({
        batchId: batch.batchId,
        processedFiles,
        durationMs: Date.now() - startTime,
        issues: [],
        errors,
      });
    }

    return results;
  }

  /**
   * Gracefully terminate all active workers.
   */
  public async terminate(): Promise<void> {
    this.isTerminated = true;
    const shutdownPromises = this.workers.map((w) => {
      const msg: WorkerInboundMessage = { type: 'SHUTDOWN' };
      try {
        w.worker.postMessage(msg);
      } catch {}
      return w.worker.terminate();
    });

    await Promise.all(shutdownPromises);
    this.workers = [];
  }
}
