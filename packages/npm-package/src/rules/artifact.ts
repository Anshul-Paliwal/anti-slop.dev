import type { Module } from '@swc/core';
import type { SlopIssue } from '@anti-slop/shared';
import { visitAst, offsetToLineColumn, type LineMap } from '../ast/visitor';
import type { SlopRule } from './index';
import { randomUUID } from 'node:crypto';

/**
 * ARTIFACT-001: Detect console.log / console.warn / console.error / console.debug / console.info calls.
 *
 * Flags leftover console statements that are typically AI-generated debugging artifacts.
 */
const consoleCallRule: SlopRule = {
  id: 'ARTIFACT-001',
  category: 'artifact',
  severity: 'warning',
  description: 'Detect console.log and other console method calls',

  check(ast: Module, source: string, filePath: string, lineMap: LineMap): SlopIssue[] {
    const issues: SlopIssue[] = [];
    const consoleMethods = new Set(['log', 'warn', 'error', 'debug', 'info', 'trace']);

    visitAst(ast, (node) => {
      if (
        node.type === 'CallExpression' &&
        node.callee?.type === 'MemberExpression' &&
        node.callee.object?.type === 'Identifier' &&
        node.callee.object.value === 'console' &&
        node.callee.property?.type === 'Identifier' &&
        consoleMethods.has(node.callee.property.value)
      ) {
        const method = node.callee.property.value;
        const loc = offsetToLineColumn(lineMap, node.span.start);
        const endLoc = offsetToLineColumn(lineMap, node.span.end);

        issues.push({
          id: randomUUID(),
          ruleId: 'ARTIFACT-001',
          category: 'artifact',
          severity: 'warning',
          message: `console.${method}() call left in code`,
          explanation:
            'Console statements are common AI-generated debugging artifacts. They should be removed or replaced with a proper logging framework before production.',
          location: {
            file: filePath,
            line: loc.line,
            column: loc.column,
            endLine: endLoc.line,
            endColumn: endLoc.column,
          },
          remediationSuggestion: `Remove this console.${method}() call or replace it with a structured logger.`,
        });
      }
    });

    return issues;
  },
};

/**
 * ARTIFACT-002: Detect `debugger` statements.
 *
 * Flags leftover debugger breakpoints that should never ship to production.
 */
const debuggerStatementRule: SlopRule = {
  id: 'ARTIFACT-002',
  category: 'artifact',
  severity: 'error',
  description: 'Detect debugger statements',

  check(ast: Module, source: string, filePath: string, lineMap: LineMap): SlopIssue[] {
    const issues: SlopIssue[] = [];

    visitAst(ast, (node) => {
      if (node.type === 'DebuggerStatement') {
        const loc = offsetToLineColumn(lineMap, node.span.start);
        const endLoc = offsetToLineColumn(lineMap, node.span.end);

        issues.push({
          id: randomUUID(),
          ruleId: 'ARTIFACT-002',
          category: 'artifact',
          severity: 'error',
          message: 'debugger statement left in code',
          explanation:
            'Debugger statements pause script execution and should never appear in production code. They are a common leftover from AI-assisted development sessions.',
          location: {
            file: filePath,
            line: loc.line,
            column: loc.column,
            endLine: endLoc.line,
            endColumn: endLoc.column,
          },
          remediationSuggestion: 'Remove the debugger statement.',
        });
      }
    });

    return issues;
  },
};

export const artifactRules: SlopRule[] = [consoleCallRule, debuggerStatementRule];
