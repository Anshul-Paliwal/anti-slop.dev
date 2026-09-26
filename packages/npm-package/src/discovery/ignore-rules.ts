import fs from 'node:fs';
import path from 'node:path';
import ignore, { Ignore } from 'ignore';

/**
 * Built-in default ignore patterns to skip dependency folders, build artifacts,
 * lockfiles, caches, minified bundles, and VCS metadata.
 */
export const DEFAULT_IGNORE_PATTERNS: string[] = [
  // Version control
  '.git/**',
  '.svn/**',
  '.hg/**',

  // Dependencies
  'node_modules/**',
  'bower_components/**',
  '.pnp/**',
  '.pnp.js',

  // Build outputs & caches
  'dist/**',
  'build/**',
  'out/**',
  '.next/**',
  '.nuxt/**',
  '.output/**',
  '.turbo/**',
  '.cache/**',
  '.parcel-cache/**',
  '.vite/**',
  'coverage/**',
  '.nyc_output/**',

  // Minified, bundled & source map files
  '*.min.js',
  '*.min.css',
  '*.bundle.js',
  '*.chunk.js',
  '*.map',

  // Package manager lockfiles
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'bun.lockb',

  // OS & IDE files
  '.DS_Store',
  'Thumbs.db',
  '.idea/**',
  '.vscode/**',
  '*.log',
];

export class IgnoreManager {
  private ig: Ignore;
  private customPatterns: string[] = [];

  constructor(customPatterns: string[] = []) {
    this.ig = ignore();
    // Add default built-in ignore patterns
    this.ig.add(DEFAULT_IGNORE_PATTERNS);

    if (customPatterns.length > 0) {
      this.addPatterns(customPatterns);
    }
  }

  /**
   * Add custom ignore patterns (e.g. from CLI flags).
   */
  public addPatterns(patterns: string[]): this {
    const valid = patterns.filter((p) => p && typeof p === 'string' && p.trim().length > 0);
    if (valid.length > 0) {
      this.ig.add(valid);
      this.customPatterns.push(...valid);
    }
    return this;
  }

  /**
   * Automatically load .gitignore and .antislopignore files from target directory.
   */
  public loadIgnoreFiles(rootDir: string): this {
    const ignoreFileCandidates = ['.gitignore', '.antislopignore'];

    for (const file of ignoreFileCandidates) {
      const filePath = path.join(rootDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0 && !line.startsWith('#'));

          if (lines.length > 0) {
            this.ig.add(lines);
          }
        } catch {
          // Gracefully continue if an ignore file cannot be read
        }
      }
    }

    return this;
  }

  /**
   * Check whether a relative file path should be ignored.
   * Path should be normalized with forward slashes.
   */
  public isIgnored(relativePath: string): boolean {
    const normalized = relativePath.replace(/\\/g, '/').replace(/^\.\//, '');
    if (!normalized || normalized === '.') {
      return false;
    }
    return this.ig.ignores(normalized);
  }

  /**
   * Retrieve all default ignore patterns.
   */
  public getDefaultPatterns(): string[] {
    return [...DEFAULT_IGNORE_PATTERNS];
  }
}
