import type { Module, ModuleItem, Statement, Expression, Pattern, Declaration } from '@swc/core';

/**
 * Precomputed line-start offsets for efficient offset → line:column conversion.
 */
export interface LineMap {
  /** Byte offset where each line starts (0-indexed line number) */
  lineStarts: number[];
}

/**
 * Build a line map from source text for converting byte offsets to line:column.
 */
export function buildLineMap(source: string): LineMap {
  const lineStarts: number[] = [0];
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\n') {
      lineStarts.push(i + 1);
    }
  }
  return { lineStarts };
}

/**
 * Convert a byte offset to a 1-based line and 1-based column.
 */
export function offsetToLineColumn(
  lineMap: LineMap,
  offset: number
): { line: number; column: number } {
  const { lineStarts } = lineMap;

  // Binary search for the line containing this offset
  let low = 0;
  let high = lineStarts.length - 1;

  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (lineStarts[mid] <= offset) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return {
    line: low + 1,         // 1-based
    column: offset - lineStarts[low] + 1, // 1-based
  };
}

/**
 * Callback invoked for each AST node during traversal.
 */
export type VisitorCallback = (node: any, parent: any | null) => void;

/**
 * Recursively walk all nodes in an SWC AST Module.
 *
 * Visits every reachable node, passing the node and its parent to the callback.
 * This is a generic depth-first traversal that handles all SWC node shapes.
 */
export function visitAst(ast: Module, callback: VisitorCallback): void {
  walkNode(ast, null, callback);
}

function walkNode(node: any, parent: any | null, callback: VisitorCallback): void {
  if (node === null || node === undefined || typeof node !== 'object') {
    return;
  }

  // Arrays are iterated but not visited as nodes themselves
  if (Array.isArray(node)) {
    for (const child of node) {
      walkNode(child, parent, callback);
    }
    return;
  }

  // Only visit objects that have a 'type' property (actual AST nodes)
  if ('type' in node) {
    callback(node, parent);
  }

  // Recurse into all child properties
  const keys = Object.keys(node);
  for (const key of keys) {
    // Skip metadata / location fields to avoid infinite loops
    if (key === 'span' || key === 'type') continue;

    const value = node[key];
    if (value && typeof value === 'object') {
      walkNode(value, node, callback);
    }
  }
}
