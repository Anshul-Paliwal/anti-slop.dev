import * as vscode from 'vscode';
import * as path from 'path';

export interface TreeAnalysisResult {
    file: string;
    filePath?: string;
    score: number;
    patterns: string[];
    suggestions: string[];
    timestamp: Date;
    findings?: Array<{
        severity: string;
        pattern: string;
        description: string;
        suggestion: string;
        lineRange?: { start: number; end: number };
    }>;
}

export interface PipelineItem {
    id: string;
    name: string;
    filePatterns: string[];
    enabled: boolean;
}

export class ResultsTreeProvider implements vscode.TreeDataProvider<ResultTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ResultTreeItem | undefined | null | void> =
        new vscode.EventEmitter<ResultTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ResultTreeItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    private results: Map<string, TreeAnalysisResult> = new Map();

    refresh(results?: Map<string, TreeAnalysisResult>): void {
        if (results) {
            this.results = results;
        }
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ResultTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ResultTreeItem): Thenable<ResultTreeItem[]> {
        if (!element) {
            // Root level: return list of analyzed files
            const items: ResultTreeItem[] = [];
            for (const [key, res] of this.results.entries()) {
                const pct = Math.round(res.score * 100);
                const icon = res.score >= 0.7 ? '🔴' : res.score >= 0.4 ? '🟡' : '🟢';
                const item = new ResultTreeItem(
                    `${icon} ${path.basename(res.file)} (${pct}%)`,
                    vscode.TreeItemCollapsibleState.Collapsed,
                    'file',
                    res
                );
                item.description = `${res.patterns.length || (res.findings?.length ?? 0)} issue(s)`;
                item.tooltip = `${res.file}\nVibe score: ${pct}%\nAnalyzed: ${res.timestamp.toLocaleTimeString()}`;
                items.push(item);
            }
            if (items.length === 0) {
                const emptyItem = new ResultTreeItem(
                    'No files analyzed yet',
                    vscode.TreeItemCollapsibleState.None,
                    'empty'
                );
                emptyItem.description = 'Run "Anti-Slop: Analyze Current File"';
                return Promise.resolve([emptyItem]);
            }
            return Promise.resolve(items);
        }

        if (element.itemType === 'file' && element.resultData) {
            // Child level: return findings for this file
            const childItems: ResultTreeItem[] = [];
            const findings = element.resultData.findings || [];

            if (findings.length > 0) {
                findings.forEach(f => {
                    const startLine = f.lineRange?.start || 1;
                    const item = new ResultTreeItem(
                        `[${f.severity.toUpperCase()}] ${f.pattern}`,
                        vscode.TreeItemCollapsibleState.None,
                        'finding'
                    );
                    item.description = f.lineRange ? `Line ${f.lineRange.start}` : '';
                    item.tooltip = `${f.description}\n\n💡 Suggestion: ${f.suggestion}`;
                    
                    if (element.resultData?.filePath) {
                        item.command = {
                            command: 'vscode.open',
                            title: 'Open File',
                            arguments: [
                                vscode.Uri.file(element.resultData.filePath),
                                { selection: new vscode.Range(startLine - 1, 0, startLine - 1, 0) }
                            ]
                        };
                    }
                    childItems.push(item);
                });
            } else {
                (element.resultData.patterns || []).forEach(p => {
                    const item = new ResultTreeItem(
                        `⚠️ ${p}`,
                        vscode.TreeItemCollapsibleState.None,
                        'pattern'
                    );
                    childItems.push(item);
                });
            }

            return Promise.resolve(childItems);
        }

        return Promise.resolve([]);
    }
}

export class ResultTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly itemType: 'file' | 'finding' | 'pattern' | 'empty',
        public readonly resultData?: TreeAnalysisResult
    ) {
        super(label, collapsibleState);
    }
}

export class PipelinesTreeProvider implements vscode.TreeDataProvider<PipelineTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PipelineTreeItem | undefined | null | void> =
        new vscode.EventEmitter<PipelineTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<PipelineTreeItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    private pipelines: PipelineItem[] = [];

    refresh(pipelines: PipelineItem[]): void {
        this.pipelines = pipelines;
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: PipelineTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PipelineTreeItem): Thenable<PipelineTreeItem[]> {
        if (!element) {
            if (this.pipelines.length === 0) {
                const emptyItem = new PipelineTreeItem(
                    'No pipelines defined',
                    vscode.TreeItemCollapsibleState.None
                );
                emptyItem.description = 'Create with "Anti-Slop: Create Analysis Pipeline"';
                return Promise.resolve([emptyItem]);
            }
            return Promise.resolve(
                this.pipelines.map(p => {
                    const item = new PipelineTreeItem(
                        `🚀 ${p.name}`,
                        vscode.TreeItemCollapsibleState.None,
                        p
                    );
                    item.description = p.filePatterns.join(', ');
                    return item;
                })
            );
        }
        return Promise.resolve([]);
    }
}

export class PipelineTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly pipeline?: PipelineItem
    ) {
        super(label, collapsibleState);
    }
}
