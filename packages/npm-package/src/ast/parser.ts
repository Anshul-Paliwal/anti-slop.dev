import { parseSync, type Module, type ParserConfig } from '@swc/core';
import path from 'node:path';

/**
 * Result of a source-to-AST parse attempt.
 */
export interface ParseResult {
  /** The parsed AST module, or null if parsing failed */
  ast: Module | null;
  /** Parse error message, if parsing failed */
  error?: string;
}

/**
 * Resolve the SWC parser configuration based on file extension.
 */
function getParserConfig(filePath: string): ParserConfig {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.ts':
    case '.mts':
    case '.cts':
      return { syntax: 'typescript', tsx: false, decorators: true, dynamicImport: true };

    case '.tsx':
      return { syntax: 'typescript', tsx: true, decorators: true, dynamicImport: true };

    case '.jsx':
      return { syntax: 'ecmascript', jsx: true, decorators: true, dynamicImport: true };

    case '.js':
    case '.mjs':
    case '.cjs':
    default:
      return { syntax: 'ecmascript', jsx: false, decorators: true, dynamicImport: true };
  }
}

/**
 * Parse source code into an SWC AST Module.
 *
 * Returns a ParseResult with either the AST or an error message.
 * Never throws — syntax errors are captured gracefully.
 *
 * @param source   The source code string
 * @param filePath The file path (used to determine parser config)
 */
export function parseSource(source: string, filePath: string): ParseResult {
  try {
    const config = getParserConfig(filePath);
    const ast = parseSync(source, {
      ...config,
      comments: false,
      script: false,
      target: 'es2022',
    });

    return { ast };
  } catch (err: any) {
    return {
      ast: null,
      error: err?.message || `Failed to parse ${filePath}`,
    };
  }
}
