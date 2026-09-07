import { BaseSkill } from './base-skill';

export class CopilotSlopSkill extends BaseSkill {
    readonly name = 'Copilot Slop Detector';
    readonly category = 'AI Slop';
    readonly description = 'Detects characteristic GitHub Copilot code generation patterns';

    getPrompt(code: string, fileName: string): string {
        return `Analyze this code for characteristic GitHub Copilot generation patterns:

File: ${fileName}

Code:
\`\`\`
${code}
\`\`\`

Focus on COPILOT-SPECIFIC PATTERNS:

1. **Copilot Autocomplete Artifacts**:
   - Sequence of similar functions with incremental changes
   - Variable names following predictable patterns (item1, item2, item3)
   - Generated getters/setters for every property
   - Boilerplate CRUD operations all in one file
   - Test functions matching exactly the implementation pattern

2. **Copilot Comment Completion**:
   - Comment describes function, then identical implementation
   - "// Loop through items" → for loop with generic names
   - "// Calculate total" → reduce with acc/curr
   - Implementation matches comment too literally
   - Missing context-specific logic

3. **Copilot Pattern Repetition**:
   - Same error handling in every function
   - Identical validation logic copy-pasted
   - Type guards repeated unnecessarily
   - Same import structure in every file
   - Cookie-cutter React hooks usage

4. **Copilot Type Theater**:
   - Over-specific types that add no value
   - Redundant type assertions
   - Types that repeat the variable name: userUser: User
   - Generic types that could be inferred
   - Interface for single-use objects

5. **Copilot Naming Patterns**:
   - Predictable names: handleClick, handleSubmit, handleChange
   - Numbered variations: useState1, useState2
   - Abbreviated inconsistently: btn vs button, txt vs text
   - Context-free names: data, result, value, item
   - Missing domain language

6. **Copilot Array Operations**:
   - .map().filter().reduce() chains without consideration
   - forEach when map would be better (or vice versa)
   - Unnecessary array spreads
   - Index-based iteration over semantic iteration
   - Missing early returns from array operations

7. **Copilot Promise/Async Patterns**:
   - Unnecessary async for sync operations
   - await for every promise (no Promise.all for independent calls)
   - .then() chains that could be async/await
   - Missing error boundaries
   - Fire-and-forget promises without handling

8. **Copilot Test Patterns**:
   - describe/it blocks with generic names
   - "should work" test descriptions
   - Happy path only testing
   - Mock everything approach
   - Tests that test implementation not behavior

9. **Copilot Import/Export Theater**:
   - Default export and named exports mixed
   - Importing entire libraries for one function
   - Circular imports from autocomplete
   - Unused imports left in
   - No barrel exports where they'd help

10. **Copilot React Smells**:
    - useEffect for every side effect without cleanup
    - State for derived values
    - Props spreading everywhere
    - Missing memo where obvious
    - Custom hooks that are just one-liners

Respond in JSON:
{
  "score": <0-1, confidence this is Copilot generated>,
  "findings": [
    {
      "severity": "high|medium|low",
      "pattern": "<Copilot pattern>",
      "description": "<why this looks like Copilot>",
      "suggestion": "<thoughtful human approach>",
      "lineRange": { "start": <line>, "end": <line> }
    }
  ]
}

Look for the autocomplete-driven patterns vs intentional design.`;
    }
}
