import { BaseSkill } from './base-skill';

export class ChatGPTSlopSkill extends BaseSkill {
    readonly name = 'ChatGPT Slop Detector';
    readonly category = 'AI Slop';
    readonly description = 'Detects characteristic ChatGPT code generation patterns';

    getPrompt(code: string, fileName: string): string {
        return `Analyze this code for characteristic ChatGPT generation patterns:

File: ${fileName}

Code:
\`\`\`
${code}
\`\`\`

Focus on CHATGPT-SPECIFIC PATTERNS:

1. **ChatGPT Comment Style**:
   - "Note that..." or "Note:" comments
   - "This function does X" (restating obvious)
   - "TODO: Add error handling" left in
   - "Here's how you can..." in comments
   - Explanatory comments for every line
   - "You can also..." suggesting alternatives in comments

2. **ChatGPT Function Naming**:
   - Verbose names: "getUserDataFromDatabaseById"
   - Or generic: "handleData", "processInput"
   - "Helper" suffix everywhere
   - "Util" functions with single use
   - Inconsistent naming (camelCase mixed with snake_case)

3. **ChatGPT Structure Patterns**:
   - Always: input validation → processing → return
   - Try-catch wrapping entire function
   - Early returns for every edge case
   - Over-documented obvious code
   - Example usage in comments

4. **ChatGPT Safety Theater**:
   - Checking for null/undefined multiple times
   - Type checking primitives: typeof x === 'string'
   - Defensive if (!x || x === null || x === undefined)
   - Array.isArray() before every array operation
   - parseInt with radix 10 always specified

5. **ChatGPT Template Responses**:
   - "Here's a complete implementation..."
   - Function starts with parameter validation
   - Console.log for "debugging purposes"
   - Return object with status/message/data structure
   - Generic error messages: "An error occurred"

6. **ChatGPT Best Practice Theater**:
   - const for everything (even when let makes sense)
   - Arrow functions everywhere (even class methods)
   - async/await even for synchronous code
   - Promise wrapping unnecessarily
   - .then().catch() chains for single operations

7. **ChatGPT Code Smells**:
   - Variable names: result, data, output, response
   - Function names: getData, setData, updateData
   - No business domain vocabulary
   - Generic types: any, object, unknown mixed randomly
   - Interface names ending in "Interface"

8. **ChatGPT Example Code Left In**:
   - Placeholder values: "YOUR_API_KEY_HERE"
   - Example data structures in production code
   - "// Replace this with your actual implementation"
   - Multiple alternative implementations commented out
   - Test data still in code

Respond in JSON:
{
  "score": <0-1, confidence this is ChatGPT generated>,
  "findings": [
    {
      "severity": "high|medium|low",
      "pattern": "<ChatGPT pattern>",
      "description": "<why this looks like ChatGPT>",
      "suggestion": "<how a human would write it>",
      "lineRange": { "start": <line>, "end": <line> }
    }
  ]
}

Be specific: Look for the distinctive "helpful AI" patterns.`;
    }
}
