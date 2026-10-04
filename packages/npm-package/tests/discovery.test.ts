import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { IgnoreManager, DEFAULT_IGNORE_PATTERNS } from '../src/discovery/ignore-rules';
import { discoverFiles } from '../src/discovery/discoverer';

describe('IgnoreManager', () => {
  it('should ignore node_modules and build directories by default', () => {
    const mgr = new IgnoreManager();
    expect(mgr.isIgnored('node_modules/react/index.js')).toBe(true);
    expect(mgr.isIgnored('dist/index.js')).toBe(true);
    expect(mgr.isIgnored('.git/config')).toBe(true);
    expect(mgr.isIgnored('.next/server/app.js')).toBe(true);
    expect(mgr.isIgnored('bundle.min.js')).toBe(true);
  });

  it('should not ignore source files', () => {
    const mgr = new IgnoreManager();
    expect(mgr.isIgnored('src/index.ts')).toBe(false);
    expect(mgr.isIgnored('src/components/Button.tsx')).toBe(false);
    expect(mgr.isIgnored('styles/main.css')).toBe(false);
  });

  it('should respect custom ignore patterns', () => {
    const mgr = new IgnoreManager(['legacy/**', '*.test.ts']);
    expect(mgr.isIgnored('legacy/old-util.ts')).toBe(true);
    expect(mgr.isIgnored('src/app.test.ts')).toBe(true);
    expect(mgr.isIgnored('src/app.ts')).toBe(false);
  });
});

describe('discoverFiles', () => {
  it('should discover files in this package and return valid metrics', async () => {
    const rootPath = path.resolve(__dirname, '..');
    const result = await discoverFiles({
      targetPath: rootPath,
      ignorePatterns: ['dist/**', 'node_modules/**'],
    });

    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(result.files.some((f: any) => f.relativePath.includes('src/discovery/discoverer.ts'))).toBe(true);
    expect(result.files.every((f: any) => !f.relativePath.includes('node_modules'))).toBe(true);
  });

  it('should support scanning a single file directly', async () => {
    const singleFilePath = path.resolve(__dirname, '../src/discovery/file-types.ts');
    const result = await discoverFiles({
      targetPath: singleFilePath,
    });

    expect(result.totalCount).toBe(1);
    expect(result.files[0].extension).toBe('.ts');
    expect(result.files[0].category).toBe('typescript');
  });
});
