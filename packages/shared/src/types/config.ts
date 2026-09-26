import { LanguageCategory } from './file-types';

/**
 * Scan configuration and CLI execution options.
 */
export interface ScanOptions {
  /** Target root directory or file path to scan */
  targetPath: string;
  /** Custom ignore patterns in addition to built-in rules */
  ignorePatterns?: string[];
  /** Custom list of file extensions to include */
  includeExtensions?: string[];
  /** Maximum file size in kilobytes before skipping (default: 1024 KB = 1MB) */
  maxFileSizeKb?: number;
  /** Number of concurrent worker threads (default: hardware concurrency) */
  concurrency?: number;
  /** Output file path for antislop report */
  output?: string;
  /** If true, executes Stage 1 file discovery only and prints inventory summary */
  dryRun?: boolean;
  /** Enable detailed diagnostic and timing logs */
  verbose?: boolean;
}

/**
 * Metadata for a discovered file ready for parsing and analysis.
 */
export interface DiscoveredFile {
  /** Absolute path on disk */
  absolutePath: string;
  /** Relative path from workspace root */
  relativePath: string;
  /** File extension (e.g. '.ts') */
  extension: string;
  /** Language category (e.g. 'typescript') */
  category: LanguageCategory;
  /** File size in bytes */
  sizeBytes: number;
}

/**
 * Result of the Stage 1 file discovery process.
 */
export interface FileDiscoveryResult {
  /** Discovered files ready for processing */
  files: DiscoveredFile[];
  /** Total matching files found */
  totalCount: number;
  /** Total skipped files (ignored or oversized) */
  ignoredCount: number;
  /** Duration of discovery phase in milliseconds */
  durationMs: number;
  /** Count of discovered files grouped by extension */
  extensionBreakdown: Record<string, number>;
}
