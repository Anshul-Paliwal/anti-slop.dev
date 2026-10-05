import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseSkill, SkillResult } from './base-skill';
import { SecurityVibeSkill } from './security-skill';
import { UIVibeSkill } from './ui-skill';
import { ArchitectureVibeSkill } from './architecture-skill';
import { ChatGPTSlopSkill } from './chatgpt-slop-skill';
import { CopilotSlopSkill } from './copilot-slop-skill';
import { ClaudeSlopSkill } from './claude-slop-skill';
import { UnifiedSlopSkill } from './unified-skill';
import { GeminiService } from '../gemini-client';

export interface SkillAnalysisResult {
    fileName: string;
    results: SkillResult[];
    overallScore: number;
    timestamp: Date;
}

export class SkillManager {
    private skills: Map<string, BaseSkill> = new Map();
    private genAI: GoogleGenerativeAI | null = null;

    constructor(
        private apiKey: string,
        private model: string = 'gemini-2.0-flash',
        private geminiService?: GeminiService
    ) {
        this.initializeSkills();
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }

    private initializeSkills(): void {
        const skills: BaseSkill[] = [
            new UnifiedSlopSkill(),
            new ChatGPTSlopSkill(),
            new ClaudeSlopSkill(),
            new CopilotSlopSkill(),
            new SecurityVibeSkill(),
            new ArchitectureVibeSkill(),
            new UIVibeSkill()
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
        fileName: string,
        onNotice?: (msg: string) => void
    ): Promise<SkillResult> {
        const skill = this.skills.get(skillName);
        if (!skill) {
            throw new Error(`Skill not found: ${skillName}`);
        }

        const prompt = skill.getPrompt(code, fileName);
        let responseText = '';

        if (this.geminiService) {
            // Use GeminiService with retry and rate limit handling
            responseText = await this.geminiService.generateWithRetry(
                prompt,
                this.model,
                3,
                onNotice
            );
        } else if (this.genAI) {
            const model = this.genAI.getGenerativeModel({ model: this.model });
            const result = await model.generateContent(prompt);
            responseText = result.response.text();
        } else {
            throw new Error('Gemini AI not initialized. Please configure your API key.');
        }

        return skill.parseResponse(responseText);
    }

    /**
     * Unified single-request analysis: all skills covered in one prompt.
     * Conserves 85% of API quota — optimal for Gemini Free Tier (15 RPM).
     */
    async analyzeUnified(
        code: string,
        fileName: string,
        onNotice?: (msg: string) => void
    ): Promise<SkillAnalysisResult> {
        const result = await this.analyzeWithSkill(
            'Unified AI Slop Detector',
            code,
            fileName,
            onNotice
        );

        return {
            fileName,
            results: [result],
            overallScore: result.score,
            timestamp: new Date()
        };
    }

    async analyzeWithAllSkills(
        code: string,
        fileName: string,
        selectedSkills?: string[],
        onProgress?: (skillName: string, index: number, total: number) => void
    ): Promise<SkillAnalysisResult> {
        // Exclude Unified from multi-run unless explicitly selected
        const defaultSkills = Array.from(this.skills.values()).filter(
            s => s.name !== 'Unified AI Slop Detector'
        );

        const skillsToRun = selectedSkills
            ? selectedSkills.map(name => this.skills.get(name)).filter(Boolean) as BaseSkill[]
            : defaultSkills;

        const results: SkillResult[] = [];

        for (let i = 0; i < skillsToRun.length; i++) {
            const skill = skillsToRun[i];
            try {
                if (onProgress) {
                    onProgress(skill.name, i + 1, skillsToRun.length);
                }
                const result = await this.analyzeWithSkill(skill.name, code, fileName);
                results.push(result);
                
                // Free Tier friendly pacing: 1.5s delay between multi-skill requests
                if (i < skillsToRun.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
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
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }

    updateModel(model: string): void {
        this.model = model;
    }

    setGeminiService(service: GeminiService): void {
        this.geminiService = service;
    }
}
