import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseSkill, SkillResult } from './base-skill';
import { SecurityVibeSkill } from './security-skill';
import { UIVibeSkill } from './ui-skill';
import { ArchitectureVibeSkill } from './architecture-skill';
import { ChatGPTSlopSkill } from './chatgpt-slop-skill';
import { CopilotSlopSkill } from './copilot-slop-skill';
import { ClaudeSlopSkill } from './claude-slop-skill';

export interface SkillAnalysisResult {
    fileName: string;
    results: SkillResult[];
    overallScore: number;
    timestamp: Date;
}

export class SkillManager {
    private skills: Map<string, BaseSkill> = new Map();
    private genAI: GoogleGenerativeAI | null = null;

    constructor(private apiKey: string, private model: string = 'gemini-2.0-flash-exp') {
        this.initializeSkills();
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }

    private initializeSkills(): void {
        const skills = [
            new SecurityVibeSkill(),
            new UIVibeSkill(),
            new ArchitectureVibeSkill(),
            new ChatGPTSlopSkill(),
            new CopilotSlopSkill(),
            new ClaudeSlopSkill()
        ];

        for (const skill of skills) {
            this.skills.set(skill.name, skill);
        }
    }

    getAvailableSkills(): BaseSkill[] {
        return Array.from(this.skills.values());
    }

    getSkillsByCategory(): Map<string, BaseSkill[]> {
        const byCategory = new Map<string, BaseSkill[]>();
        
        for (const skill of this.skills.values()) {
            const existing = byCategory.get(skill.category) || [];
            existing.push(skill);
            byCategory.set(skill.category, existing);
        }

        return byCategory;
    }

    async analyzeWithSkill(
        skillName: string,
        code: string,
        fileName: string
    ): Promise<SkillResult> {
        if (!this.genAI) {
            throw new Error('Gemini AI not initialized');
        }

        const skill = this.skills.get(skillName);
        if (!skill) {
            throw new Error(`Skill not found: ${skillName}`);
        }

        const model = this.genAI.getGenerativeModel({ model: this.model });
        const prompt = skill.getPrompt(code, fileName);

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return skill.parseResponse(response);
    }

    async analyzeWithAllSkills(
        code: string,
        fileName: string,
        selectedSkills?: string[]
    ): Promise<SkillAnalysisResult> {
        const skillsToRun = selectedSkills
            ? selectedSkills.map(name => this.skills.get(name)).filter(Boolean) as BaseSkill[]
            : Array.from(this.skills.values());

        const results: SkillResult[] = [];

        for (const skill of skillsToRun) {
            try {
                const result = await this.analyzeWithSkill(skill.name, code, fileName);
                results.push(result);
                
                // Rate limiting - wait between requests
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error analyzing with ${skill.name}:`, error);
                // Continue with other skills even if one fails
            }
        }

        const overallScore = results.length > 0
            ? results.reduce((sum, r) => sum + r.score, 0) / results.length
            : 0;

        return {
            fileName,
            results,
            overallScore,
            timestamp: new Date()
        };
    }

    async analyzeByCategory(
        category: string,
        code: string,
        fileName: string
    ): Promise<SkillAnalysisResult> {
        const categorySkills = Array.from(this.skills.values())
            .filter(skill => skill.category === category);

        if (categorySkills.length === 0) {
            throw new Error(`No skills found for category: ${category}`);
        }

        return this.analyzeWithAllSkills(
            code,
            fileName,
            categorySkills.map(s => s.name)
        );
    }

    getCategories(): string[] {
        const categories = new Set<string>();
        for (const skill of this.skills.values()) {
            categories.add(skill.category);
        }
        return Array.from(categories);
    }

    updateApiKey(apiKey: string): void {
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    updateModel(model: string): void {
        this.model = model;
    }
}
