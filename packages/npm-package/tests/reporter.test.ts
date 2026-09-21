import { describe, it, expect } from 'vitest';
import type { SlopIssue } from '@anti-slop/shared';
import { generateMarkdownReport } from '../src/reporter/markdown';

function createMockIssue(overrides: Partial<SlopIssue> = {}): SlopIssue {
  return {
    id: 'test-id-1',
    ruleId: 'ARTIFACT-001',
    category: 'artifact',
    severity: 'warning',
    message: 'console.log() call left in code',
    explanation: 'Console statements should be removed before production.',
    location: {
      file: 'src/utils.ts',
      line: 12,
      column: 3,
    },
    remediationSuggestion: 'Remove this console.log call.',
    ...overrides,
  };
}

describe('Markdown Report Generator', () => {
  it('should generate valid XML slop-issue tags', () => {
    const issues: SlopIssue[] = [
      createMockIssue(),
      createMockIssue({
        id: 'test-id-2',
        ruleId: 'LOGIC-001',
        category: 'logic',
        severity: 'warning',
        message: 'Nested ternary expression detected',
        location: { file: 'src/auth.ts', line: 18, column: 5 },
        remediationSuggestion: 'Refactor to if/else.',
      }),
    ];

    const report = generateMarkdownReport(issues, 42, 120);

    // Should contain the header
    expect(report).toContain('# AntiSlop Analysis Report');

    // Should contain slop-issue XML tags
    expect(report).toContain('<slop-issue');
    expect(report).toContain('</slop-issue>');

    // Should contain correct attributes
    expect(report).toContain('id="ARTIFACT-001"');
    expect(report).toContain('file="src/utils.ts"');
    expect(report).toContain('line="12"');
    expect(report).toContain('severity="warning"');

    // Should contain description and suggested-action tags
    expect(report).toContain('<description>');
    expect(report).toContain('</description>');
    expect(report).toContain('<suggested-action>');
    expect(report).toContain('</suggested-action>');

    // Should contain the second issue
    expect(report).toContain('id="LOGIC-001"');
    expect(report).toContain('file="src/auth.ts"');
    expect(report).toContain('line="18"');
  });

  it('should report correct file count and issue count', () => {
    const issues = [createMockIssue()];
    const report = generateMarkdownReport(issues, 142, 500);

    expect(report).toContain('142');
    expect(report).toContain('Found **1** issue');
  });

  it('should handle zero issues gracefully', () => {
    const report = generateMarkdownReport([], 50, 100);

    expect(report).toContain('No slop issues detected');
    expect(report).not.toContain('<slop-issue');
  });

  it('should escape XML special characters in content', () => {
    const issue = createMockIssue({
      message: 'Expression uses < and > operators & "quotes"',
    });
    const report = generateMarkdownReport([issue], 10, 50);

    expect(report).toContain('&lt;');
    expect(report).toContain('&gt;');
    expect(report).toContain('&amp;');
    expect(report).toContain('&quot;');
  });

  it('should include severity summary table', () => {
    const issues = [
      createMockIssue({ severity: 'error' }),
      createMockIssue({ id: 'test-2', severity: 'warning' }),
      createMockIssue({ id: 'test-3', severity: 'warning' }),
    ];
    const report = generateMarkdownReport(issues, 20, 100);

    expect(report).toContain('| 🔴 Error | 1 |');
    expect(report).toContain('| 🟡 Warning | 2 |');
  });
});
