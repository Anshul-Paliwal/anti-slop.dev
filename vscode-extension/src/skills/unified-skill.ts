import { BaseSkill, Finding, SkillResult } from './base-skill';

export class UnifiedSlopSkill extends BaseSkill {
    readonly name = 'Unified AI Slop Detector';
    readonly category = 'Comprehensive';
    readonly description = 'All-in-one detection of ChatGPT, Claude, Copilot, Security, and Logic patterns in a single API call (optimized for Free Tier quota)';

    getPrompt(code: string, fileName: string): string {
        return `You are an expert code auditor specializing in detecting AI slop, "vibe-coding" anti-patterns, and generated code quality issues.
Perform a comprehensive audit of this code across all major AI generation styles (ChatGPT, Claude, Copilot, Security, UI, Logic).

File: ${fileName}

Code:
\`\`\`
${code}
\`\`\`

Detect issues in these 6 dimensions:
1. **ChatGPT Slop**: Overly explanatory comments restating the obvious, safety theater (redundant typeof/null checks everywhere), cookie-cutter helpers, generic variable names ("data", "res", "item").
2. **Claude Slop**: Unnecessary functional abstractions, excessive caveat comments, over-apologetic boilerplate, redundant TypeScript type assertions/guards for trivial code.
3. **Copilot Slop**: Repetitive/hallucinated autocomplete lines, unfinished TODOs left by AI, duplicate utility functions instead of importing existing ones.
4. **Logic & Architecture**: Silent error swallowing (empty catch blocks), deeply nested ternaries, god functions, dead branches.
5. **Security Risks**: Insecure defaults, unvalidated inputs, hardcoded secrets/placeholders ("YOUR_API_KEY_HERE").
6. **UI & Styling**: Redundant styles, missing accessibility attributes, mismatched element tags.

Respond ONLY with valid JSON in this exact structure:
{
  "score": <0.0 to 1.0 confidence that this code has vibe-coded/AI slop patterns>,
  "summary": "<1-2 sentence overall diagnosis>",
  "patterns": ["<pattern 1>", "<pattern 2>"],
  "findings": [
    {
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "category": "ChatGPT Slop" | "Claude Slop" | "Copilot Slop" | "Logic" | "Security" | "UI",
      "pattern": "<brief name of pattern>",
      "description": "<why this pattern indicates AI slop or poor engineering>",
      "suggestion": "<concrete instructions for how a human senior engineer would write it>",
      "lineRange": { "start": <startLineNumber>, "end": <endLineNumber> }
    }
  ]
}`;
    }

    override parseResponse(response: string): SkillResult {
        try {
            let jsonText = response;
            const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            }

            const parsed = JSON.parse(jsonText);

            return {
                skillName: this.name,
                category: this.category,
                score: typeof parsed.score === 'number' ? parsed.score : 0,
                findings: (parsed.findings || []).map((f: any) => ({
                    severity: f.severity || 'medium',
                    pattern: f.pattern || f.category || 'AI Pattern',
                    description: f.description || '',
                    suggestion: f.suggestion || '',
                    lineRange: f.lineRange
                })),
                timestamp: new Date()
            };
        } catch (error) {
            throw new Error(`Failed to parse unified response: ${error}`);
        }
    }
}
