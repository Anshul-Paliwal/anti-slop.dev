import type { Module } from '@swc/core';
import type { SlopIssue } from '@anti-slop/shared';
import { visitAst, offsetToLineColumn, type LineMap } from '../ast/visitor';
import type { SlopRule } from './index';
import { randomUUID } from 'node:crypto';

/**
 * REACT-001: Detect inline object literals and arrow functions passed as JSX attribute values.
 *
 * Inline objects/functions in JSX props cause unnecessary re-renders because they
 * create new references on every render. This is a very common AI-generated pattern.
 */
const inlineJsxPropRule: SlopRule = {
  id: 'REACT-001',
  category: 'component',
  severity: 'warning',
  description: 'Detect inline objects/functions in JSX props without memoization',

  check(ast: Module, source: string, filePath: string, lineMap: LineMap): SlopIssue[] {
    const issues: SlopIssue[] = [];

    // Only check files that look like they contain JSX
    const ext = filePath.toLowerCase();
    if (!ext.endsWith('.jsx') && !ext.endsWith('.tsx')) {
      return issues;
    }

    visitAst(ast, (node) => {
      if (node.type === 'JSXAttribute' && node.value) {
        const value = node.value;

        // JSX expression container: <Comp prop={...} />
        if (value.type === 'JSXExpressionContainer' && value.expression) {
          const expr = value.expression;
          const isInlineObject = expr.type === 'ObjectExpression';
          const isInlineArrow = expr.type === 'ArrowFunctionExpression';
          const isInlineFunction = expr.type === 'FunctionExpression';

          if (isInlineObject || isInlineArrow || isInlineFunction) {
            const attrName =
              node.name?.type === 'Identifier'
                ? node.name.value
                : node.name?.name?.value || 'prop';

            const exprType = isInlineObject
              ? 'object literal'
              : 'function';

            const loc = offsetToLineColumn(lineMap, node.span.start);
            const endLoc = offsetToLineColumn(lineMap, node.span.end);

            issues.push({
              id: randomUUID(),
              ruleId: 'REACT-001',
              category: 'component',
              severity: 'warning',
              message: `Inline ${exprType} passed to JSX prop "${attrName}"`,
              explanation:
                `Inline ${exprType}s in JSX props create new references on every render, causing unnecessary re-renders of child components. This is a frequent pattern in AI-generated React code.`,
              location: {
                file: filePath,
                line: loc.line,
                column: loc.column,
                endLine: endLoc.line,
                endColumn: endLoc.column,
              },
              remediationSuggestion: isInlineObject
                ? `Extract the object to a constant or wrap with useMemo().`
                : `Extract the function or wrap with useCallback().`,
            });
          }
        }
      }
    });

    return issues;
  },
};

export const reactRules: SlopRule[] = [inlineJsxPropRule];
