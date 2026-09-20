import { BaseSkill } from './base-skill';

export class ClaudeSlopSkill extends BaseSkill {
    readonly name = 'Claude Slop Detector';
    readonly category = 'AI Slop';
    readonly description = 'Detects characteristic Claude/Anthropic code generation patterns';

    getPrompt(code: string, fileName: string): string {
        return `Analyze this code for characteristic Claude (Anthropic) generation patterns:

File: ${fileName}

Code:
\`\`\`
${code}
\`\`\`

Focus on CLAUDE-SPECIFIC PATTERNS:

1. **Claude's Verbose Comments**:
   - Multi-line explanatory comments before functions
   - "This function handles..." with full context
   - JSDoc-style comments for internal functions
   - Type explanations in comments (redundant with TS)
   - Step-by-step explanation comments
   - "Note that we're using X because Y" justifications

2. **Claude's Defensive Programming**:
   - Multiple validation layers
   - Explicit null/undefined checks everywhere
   - Type narrowing guards excessively
   - Early returns for every edge case with comments
   - Validation functions for simple checks
   - "Safe" wrapper functions for built-ins

3. **Claude's Error Handling Style**:
   - Custom error classes for everything
   - Detailed error messages with context
   - Error wrapping with original error preserved
   - Try-catch with specific error type handling
   - Error logging with structured data
   - Recovery strategies in comments

4. **Claude's Type Safety Theater**:
   - Discriminated unions for simple cases
   - Type predicates everywhere
   - Branded types for primitives
   - Exhaustive switch with never checks
   - Const assertions for every object
   - Strict null checks with explicit types

5. **Claude's Functional Patterns**:
   - Pure functions emphasized
   - Immutability everywhere (no mutations)
   - Composition over inheritance taken to extreme
   - Higher-order functions for simple cases
   - Currying unnecessarily
   - Point-free style where it reduces clarity

6. **Claude's Documentation Style**:
   - README-level explanations in code comments
   - "Implementation details:" sections
   - "Usage example:" in production code
   - "Caveats:" and "Limitations:" comments
   - "Future improvements:" TODO lists
   - Architecture decisions explained inline

7. **Claude's Naming Verbosity**:
   - Very descriptive names: isUserAuthenticatedAndActive
   - Boolean names: hasValidInput, shouldProcessData
   - Prefixes everywhere: get, set, is, has, should, can
   - Full words over abbreviations always
   - Context repeated: UserService.getUserById

8. **Claude's Structure Patterns**:
   - Strict separation of concerns
   - Single Responsibility taken too far (too many small functions)
   - Interface for every class (even single implementation)
   - Dependency injection everywhere
   - Factory patterns for simple object creation
   - Strategy pattern for simple branching

9. **Claude's Testing Mindset**:
   - Code written to be easily testable (good but obvious)
   - Dependency injection for everything
   - Pure functions without need
   - Seams everywhere for mocking
   - Test-specific interfaces
   - Comments about how to test

10. **Claude Safety & Best Practices**:
    - ESLint disable comments with justification
    - TypeScript // @ts-expect-error with explanation
    - Security considerations in comments
    - Performance notes for obvious code
    - Accessibility comments in UI code
    - "Following X pattern because Y" comments

11. **Claude's Structured Approach**:
    - Clear section separators (// === Section ===)
    - Grouped by concern with comments
    - Imports organized by category
    - Exports at the end explicitly
    - Constants defined before usage with explanation

Respond in JSON:
{
  "score": <0-1, confidence this is Claude generated>,
  "findings": [
    {
      "severity": "high|medium|low",
      "pattern": "<Claude pattern>",
      "description": "<why this looks like Claude>",
      "suggestion": "<pragmatic human approach>",
      "lineRange": { "start": <line>, "end": <line> }
    }
  ]
}

Look for Claude's characteristic thoughtfulness that becomes over-engineering.`;
    }
}
