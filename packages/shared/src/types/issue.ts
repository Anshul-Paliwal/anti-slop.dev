/**
 * AntiSlop Detection Taxonomy categories.
 */
export type SlopCategory =
  | 'artifact'       // console.log, dead code, unused/hallucinated imports, duplicate helpers
  | 'logic'          // deeply nested ternaries, redundant null checks, duplicated branches
  | 'security'       // hardcoded secrets, unsafe eval, insecure defaults
  | 'tailwind-css'   // conflicting utilities, duplicate classes, ineffective combinations
  | 'component';     // unnecessary re-renders, prop drilling, missing hook deps

/**
 * Finding severity levels.
 */
export type SlopSeverity = 'error' | 'warning' | 'info' | 'hint';

/**
 * Precise source location coordinates.
 */
export interface SourceLocation {
  file: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}

/**
 * Normalized finding representation.
 */
export interface SlopIssue {
  /** Unique ID for this issue instance */
  id: string;
  /** Stable identifier for the rule (e.g. 'artifact/no-console-log') */
  ruleId: string;
  /** Category from the AntiSlop taxonomy */
  category: SlopCategory;
  /** Issue severity */
  severity: SlopSeverity;
  /** Short human-readable summary of the issue */
  message: string;
  /** In-depth explanation of why this pattern is problematic */
  explanation: string;
  /** Source location in the file */
  location: SourceLocation;
  /** Optional offending code snippet */
  codeSnippet?: string;
  /** Recommended remediation or proposed fix instructions */
  remediationSuggestion?: string;
}
