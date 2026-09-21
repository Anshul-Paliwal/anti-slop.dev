import type { Module } from '@swc/core';
import type { SlopIssue, SlopCategory, SlopSeverity } from '@anti-slop/shared';
import { LineMap } from '../ast/visitor';

import { artifactRules } from './artifact.js';
import { logicRules } from './logic.js';
import { reactRules } from './react.js';

/**
 * A heuristic rule that inspects an AST and produces SlopIssue findings.
 */
export interface SlopRule {
  /** Stable rule identifier, e.g. 'ARTIFACT-001' */
  id: string;
  /** Slop taxonomy category */
  category: SlopCategory;
  /** Default severity for issues from this rule */
  severity: SlopSeverity;
  /** Human-readable rule description */
  description: string;
  /**
   * Run this rule against a parsed AST.
   *
   * @param ast      Parsed SWC Module AST
   * @param source   Original source code (for snippet extraction)
   * @param filePath Relative file path
   * @param lineMap  Precomputed line offset map
   * @returns Array of detected issues
   */
  check(ast: Module, source: string, filePath: string, lineMap: LineMap): SlopIssue[];
}

/**
 * The global registry of all active heuristic rules.
 */
export const ruleRegistry: SlopRule[] = [
  ...artifactRules,
  ...logicRules,
  ...reactRules,
];

/**
 * Execute all registered rules against an AST and return merged issues.
 */
export function executeRules(
  ast: Module,
  source: string,
  filePath: string,
  lineMap: LineMap
): SlopIssue[] {
  const issues: SlopIssue[] = [];

  for (const rule of ruleRegistry) {
    try {
      const ruleIssues = rule.check(ast, source, filePath, lineMap);
      issues.push(...ruleIssues);
    } catch {
      // Swallow rule-level errors to avoid blocking the entire scan
    }
  }

  return issues;
}
