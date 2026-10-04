# Anti-Slop VS Code Extension

🔍 Analyze your codebase for "vibe-coded" patterns using AI. Identify AI-generated code that lacks human engineering judgment.

## Features

### 🤖 AI-Powered Code Analysis
- Uses **Gemini Flash 2.0** (or other Gemini models) to detect vibe-coded patterns
- **BYOK (Bring Your Own Key)** - use your own Gemini API key
- Analyzes individual files or entire workspaces
- Real-time feedback on code quality

### 🚨 Pattern Detection
The extension identifies common AI-generated code smells:
- Over-generic variable/function names
- Excessive obvious comments
- Overly defensive programming
- Cookie-cutter patterns without context
- Missing edge cases
- Unnecessary boilerplate
- Inconsistent naming conventions
- Dead code or unused imports

### 📊 Analysis Reports
- Visual dashboards with risk scores
- Detailed pattern breakdowns
- Actionable improvement suggestions
- Historical analysis tracking

### ⚙️ Pipeline Support
- Create custom analysis pipelines
- Schedule automated scans
- Target specific file patterns
- Enable/disable pipelines on demand

## Getting Started

### 1. Install the Extension
```bash
cd vscode-extension
npm install
npm run compile
```

### 2. Configure Your API Key
1. Open VS Code Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Run: **Anti-Slop: Configure Gemini API Key**
3. Enter your [Gemini API key](https://ai.google.dev/)

### 3. Start Analyzing
- **Analyze Current File**: `Ctrl+Shift+P` → `Anti-Slop: Analyze Current File`
- **Analyze Workspace**: `Ctrl+Shift+P` → `Anti-Slop: Analyze Entire Workspace`
- **View Report**: `Ctrl+Shift+P` → `Anti-Slop: Show Analysis Report`

## Configuration

Access settings via `File > Preferences > Settings` → Search "Anti-Slop"

```json
{
  "antiSlop.geminiApiKey": "",
  "antiSlop.model": "gemini-2.0-flash-exp",
  "antiSlop.analysisThreshold": 0.7,
  "antiSlop.autoAnalyzeOnSave": false,
  "antiSlop.excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.git/**"
  ]
}
```

### Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `geminiApiKey` | Your Gemini API key | `""` |
| `model` | Gemini model to use | `"gemini-2.0-flash-exp"` |
| `analysisThreshold` | Score threshold for warnings (0-1) | `0.7` |
| `autoAnalyzeOnSave` | Auto-analyze files on save | `false` |
| `excludePatterns` | Glob patterns to exclude | See above |

## Commands

| Command | Description |
|---------|-------------|
| `Anti-Slop: Configure Gemini API Key` | Set up your API key |
| `Anti-Slop: Analyze Current File` | Analyze the active file |
| `Anti-Slop: Analyze Entire Workspace` | Scan all code files |
| `Anti-Slop: Show Analysis Report` | View full report |
| `Anti-Slop: Create Analysis Pipeline` | Set up automated scans |

## Supported Languages

- TypeScript/JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`)
- Python (`.py`)
- Java (`.java`)
- C/C++ (`.c`, `.cpp`)
- Go (`.go`)
- Rust (`.rs`)

## Understanding Scores

- **0-40%** (Low) - Clean code with minimal vibe patterns
- **40-70%** (Medium) - Some patterns detected, review suggested
- **70-100%** (High) - Strong indicators of AI generation, refactoring recommended

## Example Pipeline

Create a pipeline for daily frontend analysis:

1. Run: `Anti-Slop: Create Analysis Pipeline`
2. Name: "Daily Frontend Analysis"
3. Patterns: `src/**/*.tsx, components/**/*.tsx`

## Development

### Build
```bash
npm run compile
```

### Watch Mode
```bash
npm run watch
```

### Package
```bash
npm run package
```

## Privacy & Security

- Your API key is stored locally in VS Code settings
- Code is sent to Google's Gemini API for analysis
- No data is stored on external servers
- Rate limiting applied to avoid quota exhaustion

## License

MIT

## Contributing

Found a bug or have a feature request? Open an issue on GitHub!
