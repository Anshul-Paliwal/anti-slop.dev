import { BaseSkill } from './base-skill';

export class SecurityVibeSkill extends BaseSkill {
    readonly name = 'Security Vibe Detector';
    readonly category = 'Security';
    readonly description = 'Detects AI-generated security anti-patterns and vulnerabilities';

    getPrompt(code: string, fileName: string): string {
        return `Analyze this code for AI-generated security anti-patterns and vulnerabilities:

File: ${fileName}

Code:
\`\`\`
${code}
\`\`\`

Focus on detecting these VIBE-CODED SECURITY PATTERNS:

1. **Fake Security Theater**:
   - Try-catch blocks that swallow security exceptions
   - Generic "isValid()" checks without real validation
   - Comments like "TODO: Add proper security" left in production
   - Placeholder authentication (e.g., hardcoded tokens, disabled auth)

2. **Copy-Paste Vulnerabilities**:
   - SQL injection risks from string concatenation
   - XSS vulnerabilities from unescaped user input
   - Path traversal from unchecked file paths
   - Command injection from unsanitized shell commands
   - Insecure deserialization patterns

3. **Over-Trusting Input**:
   - Missing input validation on API endpoints
   - Assuming client-side validation is sufficient
   - No rate limiting or throttling
   - Missing CSRF protection
   - Unrestricted file uploads

4. **Credential Mishandling**:
   - Hardcoded secrets, API keys, or passwords
   - Credentials in comments or variable names
   - Logging sensitive data
   - Storing passwords in plain text
   - Weak or predictable crypto (MD5, SHA1)

5. **Access Control Gaps**:
   - Missing authorization checks
   - Client-side only access control
   - IDOR vulnerabilities (direct object references)
   - Privilege escalation paths
   - Missing session validation

6. **Generic AI Patterns**:
   - "// Add security check here" comments
   - Function names like "validateInput()" that do nothing
   - Over-defensive null checks but missing security checks
   - Cookie-cutter JWT validation without proper verification

Respond in JSON:
{
  "score": <0-1, confidence of vibe-coded security issues>,
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "pattern": "<name of pattern>",
      "description": "<what the issue is>",
      "suggestion": "<how to fix it properly>",
      "lineRange": { "start": <line>, "end": <line> }
    }
  ]
}

Be strict: Real security requires human judgment, not AI boilerplate.`;
    }
}
