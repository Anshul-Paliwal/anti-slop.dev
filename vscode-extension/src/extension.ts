import * as vscode from 'vscode';
import * as path from 'path';
import { GeminiService, cleanApiKey } from './gemini-client';
import { SkillManager, SkillAnalysisResult, SkillResult, Finding } from './skills';
import { runLocalRules, LocalSlopIssue } from './local-rules';
import {
    ResultsTreeProvider,
    PipelinesTreeProvider,
    PipelineItem,
    TreeAnalysisResult
} from './tree-provider';

interface AnalysisResult {
    file: string;
    filePath?: string;
    score: number;
    patterns: string[];
    suggestions: string[];
    timestamp: Date;
    findings?: Finding[];
}

interface ExtendedAnalysisResult extends AnalysisResult {
    skillResults?: SkillAnalysisResult;
    localIssues?: LocalSlopIssue[];
}

export class AntiSlopAnalyzer {
    private geminiService: GeminiService;
    private skillManager: SkillManager;
    private results: Map<string, ExtendedAnalysisResult> = new Map();
    private pipelines: PipelineItem[] = [];
    private outputChannel: vscode.OutputChannel;
    private diagnosticCollection: vscode.DiagnosticCollection;
    public resultsTreeProvider: ResultsTreeProvider;
    public pipelinesTreeProvider: PipelinesTreeProvider;

    constructor(private context: vscode.ExtensionContext) {
        this.outputChannel = vscode.window.createOutputChannel('Anti-Slop');
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('anti-slop');
        this.context.subscriptions.push(this.diagnosticCollection);

        this.geminiService = GeminiService.getInstance(context);
        this.skillManager = new SkillManager('', this.geminiService.getActiveModelName(), this.geminiService);

        this.resultsTreeProvider = new ResultsTreeProvider();
        this.pipelinesTreeProvider = new PipelinesTreeProvider();

        this.loadPipelines();
    }

    /**
     * Verify or prompt for Gemini API Key (with Free Tier guidance).
     */
    async ensureApiKey(): Promise<boolean> {
        const { key } = await this.geminiService.getApiKey();
        if (key) {
            this.skillManager.updateApiKey(key);
            this.skillManager.setGeminiService(this.geminiService);
            return true;
        }

        const choice = await vscode.window.showWarningMessage(
            'Anti-Slop requires a Gemini API key. You can get a free key instantly from Google AI Studio.',
            'Enter API Key',
            'Get Free Key (Google AI Studio)',
            'Scan Locally (AST Only)'
        );

        if (choice === 'Get Free Key (Google AI Studio)') {
            await GeminiService.openAiStudioForFreeKey();
            // Prompt right away after opening browser
            await this.configureApiKey();
            const checked = await this.geminiService.getApiKey();
            return !!checked.key;
        } else if (choice === 'Enter API Key') {
            await this.configureApiKey();
            const checked = await this.geminiService.getApiKey();
            return !!checked.key;
        }

        return false;
    }

    /**
     * Interactive API Key setup menu.
     */
    async configureApiKey(): Promise<void> {
        const current = await this.geminiService.getApiKey();
        const statusText = current.key
            ? `(Configured via ${current.source})`
            : '(Not configured)';

        const selection = await vscode.window.showQuickPick([
            {
                label: '$(key) Enter Gemini API Key',
                description: statusText,
                detail: 'Paste your key from Google AI Studio (Free tier supported)'
            },
            {
                label: '$(globe) Get Free Gemini API Key',
                description: 'https://aistudio.google.com/app/apikey',
                detail: 'Open Google AI Studio in browser to generate a free API key'
            },
            {
                label: '$(beaker) Test Current API Key',
                description: `Model: ${this.geminiService.getActiveModelName()}`,
                detail: 'Send a test ping to Google Gemini to verify connection & quota'
            },
            {
                label: '$(trash) Clear Saved API Key',
                description: 'Remove stored key from VS Code secure vault',
                detail: 'Delete the saved credential'
            }
        ], {
            placeHolder: 'Anti-Slop: Gemini API Key Management'
        });

        if (!selection) return;

        if (selection.label.includes('Enter Gemini API Key')) {
            const inputKey = await vscode.window.showInputBox({
                prompt: 'Enter your Gemini API key from Google AI Studio',
                password: true,
                ignoreFocusOut: true,
                placeHolder: 'AIzaSy...'
            });

            if (inputKey && inputKey.trim().length > 0) {
                const cleaned = cleanApiKey(inputKey);
                // Validate before saving
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Validating Gemini API key...',
                    cancellable: false
                }, async () => {
                    const validation = await this.geminiService.validateApiKey(cleaned);
                    if (validation.valid) {
                        await this.geminiService.storeApiKey(cleaned);
                        this.skillManager.updateApiKey(cleaned);
                        this.skillManager.setGeminiService(this.geminiService);
                        vscode.window.showInformationMessage(
                            `✅ Gemini Free Key saved & validated! Model: ${this.geminiService.getActiveModelName()}`
                        );
                    } else {
                        const proceed = await vscode.window.showErrorMessage(
                            `Validation warning: ${validation.error || 'Failed to connect'}. Save anyway?`,
                            'Save Anyway',
                            'Cancel'
                        );
                        if (proceed === 'Save Anyway') {
                            await this.geminiService.storeApiKey(cleaned);
                            this.skillManager.updateApiKey(cleaned);
                            this.skillManager.setGeminiService(this.geminiService);
                            vscode.window.showInformationMessage('API key saved.');
                        }
                    }
                });
            }
        } else if (selection.label.includes('Get Free Gemini API Key')) {
            await GeminiService.openAiStudioForFreeKey();
            vscode.window.showInformationMessage(
                'Opening Google AI Studio... Once you generate your key, click "Anti-Slop: Configure Gemini API Key" to paste it.'
            );
        } else if (selection.label.includes('Test Current API Key')) {
            await this.testApiKey();
        } else if (selection.label.includes('Clear Saved API Key')) {
            await this.geminiService.clearApiKey();
            vscode.window.showInformationMessage('Gemini API key has been cleared.');
        }
    }

    /**
     * Send a lightweight verification ping to Gemini API.
     */
    async testApiKey(): Promise<void> {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Testing Gemini API connection...',
            cancellable: false
        }, async () => {
            const result = await this.geminiService.validateApiKey();
            const model = this.geminiService.getActiveModelName();
            if (result.valid) {
                vscode.window.showInformationMessage(
                    `✅ Gemini API Key is active & ready! Using model: ${model} (Free Tier compatible).`
                );
            } else {
                vscode.window.showErrorMessage(
                    `❌ Gemini API connection failed: ${result.error || 'Unknown error'}. Check your key or free tier quota.`
                );
            }
        });
    }

    /**
     * Clear all current diagnostics and analysis results.
     */
    clearResults(): void {
        this.results.clear();
        this.diagnosticCollection.clear();
        this.resultsTreeProvider.refresh(this.convertToTreeResults());
        vscode.window.showInformationMessage('Anti-Slop results and diagnostics cleared.');
    }

    /**
     * Main analysis method for a single file.
     * Combines fast local heuristics + Gemini Free Tier LLM analysis.
     */
    async analyzeFile(fileUri: vscode.Uri, forceUnified: boolean = true): Promise<void> {
        const document = await vscode.workspace.openTextDocument(fileUri);
        const code = document.getText();
        const fileName = path.basename(fileUri.fsPath);
        const config = vscode.workspace.getConfiguration('antiSlop');
        const enableLocal = config.get<boolean>('enableLocalHeuristics', true);
        const useUnified = forceUnified || config.get<boolean>('useUnifiedScan', true);

        // 1. Run zero-cost local heuristic checks immediately
        let localIssues: LocalSlopIssue[] = [];
        if (enableLocal) {
            localIssues = runLocalRules(code, fileName);
        }

        const hasKey = await this.ensureApiKey();

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Anti-Slop: Analyzing ${fileName}...`,
            cancellable: false
        }, async (progress) => {
            try {
                let aiFindings: Finding[] = [];
                let overallScore = 0;
                let patterns: string[] = [];
                let suggestions: string[] = [];
                let skillResult: SkillAnalysisResult | undefined;

                if (hasKey) {
                    try {
                        if (useUnified) {
                            progress.report({ message: 'Running Gemini Unified scan (1 API call)...' });
                            skillResult = await this.skillManager.analyzeUnified(code, fileName, (msg) => {
                                progress.report({ message: msg });
                            });
                            overallScore = skillResult.overallScore;
                            aiFindings = skillResult.results.flatMap(r => r.findings);
                            patterns = aiFindings.map(f => f.pattern);
                            suggestions = aiFindings.map(f => f.suggestion);
                        } else {
                            progress.report({ message: 'Querying Gemini model...' });
                            const prompt = `Analyze this code for "vibe-coded" patterns - characteristics of AI-generated code that may lack human engineering judgment:

File: ${fileName}

Code:
\`\`\`
${code}
\`\`\`

Identify:
1. Over-generic variable/function names
2. Excessive comments that restate obvious code
3. Overly defensive programming (unnecessary null checks everywhere)
4. Cookie-cutter patterns without project context
5. Silent error handling or swallowed exceptions

Respond in JSON format:
{
  "score": <0-1, confidence this is vibe-coded>,
  "patterns": [<list of detected patterns>],
  "suggestions": [<actionable improvements>]
}`;
                            const response = await this.geminiService.generateWithRetry(prompt);
                            let jsonText = response;
                            const match = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
                            if (match) {
                                jsonText = match[1];
                            }
                            const parsed = JSON.parse(jsonText);
                            overallScore = parsed.score || 0;
                            patterns = parsed.patterns || [];
                            suggestions = parsed.suggestions || [];
                            aiFindings = patterns.map(p => ({
                                severity: 'medium',
                                pattern: p,
                                description: p,
                                suggestion: suggestions[0] || 'Refactor code to conform to engineering best practices.'
                            }));
                        }
                    } catch (aiErr: any) {
                        const aiMsg = aiErr?.message || String(aiErr);
                        vscode.window.showWarningMessage(
                            `Gemini AI rate limit reached. Displaying local static analysis results for ${fileName}.`
                        );
                        this.outputChannel.appendLine(`AI scan throttled: ${aiMsg}. Using local heuristics.`);
                    }
                }

                // If AI was skipped or failed, compute score from local issues
                if ((!hasKey || aiFindings.length === 0) && localIssues.length > 0) {
                    overallScore = Math.min(1.0, localIssues.length * 0.25);
                    patterns = localIssues.map(i => i.message);
                    suggestions = localIssues.map(i => i.remediationSuggestion);
                }

                const extendedResult: ExtendedAnalysisResult = {
                    file: fileName,
                    filePath: fileUri.fsPath,
                    score: overallScore,
                    patterns,
                    suggestions,
                    timestamp: new Date(),
                    findings: aiFindings,
                    skillResults: skillResult,
                    localIssues
                };

                this.results.set(fileUri.fsPath, extendedResult);

                // Update in-editor diagnostics and sidebar
                this.updateDiagnostics(fileUri, aiFindings, localIssues);
                this.resultsTreeProvider.refresh(this.convertToTreeResults());

                const threshold = config.get<number>('analysisThreshold') || 0.7;
                const pct = (overallScore * 100).toFixed(0);

                if (overallScore >= threshold) {
                    vscode.window.showWarningMessage(
                        `⚠️ ${fileName} flagged with high vibe-code score: ${pct}% (${aiFindings.length + localIssues.length} issues)`,
                        'Show Details',
                        'Show Report'
                    ).then(sel => {
                        if (sel === 'Show Details') {
                            if (skillResult) {
                                this.showSkillResultDetails(skillResult);
                            } else {
                                this.showResultDetails(extendedResult);
                            }
                        } else if (sel === 'Show Report') {
                            this.showReport();
                        }
                    });
                } else {
                    vscode.window.showInformationMessage(
                        `✅ ${fileName} scan complete. Vibe score: ${pct}% (${aiFindings.length + localIssues.length} issues found)`
                    );
                }
            } catch (err: any) {
                const msg = err?.message || String(err);
                this.outputChannel.appendLine(`Error analyzing ${fileName}: ${msg}`);
                vscode.window.showErrorMessage(`Anti-Slop analysis failed: ${msg}`);
            }
        });
    }

    /**
     * Analyze with all individual skills sequentially.
     */
    async analyzeFileWithSkills(fileUri: vscode.Uri, selectedSkills?: string[]): Promise<void> {
        const hasKey = await this.ensureApiKey();
        if (!hasKey) return;

        const document = await vscode.workspace.openTextDocument(fileUri);
        const code = document.getText();
        const fileName = path.basename(fileUri.fsPath);

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Anti-Slop: Multi-Skill Analysis for ${fileName}...`,
            cancellable: false
        }, async (progress) => {
            try {
                const skillResult = await this.skillManager.analyzeWithAllSkills(
                    code,
                    fileName,
                    selectedSkills,
                    (skillName, idx, total) => {
                        progress.report({ message: `Running skill ${idx}/${total}: ${skillName}...` });
                    }
                );

                const findings = skillResult.results.flatMap(r => r.findings);
                const extendedResult: ExtendedAnalysisResult = {
                    file: fileName,
                    filePath: fileUri.fsPath,
                    score: skillResult.overallScore,
                    patterns: findings.map(f => f.pattern),
                    suggestions: findings.map(f => f.suggestion),
                    timestamp: skillResult.timestamp,
                    findings,
                    skillResults: skillResult
                };

                this.results.set(fileUri.fsPath, extendedResult);
                this.updateDiagnostics(fileUri, findings, []);
                this.resultsTreeProvider.refresh(this.convertToTreeResults());

                vscode.window.showInformationMessage(
                    `Multi-skill analysis complete for ${fileName}. Score: ${(skillResult.overallScore * 100).toFixed(0)}%`,
                    'Show Details'
                ).then(sel => {
                    if (sel === 'Show Details') {
                        this.showSkillResultDetails(skillResult);
                    }
                });
            } catch (err: any) {
                vscode.window.showErrorMessage(`Multi-skill analysis error: ${err?.message || err}`);
            }
        });
    }

    async analyzeByCategory(fileUri: vscode.Uri): Promise<void> {
        const hasKey = await this.ensureApiKey();
        if (!hasKey) return;

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
                const skillResult = await this.skillManager.analyzeByCategory(category, code, fileName);
                this.showSkillResultDetails(skillResult);
            } catch (error: any) {
                vscode.window.showErrorMessage(`Category analysis failed: ${error?.message || error}`);
            }
        });
    }

    async selectAndAnalyzeWithSkills(fileUri: vscode.Uri): Promise<void> {
        const skills = this.skillManager.getAvailableSkills();
        const selected = await vscode.window.showQuickPick(
            skills.map(s => ({
                label: s.name,
                description: s.category,
                detail: s.description,
                picked: s.name === 'Unified AI Slop Detector'
            })),
            {
                placeHolder: 'Select skills to run (Unified recommended for Free Tier)',
                canPickMany: true
            }
        );

        if (!selected || selected.length === 0) return;

        const selectedNames = selected.map(s => s.label);
        await this.analyzeFileWithSkills(fileUri, selectedNames);
    }

    async listSkills(): Promise<void> {
        const skills = this.skillManager.getAvailableSkills();
        await vscode.window.showQuickPick(
            skills.map(s => ({
                label: s.name,
                description: `[${s.category}]`,
                detail: s.description
            })),
            {
                placeHolder: 'Available Anti-Slop Detection Skills'
            }
        );
    }

    /**
     * Scan workspace with Free-Tier pacing (4s interval) to protect 15 RPM quota.
     */
    async analyzeWorkspace(): Promise<void> {
        const config = vscode.workspace.getConfiguration('antiSlop');
        const excludePatterns = config.get<string[]>('excludePatterns') || [];
        const pacingMs = config.get<number>('freeTierRateLimitPacingMs', 4000);

        const files = await vscode.workspace.findFiles(
            '**/*.{ts,js,tsx,jsx,py,java,cpp,c,go,rs}',
            `{${excludePatterns.join(',')}}`
        );

        if (files.length === 0) {
            vscode.window.showInformationMessage('No source files found to analyze.');
            return;
        }

        const proceed = await vscode.window.showInformationMessage(
            `Found ${files.length} file(s). On Gemini Free Tier (15 RPM), workspace analysis will pace requests (${Math.round(pacingMs / 1000)}s apart) to prevent 429 errors. Proceed?`,
            'Start Scan',
            'Cancel'
        );

        if (proceed !== 'Start Scan') return;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Analyzing workspace...',
            cancellable: true
        }, async (progress, token) => {
            let analyzed = 0;
            for (let i = 0; i < files.length; i++) {
                if (token.isCancellationRequested) {
                    vscode.window.showWarningMessage('Workspace scan canceled.');
                    break;
                }

                const file = files[i];
                progress.report({
                    increment: (100 / files.length),
                    message: `${i + 1}/${files.length}: ${path.basename(file.fsPath)}`
                });

                try {
                    // Unified single-prompt scan per file
                    await this.analyzeFile(file, true);
                    analyzed++;
                } catch (error: any) {
                    this.outputChannel.appendLine(`Skipped ${file.fsPath}: ${error?.message || error}`);
                }

                // Pacing between files to stay under 15 RPM
                if (i < files.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, pacingMs));
                }
            }

            vscode.window.showInformationMessage(
                `Workspace scan complete! Analyzed ${analyzed}/${files.length} file(s).`,
                'Show Report'
            ).then(sel => {
                if (sel === 'Show Report') {
                    this.showReport();
                }
            });
        });
    }

    /**
     * Map issues to VS Code in-editor diagnostics (squiggles & Problems panel).
     */
    private updateDiagnostics(
        fileUri: vscode.Uri,
        findings: Finding[],
        localIssues: LocalSlopIssue[]
    ): void {
        const config = vscode.workspace.getConfiguration('antiSlop');
        if (!config.get<boolean>('enableInlineDiagnostics', true)) {
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];

        // Local issues
        for (const local of localIssues) {
            const startLine = Math.max(0, local.line - 1);
            const startCol = Math.max(0, local.column - 1);
            const endLine = local.endLine ? Math.max(0, local.endLine - 1) : startLine;
            const endCol = local.endColumn ? Math.max(0, local.endColumn - 1) : startCol + 10;

            const range = new vscode.Range(startLine, startCol, endLine, endCol);
            const severity = local.severity === 'error'
                ? vscode.DiagnosticSeverity.Error
                : local.severity === 'warning'
                ? vscode.DiagnosticSeverity.Warning
                : vscode.DiagnosticSeverity.Information;

            const diag = new vscode.Diagnostic(
                range,
                `[Anti-Slop ${local.ruleId}] ${local.message} — ${local.remediationSuggestion}`,
                severity
            );
            diag.source = 'Anti-Slop';
            diagnostics.push(diag);
        }

        // AI findings
        for (const finding of findings) {
            let range: vscode.Range;
            if (finding.lineRange && finding.lineRange.start > 0) {
                const startLine = finding.lineRange.start - 1;
                const endLine = (finding.lineRange.end || finding.lineRange.start) - 1;
                range = new vscode.Range(startLine, 0, endLine, 999);
            } else {
                range = new vscode.Range(0, 0, 0, 999);
            }

            const severity = finding.severity === 'critical' || finding.severity === 'high'
                ? vscode.DiagnosticSeverity.Error
                : finding.severity === 'medium'
                ? vscode.DiagnosticSeverity.Warning
                : vscode.DiagnosticSeverity.Information;

            const diag = new vscode.Diagnostic(
                range,
                `[Anti-Slop: ${finding.pattern}] ${finding.description}\n💡 ${finding.suggestion}`,
                severity
            );
            diag.source = 'Anti-Slop (Gemini)';
            diagnostics.push(diag);
        }

        this.diagnosticCollection.set(fileUri, diagnostics);
    }

    private convertToTreeResults(): Map<string, TreeAnalysisResult> {
        const treeMap = new Map<string, TreeAnalysisResult>();
        for (const [key, val] of this.results.entries()) {
            treeMap.set(key, {
                file: val.file,
                filePath: val.filePath,
                score: val.score,
                patterns: val.patterns,
                suggestions: val.suggestions,
                timestamp: val.timestamp,
                findings: val.findings
            });
        }
        return treeMap;
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

        const severityColors: Record<string, string> = {
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
                                    <div class="finding" style="border-left: 4px solid ${severityColors[f.severity] || '#999'}">
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
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; background: #fafafa; color: #222; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .overall-score { font-size: 64px; font-weight: bold; color: ${scoreColor}; margin: 10px 0; }
        .category-section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h2 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
        h3 { color: #555; margin-top: 0; }
        .skill-result { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 6px; }
        .skill-score { font-size: 32px; font-weight: bold; margin: 10px 0; }
        .findings { margin-top: 15px; }
        .finding { background: white; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #ddd; }
        .finding-header { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
        .severity { padding: 4px 8px; border-radius: 4px; font-size: 0.75em; font-weight: bold; color: white; }
        .severity.critical { background: #d32f2f; }
        .severity.high { background: #f44336; }
        .severity.medium { background: #ff9800; }
        .severity.low { background: #ffc107; color: #333; }
        .severity.info { background: #2196f3; }
        .pattern-name { font-weight: 600; color: #333; }
        .finding-description { color: #555; margin: 8px 0; line-height: 1.5; }
        .finding-suggestion { background: #e3f2fd; padding: 10px; border-radius: 4px; margin-top: 10px; color: #1565c0; line-height: 1.5; }
        .line-range { font-size: 0.85em; color: #888; margin-top: 8px; }
        .stats { display: flex; gap: 20px; margin-top: 20px; }
        .stat { flex: 1; text-align: center; }
        .stat-value { font-size: 32px; font-weight: bold; color: #333; }
        .stat-label { color: #666; font-size: 0.9em; }
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
            <th>Issues</th>
            <th>Timestamp</th>
        </tr>
        ${results.sort((a, b) => b.score - a.score).map(r => `
            <tr>
                <td>${r.file}</td>
                <td class="${r.score >= 0.7 ? 'high' : r.score >= 0.4 ? 'medium' : 'low'}">
                    ${(r.score * 100).toFixed(0)}%
                </td>
                <td>${(r.findings?.length ?? 0) + (r.localIssues?.length ?? 0)}</td>
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

        const pipeline: PipelineItem = {
            id: Date.now().toString(),
            name,
            filePatterns: patterns.split(',').map(p => p.trim()),
            enabled: true
        };

        this.pipelines.push(pipeline);
        this.savePipelines();
        this.pipelinesTreeProvider.refresh(this.pipelines);

        vscode.window.showInformationMessage(`Pipeline "${name}" created!`);
    }

    private loadPipelines(): void {
        const stored = this.context.globalState.get<PipelineItem[]>('pipelines');
        if (stored) {
            this.pipelines = stored;
            this.pipelinesTreeProvider.refresh(this.pipelines);
        }
    }

    private savePipelines(): void {
        this.context.globalState.update('pipelines', this.pipelines);
    }
}

export function activate(context: vscode.ExtensionContext) {
    const analyzer = new AntiSlopAnalyzer(context);

    // Register Activity Bar Tree Views
    vscode.window.registerTreeDataProvider('antiSlopResults', analyzer.resultsTreeProvider);
    vscode.window.registerTreeDataProvider('antiSlopPipelines', analyzer.pipelinesTreeProvider);

    // 1. API Key Configuration & Helper Commands
    context.subscriptions.push(
        vscode.commands.registerCommand('anti-slop.configureApiKey', async () => {
            await analyzer.configureApiKey();
        }),
        vscode.commands.registerCommand('anti-slop.getFreeApiKey', async () => {
            await GeminiService.openAiStudioForFreeKey();
        }),
        vscode.commands.registerCommand('anti-slop.testApiKey', async () => {
            await analyzer.testApiKey();
        }),
        vscode.commands.registerCommand('anti-slop.clearResults', () => {
            analyzer.clearResults();
        })
    );

    // 2. File Analysis Commands
    context.subscriptions.push(
        vscode.commands.registerCommand('anti-slop.analyzeFile', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active file to analyze');
                return;
            }
            await analyzer.analyzeFile(editor.document.uri);
        }),
        vscode.commands.registerCommand('anti-slop.analyzeFileUnified', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active file to analyze');
                return;
            }
            await analyzer.analyzeFile(editor.document.uri, true);
        }),
        vscode.commands.registerCommand('anti-slop.analyzeFileWithSkills', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active file to analyze');
                return;
            }
            await analyzer.analyzeFileWithSkills(editor.document.uri);
        }),
        vscode.commands.registerCommand('anti-slop.selectSkills', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active file to analyze');
                return;
            }
            await analyzer.selectAndAnalyzeWithSkills(editor.document.uri);
        }),
        vscode.commands.registerCommand('anti-slop.analyzeByCategory', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active file to analyze');
                return;
            }
            await analyzer.analyzeByCategory(editor.document.uri);
        }),
        vscode.commands.registerCommand('anti-slop.listSkills', async () => {
            await analyzer.listSkills();
        })
    );

    // 3. Workspace & Pipeline Commands
    context.subscriptions.push(
        vscode.commands.registerCommand('anti-slop.analyzeWorkspace', async () => {
            await analyzer.analyzeWorkspace();
        }),
        vscode.commands.registerCommand('anti-slop.showReport', () => {
            analyzer.showReport();
        }),
        vscode.commands.registerCommand('anti-slop.createPipeline', async () => {
            await analyzer.createPipeline();
        })
    );

    // 4. Auto-analyze on Save Listener
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(async (document) => {
            const config = vscode.workspace.getConfiguration('antiSlop');
            if (config.get<boolean>('autoAnalyzeOnSave')) {
                await analyzer.analyzeFile(document.uri);
            }
        })
    );
}

export function deactivate() {}
