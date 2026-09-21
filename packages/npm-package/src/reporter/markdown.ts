import fs from 'node:fs';
import path from 'node:path';
import type { SlopIssue } from '@anti-slop/shared';

/**
 * Escape XML special characters in text content.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Serialize a single SlopIssue into an XML-tagged block for the markdown report.
 *
 * Produces the format expected by the VS Code extension:
 * ```xml
 * <slop-issue id="RULE-ID" file="path" line="N" severity="warning">
 *   <description>...</description>
 *   <suggested-action>...</suggested-action>
 * </slop-issue>
 * ```
 */
function issueToXml(issue: SlopIssue): string {
  const attrs = [
    `id="${escapeXml(issue.ruleId)}"`,
    `file="${escapeXml(issue.location.file)}"`,
    `line="${issue.location.line}"`,
    `severity="${issue.severity}"`,
  ].join(' ');

  const description = escapeXml(issue.message);
  const suggestedAction = issue.remediationSuggestion
    ? escapeXml(issue.remediationSuggestion)
    : 'Review and address this issue.';

  return [
    `<slop-issue ${attrs}>`,
    `  <description>${description}</description>`,
    `  <suggested-action>${suggestedAction}</suggested-action>`,
    `</slop-issue>`,
  ].join('\n');
}

/**
 * Generate the full antislop-report.md content.
 */
export function generateMarkdownReport(
  issues: SlopIssue[],
  totalFiles: number,
  durationMs: number
): string {
  const timestamp = new Date().toISOString();
  const lines: string[] = [];

  lines.push('# AntiSlop Analysis Report');
  lines.push('');
  lines.push(`> Generated at ${timestamp}`);
  lines.push(`> Scanned **${totalFiles}** files in **${durationMs}ms**`);
  lines.push(`> Found **${issues.length}** issue${issues.length !== 1 ? 's' : ''}`);
  lines.push('');

  if (issues.length === 0) {
    lines.push('✅ No slop issues detected. Your code looks clean!');
    lines.push('');
    return lines.join('\n');
  }

  // Group issues by severity for summary
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info' || i.severity === 'hint').length;

  lines.push('## Summary');
  lines.push('');
  lines.push(`| Severity | Count |`);
  lines.push(`|----------|-------|`);
  if (errorCount > 0) lines.push(`| 🔴 Error | ${errorCount} |`);
  if (warningCount > 0) lines.push(`| 🟡 Warning | ${warningCount} |`);
  if (infoCount > 0) lines.push(`| 🔵 Info | ${infoCount} |`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Issues');
  lines.push('');

  // Sort issues: errors first, then by file
  const sorted = [...issues].sort((a, b) => {
    if (a.severity === 'error' && b.severity !== 'error') return -1;
    if (a.severity !== 'error' && b.severity === 'error') return 1;
    const fileCmp = a.location.file.localeCompare(b.location.file);
    if (fileCmp !== 0) return fileCmp;
    return a.location.line - b.location.line;
  });

  for (const issue of sorted) {
    lines.push(issueToXml(issue));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Write the antislop-report.md to disk.
 *
 * @param issues     All detected SlopIssue objects
 * @param outputPath Destination file path (default: ./antislop-report.md)
 * @param totalFiles Number of files scanned
 * @param durationMs Scan duration in milliseconds
 */
export function writeMarkdownReport(
  issues: SlopIssue[],
  outputPath: string = 'antislop-report.md',
  totalFiles: number = 0,
  durationMs: number = 0
): string {
  const resolvedPath = path.resolve(process.cwd(), outputPath);
  const content = generateMarkdownReport(issues, totalFiles, durationMs);

  // Ensure parent directory exists
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(resolvedPath, content, 'utf-8');
  return resolvedPath;
}
