export interface SkillResult {
    skillName: string;
    category: string;
    score: number;
    findings: Finding[];
    timestamp: Date;
}

export interface Finding {
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    pattern: string;
    description: string;
    suggestion: string;
    lineRange?: { start: number; end: number };
}

export abstract class BaseSkill {
    abstract readonly name: string;
    abstract readonly category: string;
    abstract readonly description: string;
    
    abstract getPrompt(code: string, fileName: string): string;
    
    parseResponse(response: string): SkillResult {
        try {
            // Extract JSON from markdown code blocks if present
            let jsonText = response;
            const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            }

            const parsed = JSON.parse(jsonText);
            
            return {
                skillName: this.name,
                category: this.category,
                score: parsed.score || 0,
                findings: (parsed.findings || []).map((f: any) => ({
                    severity: f.severity || 'medium',
                    pattern: f.pattern || '',
                    description: f.description || '',
                    suggestion: f.suggestion || '',
                    lineRange: f.lineRange
                })),
                timestamp: new Date()
            };
        } catch (error) {
            throw new Error(`Failed to parse response for ${this.name}: ${error}`);
        }
    }
}
