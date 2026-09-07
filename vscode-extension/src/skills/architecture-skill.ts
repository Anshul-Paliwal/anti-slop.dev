import { BaseSkill } from './base-skill';

export class ArchitectureVibeSkill extends BaseSkill {
    readonly name = 'Architecture Vibe Detector';
    readonly category = 'Architecture';
    readonly description = 'Detects AI-generated architecture patterns that lack system thinking';

    getPrompt(code: string, fileName: string): string {
        return `Analyze this code for AI-generated architecture anti-patterns:

File: ${fileName}

Code:
\`\`\`
${code}
\`\`\`

Focus on these VIBE-CODED ARCHITECTURE PATTERNS:

1. **God Objects & Anti-Patterns**:
   - Classes/modules doing everything (>500 lines)
   - "Manager", "Handler", "Processor", "Service" without clear responsibility
   - Circular dependencies
   - Tight coupling everywhere
   - Global state abuse

2. **Over-Engineering vs Under-Engineering**:
   - Abstract factories for simple cases
   - Observer pattern for single observer
   - 5-layer architecture for CRUD
   - OR: No abstraction at all, everything hardcoded
   - Premature optimization without profiling

3. **Database/API Slop**:
   - N+1 query problems
   - SELECT * everywhere
   - No connection pooling
   - Missing indexes on obvious columns
   - API calls in loops
   - No caching strategy
   - Transactions missing where needed

4. **Error Handling Architecture**:
   - Try-catch at every level (exception ping-pong)
   - Or: No error handling at boundaries
   - Errors converted to strings and back
   - Lost context in error propagation
   - No circuit breakers for external services

5. **Data Flow Confusion**:
   - State synchronized in multiple places
   - Bidirectional data flow chaos
   - Props drilling vs context misuse
   - Event listeners that never cleanup
   - Memory leaks from subscriptions

6. **Testing Impossibilities**:
   - Code that can't be unit tested
   - Heavy constructors with side effects
   - Static dependencies everywhere
   - Time/randomness without injection
   - No seams for mocking

7. **Configuration Mess**:
   - Environment-specific code with if statements
   - Config scattered across codebase
   - Feature flags hardcoded
   - No config validation
   - Secrets in code

8. **Generic AI Architecture Smells**:
   - "Utils" or "Helpers" folder as dumping ground
   - Inconsistent naming conventions
   - No clear layer separation
   - Business logic in controllers
   - Presentation logic in models
   - Copy-paste microservices

9. **Scalability Blindness**:
   - In-memory state in distributed system
   - No consideration for concurrent users
   - File system operations without limits
   - Unbounded collections
   - Missing pagination

Respond in JSON:
{
  "score": <0-1, confidence of vibe-coded architecture>,
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "pattern": "<pattern name>",
      "description": "<architectural issue>",
      "suggestion": "<proper architectural approach>",
      "lineRange": { "start": <line>, "end": <line> }
    }
  ]
}

Good architecture requires experience and tradeoffs, not AI boilerplate.`;
    }
}
