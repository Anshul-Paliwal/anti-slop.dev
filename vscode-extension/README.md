# Anti-Slop VS Code Extension

🔍 Analyze your codebase for "vibe-coded" patterns using AI. Identify AI-generated code that lacks human engineering judgment.

## Features

### 🤖 AI-Powered Code Analysis & Gemini Free Tier Support
- Uses **Gemini 3.8 Flash** (or `gemini-3.8-pro`, `gemini-3.0-flash`, `gemini-2.5-flash`) to detect vibe-coded patterns.
- **100% Free Tier Ready (Google AI Studio BYOK)**:
  - Built-in one-click link to generate a free Gemini API key: [Google AI Studio](https://aistudio.google.com/app/apikey).
  - Secure credential storage using VS Code's native Secret Storage (no plain-text settings leakage).
  - Instant API key testing & validation (`Anti-Slop: Test Gemini API Key`).
  - **Free Tier Quota Optimization**:
    - **Unified Single-Call Scan**: Analyzes all slop categories (ChatGPT, Claude, Copilot, Security, UI, Architecture) in **1 single API call** rather than 6 separate requests, conserving 85% of your 15 RPM free quota!
    - **Adaptive Rate-Limiting & Exponential Backoff**: Automatically catches HTTP 429 / `RESOURCE_EXHAUSTED` and safely pauses before retrying.
    - **Workspace Pacing**: Automatically paces workspace scans (4s delay) to stay safely beneath the 15 RPM ceiling.
- **Hybrid Static + AI Detection**:
  - Runs zero-cost, instant AST & regex heuristics (console statements, debuggers, empty catch blocks, placeholder tokens) locally.
  - Can function even without an API key or when offline!
- **In-Editor Inline Diagnostics**:
  - Displays squiggly lines and Problem panel entries pointing directly to slop lines with actionable human fixes.
- **Activity Bar Sidebar**:
  - Explore findings file-by-file in the **Analysis Results** view.
  - Jump directly to flagged code with a single click.

## Getting Started

### 1. Install & Build
```bash
cd vscode-extension
npm install
npm run compile
```

### 2. Configure Your Free Gemini API Key
1. Open the VS Code Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run: **Anti-Slop: Configure Gemini API Key**
3. Select **Get Free Gemini API Key** (opens [Google AI Studio](https://aistudio.google.com/app/apikey)) to generate your key, or choose **Enter Gemini API Key** to paste it.
4. Run **Anti-Slop: Test Gemini API Key** to confirm your key is validated and ready!

### 3. Start Analyzing
- **Quick Slop Scan (Free Tier Unified)**: `Ctrl+Shift+P` → `Anti-Slop: Quick Slop Scan (Free Tier Unified)`
- **Analyze Current File**: `Ctrl+Shift+P` → `Anti-Slop: Analyze Current File`
- **Analyze with All Skills**: `Ctrl+Shift+P` → `Anti-Slop: Analyze with All Skills`
- **Analyze Entire Workspace**: `Ctrl+Shift+P` → `Anti-Slop: Analyze Entire Workspace`
- **Show Analysis Report**: `Ctrl+Shift+P` → `Anti-Slop: Show Analysis Report`
- **Clear Results & Diagnostics**: `Ctrl+Shift+P` → `Anti-Slop: Clear Results & Diagnostics`

## Configuration

Access settings via `File > Preferences > Settings` → Search "Anti-Slop"

```json
{
  "antiSlop.model": "gemini-3.8-flash",
  "antiSlop.useUnifiedScan": true,
  "antiSlop.enableInlineDiagnostics": true,
  "antiSlop.enableLocalHeuristics": true,
  "antiSlop.analysisThreshold": 0.7,
  "antiSlop.autoAnalyzeOnSave": false
}
```

### Settings Reference

| Setting | Description | Default |
|---------|-------------|---------|
| `model` | Gemini model (`gemini-3.8-flash`, `gemini-3.8-pro`, `gemini-3.0-flash`, `gemini-2.5-flash`) | `"gemini-3.8-flash"` |
| `useUnifiedScan` | Single-prompt scan to conserve Gemini Free Tier 15 RPM quota | `true` |
| `enableInlineDiagnostics` | Show squiggles and findings in VS Code Problems panel | `true` |
| `enableLocalHeuristics` | Run local AST heuristic checks with 0 API calls | `true` |
| `analysisThreshold` | Score threshold for warnings (0-1) | `0.7` |
| `autoAnalyzeOnSave` | Auto-analyze files on save | `false` |
| `excludePatterns` | Glob patterns to exclude from workspace scans | `["**/node_modules/**", ...]` |

## Commands

| Command | Description |
|---------|-------------|
| `Anti-Slop: Configure Gemini API Key` | Interactive API key management menu |
| `Anti-Slop: Get Free Gemini API Key` | Open Google AI Studio to obtain free key |
| `Anti-Slop: Test Gemini API Key` | Test API key connection and quota |
| `Anti-Slop: Quick Slop Scan (Free Tier Unified)` | 1-call comprehensive scan |
| `Anti-Slop: Analyze Current File` | Analyze active editor document |
| `Anti-Slop: Analyze with All Skills` | Run individual model-specific skills |
| `Anti-Slop: Select Skills and Analyze` | Pick specific skills to run |
| `Anti-Slop: Analyze by Category` | Scan for specific category (AI Slop, Security, etc.) |
| `Anti-Slop: List Available Skills` | View catalog of detection skills |
| `Anti-Slop: Analyze Entire Workspace` | Scan all code files with Free-Tier pacing |
| `Anti-Slop: Clear Results & Diagnostics` | Reset findings and editor squiggles |
| `Anti-Slop: Show Analysis Report` | Open interactive visual dashboard |
| `Anti-Slop: Create Analysis Pipeline` | Save custom scan pipelines |

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
