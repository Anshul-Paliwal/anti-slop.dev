import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import fg from 'fast-glob';
import {
  DiscoveredFile,
  FileDiscoveryResult,
  ScanOptions,
} from '@anti-slop/shared';
import { FileTypeRegistry, defaultFileTypeRegistry } from './file-types';
import { IgnoreManager } from './ignore-rules';

const DEFAULT_MAX_FILE_SIZE_KB = 1024; // 1 MB limit for analysis files

/**
 * High-performance file discoverer using fast-glob and extensible file-type registry.
 */
export async function discoverFiles(
  options: ScanOptions,
  registry: FileTypeRegistry = defaultFileTypeRegistry
): Promise<FileDiscoveryResult> {
  const startTime = performance.now();

  const targetPath = options.targetPath || process.cwd();
  const absoluteTarget = path.resolve(process.cwd(), targetPath);

  const maxFileSizeBytes = (options.maxFileSizeKb ?? DEFAULT_MAX_FILE_SIZE_KB) * 1024;
  const extensionBreakdown: Record<string, number> = {};
  const files: DiscoveredFile[] = [];
  let ignoredCount = 0;

  if (!fs.existsSync(absoluteTarget)) {
    throw new Error(`Target path does not exist: "${absoluteTarget}"`);
  }

  const targetStat = fs.statSync(absoluteTarget);

  // Case 1: Scanning a single file directly
  if (targetStat.isFile()) {
    const ext = path.extname(absoluteTarget).toLowerCase();
    if (registry.isSupported(ext)) {
      if (targetStat.size <= maxFileSizeBytes) {
        const file: DiscoveredFile = {
          absolutePath: absoluteTarget,
          relativePath: path.basename(absoluteTarget),
          extension: ext,
          category: registry.getCategory(ext),
          sizeBytes: targetStat.size,
        };
        files.push(file);
        extensionBreakdown[ext] = 1;
      } else {
        ignoredCount++;
      }
    }

    const durationMs = Math.round(performance.now() - startTime);
    return {
      files,
      totalCount: files.length,
      ignoredCount,
      durationMs,
      extensionBreakdown,
    };
  }

  // Case 2: Scanning a workspace / directory
  const ignoreManager = new IgnoreManager(options.ignorePatterns || []);
  ignoreManager.loadIgnoreFiles(absoluteTarget);

  const globPattern = registry.getGlobPattern(options.includeExtensions);

  // Fast-glob search inside target directory
  const rawEntries = await fg(globPattern, {
    cwd: absoluteTarget,
    dot: true,
    onlyFiles: true,
    followSymbolicLinks: false,
    ignore: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
    ],
  });

  for (const entry of rawEntries) {
    const normalizedRelPath = entry.replace(/\\/g, '/');

    // 1. Check ignore rules (.gitignore, .antislopignore, built-ins)
    if (ignoreManager.isIgnored(normalizedRelPath)) {
      ignoredCount++;
      continue;
    }

    const absoluteFilePath = path.join(absoluteTarget, entry);
    const ext = path.extname(entry).toLowerCase();

    // 2. Check if extension is supported in registry
    if (!registry.isSupported(ext)) {
      ignoredCount++;
      continue;
    }

    try {
      const fileStat = fs.statSync(absoluteFilePath);

      // 3. Skip oversized files (e.g. huge compiled bundles or assets)
      if (fileStat.size > maxFileSizeBytes) {
        ignoredCount++;
        continue;
      }

      const discoveredFile: DiscoveredFile = {
        absolutePath: absoluteFilePath,
        relativePath: normalizedRelPath,
        extension: ext,
        category: registry.getCategory(ext),
        sizeBytes: fileStat.size,
      };

      files.push(discoveredFile);
      extensionBreakdown[ext] = (extensionBreakdown[ext] || 0) + 1;
    } catch {
      // Skip file if unable to stat (e.g. broken symlink)
      ignoredCount++;
    }
  }

  const durationMs = Math.round(performance.now() - startTime);

  return {
    files,
    totalCount: files.length,
    ignoredCount,
    durationMs,
    extensionBreakdown,
  };
}
