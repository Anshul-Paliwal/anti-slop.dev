import { describe, it, expect } from 'vitest';
import type { SlopIssue } from '@anti-slop/shared';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { parseSource } from '../src/ast/parser.js';
import { buildLineMap } from '../src/ast/visitor.js';
import { executeRules } from '../src/rules/index.js';

const fixturesDir = path.join(__dirname, 'fixtures');

function analyzeFixture(filename: string) {
  const filePath = path.join(fixturesDir, filename);
  const source = fs.readFileSync(filePath, 'utf-8');
  const { ast } = parseSource(source, filePath);
  if (!ast) throw new Error(`Failed to parse ${filename}`);
  const lineMap = buildLineMap(source);
  return executeRules(ast, source, filename, lineMap);
}

describe('ARTIFACT-001: console.log detection', () => {
  it('should detect console.log calls with correct line numbers', () => {
    const issues = analyzeFixture('slop-sample.ts');
    const consoleLogs = issues.filter((i: SlopIssue) => i.ruleId === 'ARTIFACT-001');

    expect(consoleLogs.length).toBeGreaterThanOrEqual(2);

    // First console.log is on the line containing 'processing items'
    const first = consoleLogs.find((i: SlopIssue) => i.message.includes('console.log'));
    expect(first).toBeDefined();
    expect(first!.location.line).toBeGreaterThan(0);
    expect(first!.severity).toBe('warning');
    expect(first!.category).toBe('artifact');
  });

  it('should detect console.debug calls', () => {
    const issues = analyzeFixture('slop-sample.ts');
    const debugCalls = issues.filter(
      (i: SlopIssue) => i.ruleId === 'ARTIFACT-001' && i.message.includes('console.debug')
    );

    expect(debugCalls.length).toBeGreaterThanOrEqual(1);
  });
});

describe('ARTIFACT-002: debugger statement detection', () => {
  it('should detect debugger statements', () => {
    const issues = analyzeFixture('slop-sample.ts');
    const debuggerIssues = issues.filter((i: SlopIssue) => i.ruleId === 'ARTIFACT-002');

    expect(debuggerIssues.length).toBe(1);
    expect(debuggerIssues[0].severity).toBe('error');
    expect(debuggerIssues[0].category).toBe('artifact');
    expect(debuggerIssues[0].location.line).toBeGreaterThan(0);
  });
});

describe('LOGIC-001: nested ternary detection', () => {
  it('should detect nested ternary expressions', () => {
    const issues = analyzeFixture('slop-sample.ts');
    const ternaryIssues = issues.filter((i: SlopIssue) => i.ruleId === 'LOGIC-001');

    expect(ternaryIssues.length).toBeGreaterThanOrEqual(1);
    expect(ternaryIssues[0].severity).toBe('warning');
    expect(ternaryIssues[0].category).toBe('logic');
    expect(ternaryIssues[0].message).toContain('Nested ternary');
    expect(ternaryIssues[0].location.line).toBeGreaterThan(0);
  });

  it('should flag nested ternaries from inline code', () => {
    const source = `const x = a ? (b ? 1 : 2) : 3;`;
    const { ast } = parseSource(source, 'test.ts');
    expect(ast).not.toBeNull();
    const lineMap = buildLineMap(source);
    const issues = executeRules(ast!, source, 'test.ts', lineMap);

    const ternaryIssues = issues.filter((i: SlopIssue) => i.ruleId === 'LOGIC-001');
    expect(ternaryIssues.length).toBe(1);
    expect(ternaryIssues[0].location.line).toBe(1);
  });
});

describe('LOGIC-002: empty catch block detection', () => {
  it('should detect empty catch blocks', () => {
    const issues = analyzeFixture('slop-sample.ts');
    const catchIssues = issues.filter((i: SlopIssue) => i.ruleId === 'LOGIC-002');

    expect(catchIssues.length).toBeGreaterThanOrEqual(1);
    expect(catchIssues[0].severity).toBe('warning');
    expect(catchIssues[0].category).toBe('logic');
    expect(catchIssues[0].location.line).toBeGreaterThan(0);
  });

  it('should not flag catch blocks with content', () => {
    const source = `try { foo(); } catch (e) { console.error(e); }`;
    const { ast } = parseSource(source, 'test.ts');
    expect(ast).not.toBeNull();
    const lineMap = buildLineMap(source);
    const issues = executeRules(ast!, source, 'test.ts', lineMap);

    // Should have ARTIFACT-001 for console.error, but NOT LOGIC-002
    const catchIssues = issues.filter((i: SlopIssue) => i.ruleId === 'LOGIC-002');
    expect(catchIssues.length).toBe(0);
  });
});

describe('REACT-001: inline JSX prop detection', () => {
  it('should detect inline objects and functions in JSX props', () => {
    const issues = analyzeFixture('slop-react.tsx');
    const reactIssues = issues.filter((i: SlopIssue) => i.ruleId === 'REACT-001');

    // Should detect at least the inline style object and onClick arrow function
    expect(reactIssues.length).toBeGreaterThanOrEqual(2);

    const objectIssue = reactIssues.find((i: SlopIssue) => i.message.includes('object literal'));
    expect(objectIssue).toBeDefined();
    expect(objectIssue!.category).toBe('component');

    const functionIssue = reactIssues.find((i: SlopIssue) => i.message.includes('function'));
    expect(functionIssue).toBeDefined();
  });

  it('should not flag non-JSX files', () => {
    const source = `const style = { padding: '10px' };`;
    const { ast } = parseSource(source, 'test.ts'); // .ts not .tsx
    expect(ast).not.toBeNull();
    const lineMap = buildLineMap(source);
    const issues = executeRules(ast!, source, 'test.ts', lineMap);

    const reactIssues = issues.filter((i: SlopIssue) => i.ruleId === 'REACT-001');
    expect(reactIssues.length).toBe(0);
  });
});

describe('Clean code baseline', () => {
  it('should produce zero issues on clean code', () => {
    const issues = analyzeFixture('clean-sample.ts');
    expect(issues.length).toBe(0);
  });
});

describe('AST Parser edge cases', () => {
  it('should handle syntax errors gracefully without throwing', () => {
    const source = `const x = {{{`;
    const result = parseSource(source, 'broken.ts');
    expect(result.ast).toBeNull();
    expect(result.error).toBeDefined();
  });

  it('should parse JSX files correctly', () => {
    const source = `const el = <div className="test">hello</div>;`;
    const result = parseSource(source, 'test.tsx');
    expect(result.ast).not.toBeNull();
  });

  it('should parse regular JS files', () => {
    const source = `function add(a, b) { return a + b; }`;
    const result = parseSource(source, 'test.js');
    expect(result.ast).not.toBeNull();
  });
});
