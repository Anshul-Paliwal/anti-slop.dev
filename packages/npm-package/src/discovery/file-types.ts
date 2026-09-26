import path from 'node:path';
import {
  DEFAULT_FILE_TYPES,
  FileTypeDefinition,
  LanguageCategory,
} from '@anti-slop/shared';

/**
 * Extensible registry for supported file types and extensions.
 * Allows effortless addition of new languages/extensions in the future.
 */
export class FileTypeRegistry {
  private definitionsByExt: Map<string, FileTypeDefinition> = new Map();

  constructor(initialTypes: FileTypeDefinition[] = DEFAULT_FILE_TYPES) {
    this.registerMany(initialTypes);
  }

  /**
   * Register a new file type definition.
   * @example
   * registry.register({ extension: '.py', category: 'unknown', label: 'Python' });
   */
  public register(def: FileTypeDefinition): this {
    const ext = this.normalizeExtension(def.extension);
    this.definitionsByExt.set(ext, {
      ...def,
      extension: ext,
    });
    return this;
  }

  /**
   * Register multiple file type definitions at once.
   */
  public registerMany(defs: FileTypeDefinition[]): this {
    for (const def of defs) {
      this.register(def);
    }
    return this;
  }

  /**
   * Check if a given file path or extension is supported.
   */
  public isSupported(filePathOrExt: string): boolean {
    const ext = this.extractExtension(filePathOrExt);
    return this.definitionsByExt.has(ext);
  }

  /**
   * Retrieve the definition for a file path or extension.
   */
  public getDefinition(filePathOrExt: string): FileTypeDefinition | undefined {
    const ext = this.extractExtension(filePathOrExt);
    return this.definitionsByExt.get(ext);
  }

  /**
   * Retrieve the language category for a file.
   */
  public getCategory(filePathOrExt: string): LanguageCategory {
    const def = this.getDefinition(filePathOrExt);
    return def ? def.category : 'unknown';
  }

  /**
   * Get all registered file extensions (e.g. ['.ts', '.tsx', '.js', ...]).
   */
  public getSupportedExtensions(): string[] {
    return Array.from(this.definitionsByExt.keys());
  }

  /**
   * Construct a fast-glob pattern matching all registered extensions.
   * @param customExtensions Optional subset of extensions to filter by
   */
  public getGlobPattern(customExtensions?: string[]): string {
    const exts = customExtensions && customExtensions.length > 0
      ? customExtensions.map((e) => this.normalizeExtension(e).replace(/^\./, ''))
      : this.getSupportedExtensions().map((e) => e.replace(/^\./, ''));

    if (exts.length === 0) {
      return '**/*';
    }

    if (exts.length === 1) {
      return `**/*.${exts[0]}`;
    }

    return `**/*.{${exts.join(',')}}`;
  }

  private normalizeExtension(ext: string): string {
    return ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
  }

  private extractExtension(filePathOrExt: string): string {
    if (filePathOrExt.startsWith('.') && !filePathOrExt.includes('/') && !filePathOrExt.includes('\\')) {
      return this.normalizeExtension(filePathOrExt);
    }
    return this.normalizeExtension(path.extname(filePathOrExt));
  }
}

/**
 * Default shared singleton registry instance.
 */
export const defaultFileTypeRegistry = new FileTypeRegistry();
