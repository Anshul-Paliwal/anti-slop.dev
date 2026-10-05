export interface LocalSlopIssue {
    id: string;
    ruleId: string;
    category: 'artifact' | 'logic' | 'security' | 'react';
    severity: 'error' | 'warning' | 'info';
    message: string;
    explanation: string;
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    remediationSuggestion: string;
}

/**
 * Run deterministic static heuristic checks (mirrored from anti-slop CLI)
 * instantly in-memory without making any LLM API calls.
 */
export function runLocalRules(source: string, fileName: string): LocalSlopIssue[] {
    const issues: LocalSlopIssue[] = [];
    const lines = source.split('\n');

    lines.forEach((lineText, index) => {
        const lineNum = index + 1;

        // 1. ARTIFACT-001: Console calls
        const consoleMatch = lineText.match(/\bconsole\.(log|warn|error|debug|info|trace)\s*\(/);
        if (consoleMatch && !lineText.trim().startsWith('//') && !lineText.trim().startsWith('*')) {
            const col = consoleMatch.index ? consoleMatch.index + 1 : 1;
            issues.push({
                id: `local-artifact-001-${lineNum}`,
                ruleId: 'ARTIFACT-001',
                category: 'artifact',
                severity: 'warning',
                message: `console.${consoleMatch[1]}() left in code`,
                explanation: 'Leftover debugging statements are a hallmark of AI-generated code. Remove or use a structured logger.',
                line: lineNum,
                column: col,
                endLine: lineNum,
                endColumn: col + consoleMatch[0].length,
                remediationSuggestion: `Remove console.${consoleMatch[1]}() before shipping.`
            });
        }

        // 2. ARTIFACT-002: Debugger statements
        const debuggerMatch = lineText.match(/\bdebugger\s*;?/);
        if (debuggerMatch && !lineText.trim().startsWith('//') && !lineText.trim().startsWith('*')) {
            const col = debuggerMatch.index ? debuggerMatch.index + 1 : 1;
            issues.push({
                id: `local-artifact-002-${lineNum}`,
                ruleId: 'ARTIFACT-002',
                category: 'artifact',
                severity: 'error',
                message: 'debugger statement left in code',
                explanation: 'Debugger breakpoints freeze client execution and must never ship to production.',
                line: lineNum,
                column: col,
                endLine: lineNum,
                endColumn: col + debuggerMatch[0].length,
                remediationSuggestion: 'Remove the debugger statement.'
            });
        }

        // 3. LOGIC-002: Empty catch blocks
        if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(lineText)) {
            issues.push({
                id: `local-logic-002-${lineNum}`,
                ruleId: 'LOGIC-002',
                category: 'logic',
                severity: 'warning',
                message: 'Empty catch block silently swallows errors',
                explanation: 'AI often creates empty catch clauses that swallow runtime exceptions without logging or handling.',
                line: lineNum,
                column: 1,
                endLine: lineNum,
                endColumn: lineText.length,
                remediationSuggestion: 'Log the error or handle it properly.'
            });
        }

        // 4. AI-SLOP-001: Placeholder API keys & AI markers
        const placeholderMatch = lineText.match(/(YOUR_API_KEY_HERE|YOUR_SECRET_KEY|INSERT_API_KEY|TODO:\s*Add error handling|TODO:\s*Implement this)/i);
        if (placeholderMatch) {
            issues.push({
                id: `local-slop-001-${lineNum}`,
                ruleId: 'AI-SLOP-001',
                category: 'artifact',
                severity: 'warning',
                message: `Unresolved AI placeholder "${placeholderMatch[0]}"`,
                explanation: 'AI models frequently leave placeholders in generated templates that are forgotten by developers.',
                line: lineNum,
                column: placeholderMatch.index ? placeholderMatch.index + 1 : 1,
                endLine: lineNum,
                endColumn: (placeholderMatch.index ? placeholderMatch.index : 0) + placeholderMatch[0].length,
                remediationSuggestion: `Replace placeholder with your actual implementation or environment variable.`
            });
        }

        // 5. LOGIC-001: Nested ternary operator on single line
        const questionMarks = (lineText.match(/\?/g) || []).length;
        const colons = (lineText.match(/:/g) || []).length;
        if (questionMarks >= 2 && colons >= 2 && !lineText.trim().startsWith('//')) {
            issues.push({
                id: `local-logic-001-${lineNum}`,
                ruleId: 'LOGIC-001',
                category: 'logic',
                severity: 'info',
                message: 'Nested ternary operator detected',
                explanation: 'Nested ternaries reduce readability and are commonly produced by LLMs condensing conditionals.',
                line: lineNum,
                column: 1,
                endLine: lineNum,
                endColumn: lineText.length,
                remediationSuggestion: 'Refactor into readable if/else statements or a dictionary mapping.'
            });
        }
    });

    return issues;
}
