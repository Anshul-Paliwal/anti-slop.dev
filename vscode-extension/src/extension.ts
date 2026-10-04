import * as vscode from 'vscode';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as path from 'path';
import * as fs from 'fs';
import { SkillManager, SkillAnalysisResult, SkillResult, Finding } from './skills';

interface AnalysisResult {
    file: string;
    score: number;
    patterns: string[];
    suggestions: string[];
    timestamp: Date;
}

interface ExtendedAnalysisResult extends AnalysisResult {
    skillResults?: SkillAnalysisResult;
}

interface Pipeline {
    id: string;
    name: string;
    filePatterns: string[];
    schedule?: string;
    enabled: boolean;
}

class AntiSlopAnalyzer {
    private genAI: GoogleGenerativeAI | null = null;
    private skillManager: SkillManager | null = null;
    private results: Map<string, ExtendedAnalysisResult> = new Map();
    private pipelines: Pipeline[] = [];
    private outputChannel: vscode.OutputChannel;

    constructor(private context: vscode.ExtensionContext) {
        this.outputChannel = vscode.window.createOutputChannel('Anti-Slop');
        this.loadPipelines();
        this.initializeSkillManager();
    }

    private initializeSkillManager(): void {
        const apiKey = this.getApiKey();
        if (apiKey) {
            const config = vscode.workspace.getConfiguration('antiSlop');
            const model = config.get<string>('model') || 'gemini-2.0-flash-exp';
            this.skillManager = new SkillManager(apiKey, model);
        }
    }

    private getApiKey(): string | undefined {
        const config = vscode.workspace.getConfiguration('antiSlop');
        return config.get<string>('geminiApiKey');
    }

    private initializeAI(): boolean {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            vscode.window.showErrorMessage(
                'Gemini API key not configured. Run "Anti-Slop: Configure Gemini API Key"'
            );
            return false;
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.initializeSkillManager();
        return true;
    }

    async analyzeCode(code: string, fileName: string): Promise<AnalysisResult> {
        if (!this.initializeAI() || !this.genAI) {
            throw new Error('AI not initialized');
        }

        const config = vscode.workspace.getConfiguration('antiSlop');
        const model = this.genAI.getGenerativeModel({ 
            model: config.get<string>('model') || 'gemini-2.0-flash-exp'
        });

        const prompt = `Analyze this code for "vibe-coded" patterns - characteristics of AI-generated code that may lack human engineering judgment:

File: ${fileName}

Code:
\`\`\`
${code}
\`\`\`

Identify:
1. Over-generic variable/function names (e.g., "handleClick", "processData", "result")
2. Excessive comments that restate obvious code
3. Overly defensive programming (unnecessary null checks, try-catch everywhere)
4. Cookie-cutter patterns without project context
5. Missing edge cases that a human would consider
6. Boilerplate-heavy code without customization
7. Inconsistent naming conventions
8. Dead code or unused imports
9. Missing error handling where it matters

Respond in JSON format:
{
  "score": <0-1, confidence this is vibe-coded>,
  "patterns": [<list of detected patterns>],
  "suggestions": [<actionable improvements>]
}`;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            
            // Extract JSON from markdown code blocks if present
            let jsonText = response;
            const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            }

            const analysis = JSON.parse(jsonText);
            
            const analysisResult: AnalysisResult = {
                file: fileName,
                score: analysis.score || 0,
                patterns: analysis.patterns || [],
                suggestions: analysis.suggestions || [],
                timestamp: new Date()
            };

            this.results.set(fileName, analysisResult);
            return analysisResult;
        } catch (error) {
            this.outputChannel.appendLine(`Error analyzing ${fileName}: ${error}`);
            throw error;
        }
    }

    async analyzeFile(fileUri: vscode.Uri): Promise<void> {
        const document = await vscode.workspace.openTextDocument(fileUri);
        const code = document.getText();
        const fileName = path.basename(fileUri.fsPath);

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Analyzing ${fileName}...`,
            cancellable: false
        }, async () => {
            try {
                const result = await this.analyzeCode(code, fileName);
                const threshold = vscode.workspace.getConfiguration('antiSlop')
                    .get<number>('analysisThreshold') || 0.7;

                if (result.score >= threshold) {
                    vscode.window.showWarningMessage(
                        `${fileName} has high vibe-code score: ${(result.score * 100).toFixed(0)}%`,
                        'Show Details'
                    ).then(selection => {
                        if (selection === 'Show Details') {
                            this.showResultDetails(result);
                        }
                    });
                } else {
                    vscode.window.showInformationMessage(
                        `${fileName} analysis complete. Score: ${(result.score * 100).toFixed(0)}%`
                    );
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Analysis failed: ${error}`);
            }
        });
    }

    async analyzeFileWithSkills(fileUri: vscode.Uri, selectedSkills?: string[]): Promise<void> {
        if (!this.skillManager) {
            vscode.window.showErrorMessage('Skill manager not initialized. Check API key.');
            return;
        }

        const document = await vscode.workspace.openTextDocument(fileUri);
        const code = document.getText();
        const fileName = path.basename(fileUri.fsPath);

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Analyzing ${fileName} with skills...`,
            cancellable: false
        }, async () => {
            try {
                const skillResult = await this.skillManager!.analyzeWithAllSkills(
                    code,
                    fileName,
                    selectedSkills
                );

                const extendedResult: ExtendedAnalysisResult = {
                    file: fileName,
                    score: skillResult.overallScore,
                    patterns: [],
                    suggestions: [],
                    timestamp: skillResult.timestamp,
                    skillResults: skillResult
                };

                this.results.set(fileName, extendedResult);

                vscode.window.showInformationMessage(
                    `${fileName} skill analysis complete. Score: ${(skillResult.overallScore * 100).toFixed(0)}%`,
                    'Show Details'
                ).then(selection => {
                    if (selection === 'Show Details') {
                        this.showSkillResultDetails(skillResult);
                    }
                });
            } catch (error) {
                vscode.window.showErrorMessage(`Skill analysis failed: ${error}`);
            }
        });
    }

    async analyzeByCategory(fileUri: vscode.Uri): Promise<void> {
        if (!this.skillManager) {
            vscode.window.showErrorMessage('Skill manager not initialized.');
            return;
        }

        const categories = this.skillManager.getCategories();
        const category = await vscode.window.showQuickPick(categories, {
            placeHolder: 'Select analysis category'
        });

        if (!category) return;

        const document = await vscode.workspace.openTextDocument(fileUri);
        const code = document.getText();
        const fileName = path.basename(fileUri.fsPath);

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Analyzing ${fileName} for ${category}...`,
            cancellable: false
        }, async () => {
            try {
                const skillResult = await this.skillManager!.analyzeByCategory(
                    category,
                    code,
                    fileName
                );

                this.showSkillResultDetails(skillResult);
            } catch (error) {
                vscode.window.showErrorMessage(`Category analysis failed: ${error}`);
            }
        });
    }

    async selectAndAnalyzeWithSkills(fileUri: vscode.Uri): Promise<void> {
        if (!this.skillManager) {
            vscode.window.showErrorMessage('Skill manager not initialized.');
            return;
        }

        const skills = this.skillManager.getAvailableSkills();
        const selected = await vscode.window.showQuickPick(
            skills.map(s => ({
                label: s.name,
                description: s.category,
                detail: s.description,
                picked: true
            })),
            {
                placeHolder: 'Select skills to run',
                canPickMany: true
            }
        );

        if (!selected || selected.length === 0) return;

        const selectedNames = selected.map(s => s.label);
        await this.analyzeFileWithSkills(fileUri, selectedNames);
    }

    async analyzeWorkspace(): Promise<void> {
        const config = vscode.workspace.getConfiguration('antiSlop');
        const excludePatterns = config.get<string[]>('excludePatterns') || [];
        
        const files = await vscode.workspace.findFiles(
            '**/*.{ts,js,tsx,jsx,py,java,cpp,c,go,rs}',
            `{${excludePatterns.join(',')}}`
        );

        if (files.length === 0) {
            vscode.window.showInformationMessage('No code files found to analyze.');
            return;
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Analyzing workspace...',
            cancellable: true
        }, async (progress, token) => {
            let analyzed = 0;
            for (const file of files) {
                if (token.isCancellationRequested) {
                    break;
                }

                progress.report({
                    increment: (100 / files.length),
                    message: `${analyzed + 1}/${files.length} files`
                });

                try {
                    await this.analyzeFile(file);
                    analyzed++;
                } catch (error) {
                    this.outputChannel.appendLine(`Skipped ${file.fsPath}: ${error}`);
                }

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            vscode.window.showInformationMessage(
                `Workspace analysis complete. Analyzed ${analyzed}/${files.length} files.`,
                'Show Report'
            ).then(selection => {
                if (selection === 'Show Report') {
                    this.showReport();
                }
            });
        });
    }

    showResultDetails(result: AnalysisResult): void {
        const panel = vscode.window.createWebviewPanel(
            'antiSlopDetails',
            `Analysis: ${result.file}`,
            vscode.ViewColumn.Two,
            {}
        );

        panel.webview.html = this.getDetailsHtml(result);
    }

    showSkillResultDetails(skillResult: SkillAnalysisResult): void {
        const panel = vscode.window.createWebviewPanel(
            'antiSlopSkillDetails',
            `Skill Analysis: ${skillResult.fileName}`,
            vscode.ViewColumn.Two,
            { enableScripts: true }
        );

        panel.webview.html = this.getSkillDetailsHtml(skillResult);
    }

    showReport(): void {
        const panel = vscode.window.createWebviewPanel(
            'antiSlopReport',
            'Anti-Slop Analysis Report',
            vscode.ViewColumn.Two,
            {}
        );

        panel.webview.html = this.getReportHtml();
    }

    private getDetailsHtml(result: AnalysisResult): string {
        const scoreColor = result.score >= 0.7 ? '#f44336' : 
                          result.score >= 0.4 ? '#ff9800' : '#4caf50';

        return `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; }
        .score { font-size: 48px; font-weight: bold; color: ${scoreColor}; }
        .section { margin: 20px 0; }
        .pattern, .suggestion { 
            background: #f5f5f5; 
            padding: 10px; 
            margin: 5px 0; 
            border-radius: 4px;
            border-left: 3px solid ${scoreColor};
        }
        h2 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
    </style>
</head>
<body>
    <h1>Analysis: ${result.file}</h1>
    <div class="score">${(result.score * 100).toFixed(0)}%</div>
    <p>Vibe-Code Confidence Score</p>
    
    <div class="section">
        <h2>Detected Patterns (${result.patterns.length})</h2>
        ${result.patterns.map(p => `<div class="pattern">⚠️ ${p}</div>`).join('')}
    </div>
    
    <div class="section">
        <h2>Suggestions (${result.suggestions.length})</h2>
        ${result.suggestions.map(s => `<div class="suggestion">💡 ${s}</div>`).join('')}
    </div>
    
    <p><small>Analyzed: ${result.timestamp.toLocaleString()}</small></p>
</body>
</html>`;
    }

    private getSkillDetailsHtml(skillResult: SkillAnalysisResult): string {
        const scoreColor = skillResult.overallScore >= 0.7 ? '#f44336' : 
                          skillResult.overallScore >= 0.4 ? '#ff9800' : '#4caf50';

        const severityColors = {
            critical: '#d32f2f',
            high: '#f44336',
            medium: '#ff9800',
            low: '#ffc107',
            info: '#2196f3'
        };

        const skillsByCategory = new Map<string, SkillResult[]>();
        for (const result of skillResult.results) {
            const existing = skillsByCategory.get(result.category) || [];
            existing.push(result);
            skillsByCategory.set(result.category, existing);
        }

        let categorySections = '';
        for (const [category, results] of skillsByCategory) {
            const categoryScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
            const categoryColor = categoryScore >= 0.7 ? '#f44336' : 
                                 categoryScore >= 0.4 ? '#ff9800' : '#4caf50';

            categorySections += `
                <div class="category-section">
                    <h2>
                        ${category} 
                        <span style="color: ${categoryColor}; font-size: 0.8em;">
                            ${(categoryScore * 100).toFixed(0)}%
                        </span>
                    </h2>
                    ${results.map(r => `
                        <div class="skill-result">
                            <h3>${r.skillName}</h3>
                            <div class="skill-score" style="color: ${r.score >= 0.7 ? '#f44336' : r.score >= 0.4 ? '#ff9800' : '#4caf50'}">
                                ${(r.score * 100).toFixed(0)}%
                            </div>
                            <div class="findings">
                                ${r.findings.map(f => `
                                    <div class="finding" style="border-left: 4px solid ${severityColors[f.severity]}">
                                        <div class="finding-header">
                                            <span class="severity ${f.severity}">${f.severity.toUpperCase()}</span>
                                            <span class="pattern-name">${f.pattern}</span>
                                        </div>
                                        <div class="finding-description">${f.description}</div>
                                        <div class="finding-suggestion">
                                            <strong>💡 Suggestion:</strong> ${f.suggestion}
                                        </div>
                                        ${f.lineRange ? `<div class="line-range">Lines ${f.lineRange.start}-${f.lineRange.end}</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return `<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: 'Segoe UI', sans-serif; 
            padding: 20px; 
            background: #fafafa;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .overall-score { 
            font-size: 64px; 
            font-weight: bold; 
            color: ${scoreColor}; 
            margin: 10px 0;
        }
        .category-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h2 { 
            color: #333; 
            border-bottom: 2px solid #ddd; 
            padding-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        h3 {
            color: #555;
            margin-top: 0;
        }
        .skill-result {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 6px;
        }
        .skill-score {
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
        }
        .findings {
            margin-top: 15px;
        }
        .finding {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
            border-left: 4px solid #ddd;
        }
        .finding-header {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 10px;
        }
        .severity {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75em;
            font-weight: bold;
            color: white;
        }
        .severity.critical { background: #d32f2f; }
        .severity.high { background: #f44336; }
        .severity.medium { background: #ff9800; }
        .severity.low { background: #ffc107; color: #333; }
        .severity.info { background: #2196f3; }
        .pattern-name {
            font-weight: 600;
            color: #333;
        }
        .finding-description {
            color: #666;
            margin: 8px 0;
            line-height: 1.5;
        }
        .finding-suggestion {
            background: #e3f2fd;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            color: #1565c0;
            line-height: 1.5;
        }
        .line-range {
            font-size: 0.85em;
            color: #999;
            margin-top: 8px;
        }
        .stats {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        .stat {
            flex: 1;
            text-align: center;
        }
        .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #333;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Skill Analysis: ${skillResult.fileName}</h1>
        <div class="overall-score">${(skillResult.overallScore * 100).toFixed(0)}%</div>
        <p>Overall Vibe-Code Score</p>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-value">${skillResult.results.length}</div>
                <div class="stat-label">Skills Run</div>
            </div>
            <div class="stat">
                <div class="stat-value">${skillResult.results.reduce((sum, r) => sum + r.findings.length, 0)}</div>
                <div class="stat-label">Total Findings</div>
            </div>
            <div class="stat">
                <div class="stat-value">${skillResult.results.filter(r => r.findings.some(f => f.severity === 'critical' || f.severity === 'high')).length}</div>
                <div class="stat-label">High-Risk Skills</div>
            </div>
        </div>
        
        <p><small>Analyzed: ${skillResult.timestamp.toLocaleString()}</small></p>
    </div>

    ${categorySections}
</body>
</html>`;
    }

    private getReportHtml(): string {
        const results = Array.from(this.results.values());
        const avgScore = results.length > 0 
            ? results.reduce((sum, r) => sum + r.score, 0) / results.length 
            : 0;
        const highRisk = results.filter(r => r.score >= 0.7).length;
        const mediumRisk = results.filter(r => r.score >= 0.4 && r.score < 0.7).length;
        const lowRisk = results.filter(r => r.score < 0.4).length;

        return `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat { flex: 1; background: #f5f5f5; padding: 15px; border-radius: 8px; }
        .stat-value { font-size: 32px; font-weight: bold; }
        .high { color: #f44336; }
        .medium { color: #ff9800; }
        .low { color: #4caf50; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #333; color: white; }
        tr:hover { background: #f5f5f5; }
    </style>
</head>
<body>
    <h1>Anti-Slop Analysis Report</h1>
    <p>Total files analyzed: ${results.length}</p>
    
    <div class="stats">
        <div class="stat">
            <div class="stat-value">${(avgScore * 100).toFixed(0)}%</div>
            <div>Average Score</div>
        </div>
        <div class="stat">
            <div class="stat-value high">${highRisk}</div>
            <div>High Risk (≥70%)</div>
        </div>
        <div class="stat">
            <div class="stat-value medium">${mediumRisk}</div>
            <div>Medium Risk (40-69%)</div>
        </div>
        <div class="stat">
            <div class="stat-value low">${lowRisk}</div>
            <div>Low Risk (<40%)</div>
        </div>
    </div>
    
    <h2>File Results</h2>
    <table>
        <tr>
            <th>File</th>
            <th>Score</th>
            <th>Patterns</th>
            <th>Timestamp</th>
        </tr>
        ${results.sort((a, b) => b.score - a.score).map(r => `
            <tr>
                <td>${r.file}</td>
                <td class="${r.score >= 0.7 ? 'high' : r.score >= 0.4 ? 'medium' : 'low'}">
                    ${(r.score * 100).toFixed(0)}%
                </td>
                <td>${r.patterns.length}</td>
                <td><small>${r.timestamp.toLocaleString()}</small></td>
            </tr>
        `).join('')}
    </table>
</body>
</html>`;
    }

    async createPipeline(): Promise<void> {
        const name = await vscode.window.showInputBox({
            prompt: 'Pipeline name',
            placeHolder: 'e.g., "Daily Frontend Analysis"'
        });

        if (!name) return;

        const patterns = await vscode.window.showInputBox({
            prompt: 'File patterns (comma-separated)',
            placeHolder: 'e.g., "src/**/*.ts, components/**/*.tsx"'
        });

        if (!patterns) return;

        const pipeline: Pipeline = {
            id: Date.now().toString(),
            name,
            filePatterns: patterns.split(',').map(p => p.trim()),
            enabled: true
        };

        this.pipelines.push(pipeline);
        this.savePipelines();

        vscode.window.showInformationMessage(`Pipeline "${name}" created!`);
    }

    private loadPipelines(): void {
        const stored = this.context.globalState.get<Pipeline[]>('pipelines');
        if (stored) {
            this.pipelines = stored;
        }
    }

    private savePipelines(): void {
        this.context.globalState.update('pipelines', this.pipelines);
    }

    getResults(): Map<string, AnalysisResult> {
        return this.results;
    }

    getPipelines(): Pipeline[] {
        return this.pipelines;
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Anti-Slop extension activated!');

    const analyzer = new AntiSlopAnalyzer(context);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('anti-slop.configureApiKey', async () => {
            const apiKey = await vscode.window.showInputBox({
                prompt: 'Enter your Gemini API key',
                password: true,
                ignoreFocusOut: true
            });

            if (apiKey) {
                await vscode.workspace.getConfiguration('antiSlop').update(
                    'geminiApiKey',
                    apiKey,
                    vscode.ConfigurationTarget.Global
                );
                vscode.window.showInformationMessage('API key saved!');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('anti-slop.analyzeFile', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active file to analyze');
                return;
            }
            await analyzer.analyzeFile(editor.document.uri);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('anti-slop.analyzeWorkspace', async () => {
            await analyzer.analyzeWorkspace();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('anti-slop.showReport', () => {
            analyzer.showReport();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('anti-slop.createPipeline', async () => {
            await analyzer.createPipeline();
        })
    );

    // Auto-analyze on save if enabled
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(async (document) => {
            const config = vscode.workspace.getConfiguration('antiSlop');
            if (config.get<boolean>('autoAnalyzeOnSave')) {
                await analyzer.analyzeFile(document.uri);
            }
        })
    );

    vscode.window.showInformationMessage('Anti-Slop extension ready! Configure your Gemini API key to start.');
}

export function deactivate() {}
