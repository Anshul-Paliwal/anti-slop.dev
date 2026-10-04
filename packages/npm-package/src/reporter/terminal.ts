import pc from 'picocolors';
import type { SlopIssue, SlopCategory, SlopSeverity } from '@anti-slop/shared';

/**
 * Human-readable category labels for terminal display.
 */
const CATEGORY_LABELS: Record<SlopCategory, string> = {
  artifact: 'Artifact Debris',
  logic: 'Logic Bloat',
  security: 'Security Risk',
  'tailwind-css': 'Tailwind CSS',
  component: 'React Anti-Pattern',
};

/**
 * Get the display label for a slop category.
 */
function getCategoryLabel(category: SlopCategory): string {
  return CATEGORY_LABELS[category] || category;
}

/**
 * Render a colored left-border issue block to stdout.
 */
function renderIssueBlock(issue: SlopIssue): string {
  const isError = issue.severity === 'error';
  const icon = isError ? pc.red('✖') : pc.yellow('⚠');
  const label = isError
    ? pc.red(pc.bold(`[${getCategoryLabel(issue.category)}]`))
    : pc.yellow(pc.bold(`[${getCategoryLabel(issue.category)}]`));

  const fileRef = `${issue.location.file}:${issue.location.line}`;
  const coloredFileRef = isError
    ? pc.red(fileRef)
    : pc.yellow(fileRef);

  // Colored left border using box-drawing characters
  const borderColor = isError ? pc.red : pc.yellow;
  const border = borderColor('│');

  const lines: string[] = [];
  lines.push(`  ${border}  ${icon} ${label} ${coloredFileRef}`);
  lines.push(`  ${border}  ${pc.dim(issue.message)}`);

  if (issue.remediationSuggestion) {
    lines.push(`  ${border}  ${pc.dim(pc.italic('→ ' + issue.remediationSuggestion))}`);
  }

  return lines.join('\n');
}

/**
 * Render the full terminal scan report to stdout.
 *
 * Matches the target terminal UI design with colored issue blocks,
 * summary header, divider, and footer.
 */
export function renderTerminalReport(
  issues: SlopIssue[],
  totalFiles: number,
  durationMs: number
): void {
  console.log('');
  console.log(pc.bold(`Scanning ${totalFiles} files...`));
  console.log('');

  if (issues.length === 0) {
    console.log(pc.green(pc.bold('✔ No issues found — your code looks clean!')));
    console.log(pc.dim(`Completed in ${durationMs}ms`));
    console.log('');
    return;
  }

  // Sort: errors first, then warnings, then by file path
  const sorted = [...issues].sort((a, b) => {
    const severityOrder: Record<SlopSeverity, number> = {
      error: 0,
      warning: 1,
      info: 2,
      hint: 3,
    };
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    return a.location.file.localeCompare(b.location.file);
  });

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  // Summary line
  const summaryParts: string[] = [];
  if (errorCount > 0) summaryParts.push(pc.red(pc.bold(`${errorCount} error${errorCount !== 1 ? 's' : ''}`)));
  if (warningCount > 0) summaryParts.push(pc.yellow(pc.bold(`${warningCount} warning${warningCount !== 1 ? 's' : ''}`)));

  console.log(
    pc.bold(`Found ${issues.length} issue${issues.length !== 1 ? 's' : ''} requiring attention:`) +
    ` (${summaryParts.join(', ')})`
  );
  console.log('');

  // Render each issue block
  for (const issue of sorted) {
    console.log(renderIssueBlock(issue));
    console.log('');
  }

  // Divider
  console.log(pc.dim('────────────────────────────────────────────────────'));
  console.log('');

  // Timing
  console.log(pc.dim(`Completed in ${durationMs}ms`));

  // Footer hint
  console.log('');
  console.log(
    `  Press ${pc.bold(pc.bgWhite(pc.black(' f ')))} to auto-fix with ${pc.bold('Pro')} ${pc.dim('(or use --fix)')}`
  );
  console.log('');
}
