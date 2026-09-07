# AntiSlop.dev

> **AI Slop Detection & Auto-Remediation Platform for Vibe-Coded Codebases**

[![npm](https://img.shields.io/badge/npm-coming%20soon-lightgrey?logo=npm)](#quickstart)
[![VS Code](https://img.shields.io/badge/VS%20Code-extension%20in%20development-lightgrey?logo=visual-studio-code)](#architecture-layers-breakdown)
[![CI](https://img.shields.io/badge/CI-configure%20your%20workflow-lightgrey)](#contributing)
[![License](https://img.shields.io/badge/license-not%20yet%20specified-lightgrey)](#license)

AntiSlop.dev helps developers detect, understand, and remediate quality problems introduced during fast-paced AI-assisted development. It combines local AST analysis, VS Code diagnostics, an agentic auto-fix workflow, and a cloud platform for authentication, billing, and team insights.

## Problem Statement & Mission

AI-assisted development, or **vibe coding**, makes it possible to move from an idea to a working feature in minutes. That speed can also leave behind duplicated code, insecure defaults, unnecessary abstractions, and hard-to-review control flow.

We call this **AI slop**: redundant, insecure, convoluted, or unfinished code patterns that commonly accumulate when agents such as Cursor, GitHub Copilot, or Cline generate and revise code rapidly. AI slop is not defined by authorship. It is defined by the maintenance, security, and review burden the resulting code creates.

GitClear's analysis of 211 million lines of code reported that the share of refactored code fell from approximately 25% in 2021 to less than 10% in 2024, while code clones grew eightfold. AntiSlop.dev's mission is to make quality feedback part of the coding loop, with a target of less than 5% false positives and sub-five-second analysis for a 1,000-file local workspace.

## Slop Detection Taxonomy

| Category | Detection focus | Representative findings |
| --- | --- | --- |
| **Artifact slop** | Leftover implementation and generated artifacts | `console.log` statements, unused or hallucinated imports, dead commented code, duplicate helpers |
| **Logic slop** | Redundant or unnecessarily complex behavior | Overly complex expressions, deeply nested ternaries, redundant null checks, duplicated branches |
| **Security slop** | Unsafe code and insecure defaults | Hardcoded secrets, unsafe `eval()` calls, weak pseudorandom generation, unsafe input handling |
| **Tailwind / CSS slop** | Conflicting or ineffective utility composition | Conflicts such as `flex inline-block`, duplicate utilities, ineffective class combinations |
| **Component slop** | React and Vue rendering inefficiency | Avoidable re-renders, prop drilling, missing hook dependencies, unnecessary `useMemo` or `useCallback` patterns, excessive wrapper elements |

Every finding should carry a stable rule ID, category, severity, source location, explanation, and remediation metadata. An automated fix is a reviewable proposal, not a substitute for security review.

## Monorepo File Directory Layout

```text
anti-slop.dev/
├── .gitignore
├── package.json               # Monorepo root package configuration
├── package-lock.json
├── README.md
├── frontend/                  # Layer 4: Next.js App Router, Supabase, and Stripe
├── packages/                  # Layer 1: core static-analysis workspace
│   ├── npm-package/           # npx antislop CLI, Oxc/SWC parser, rules, and PostCSS
│   └── shared/                # Shared TypeScript types, constants, and issue interfaces
└── vscode-extension/          # Layers 2 and 3: editor UI and Gemini auto-fix agent
```

## Architecture Layers Breakdown

AntiSlop.dev keeps detection independent from presentation, remediation, and account infrastructure. That separation allows the core scan to remain local and useful without a cloud account.

### Layer 1: Core Analysis Engine

**Locations:** `packages/npm-package/` and `packages/shared/`

- Parses JavaScript, TypeScript, JSX, TSX, and CSS.
- Uses Oxc/SWC AST parsing, PostCSS Tailwind analysis, `fast-glob`, and Node.js `worker_threads`.
- Runs deterministic AST visitors for known heuristics.
- Produces machine-readable `antislop-report.md` findings using `<slop-issue>` XML tags.
- Publishes shared finding types, constants, severities, and interfaces for other layers.

### Layer 2: Developer UI

**Location:** `vscode-extension/`

The VS Code extension consumes engine findings and presents inline diagnostics, editor squiggles, and a sidebar tree view. It owns editor lifecycle and navigation while keeping rule logic in the analysis engine.

### Layer 3: Agentic Remediation Engine

**Location:** `vscode-extension/`

The Pro remediation workflow combines the Gemini API, repository-specific Agent Skills (`SKILL.md`), Isomorphic-Git or `child_process`, Prettier, and ESLint. It applies a proposed change on an isolated disposable Git branch, validates formatting and linting, then presents a side-by-side diff for review.

### Layer 4: Cloud Platform

**Location:** `frontend/`

The platform provides the dashboard, API routes, Supabase authentication and PostgreSQL-backed data, and Stripe subscription billing. Cloud services manage product state and entitlements; local source analysis remains local by default.

## Detection Stages Breakdown

### Stage 1: Workspace Discovery

`fast-glob` discovers supported files, applies ignore rules, and distributes work across Node.js `worker_threads`.

### Stage 2: AST and Token Parsing

Oxc/SWC parses JavaScript and TypeScript syntax while PostCSS parses CSS and utility-class content. Source locations are preserved so findings can map back to editor ranges.

### Stage 3: Hybrid Detection Engine

The engine combines deterministic AST visitors for known patterns with optional Gemini-powered semantic evaluation for novel or complex smells. Deterministic rules provide repeatability; semantic evaluation expands coverage where syntax alone is insufficient.

### Stage 4: Machine-Readable Reporting

Findings are normalized into `antislop-report.md`, with each issue represented by `<slop-issue>` XML tags. The same finding model can drive CLI output and VS Code squiggles.

### Stage 5: Agentic Auto-Fix

For an approved finding, the Pro agent creates or uses a temporary Git branch, applies a patch, runs ESLint and Prettier validation, and returns a reviewable diff without mutating the developer's active branch.

## Tooling & Tech Stack Matrix

| Stage | Step | Tool | Input | Output |
| --- | --- | --- | --- | --- |
| 1 | File discovery | `fast-glob` | Workspace path and ignore rules | Supported file list |
| 1 | Parallel scheduling | Node.js `worker_threads` | File batches | Concurrent analysis jobs |
| 2 | JS/TS parsing | Oxc / SWC | JS, TS, JSX, and TSX source | AST with source locations |
| 2 | CSS parsing | PostCSS | CSS and utility-class content | CSS/token model |
| 3 | Known-pattern detection | TypeScript AST visitors | ASTs and CSS model | Deterministic findings |
| 3 | Semantic evaluation | Gemini API + Agent Skills | Selected code context | Candidate semantic findings |
| 4 | Serialization | Core report writer | Normalized findings | `antislop-report.md` and `<slop-issue>` tags |
| 4 | Editor presentation | VS Code Diagnostics API | Finding locations and severity | Squiggles and sidebar items |
| 5 | Patch and validation | Isomorphic-Git, ESLint, Prettier | Finding and isolated branch | Validated patch and Git diff |
| Platform | Identity and billing | Next.js, Supabase, Stripe | User, plan, and subscription events | Dashboard state and entitlements |

## User Tier Matrix

| Capability | Free (Community) | Pro (Individual) | Team |
| --- | ---: | ---: | ---: |
| Local AST scans | Unlimited | Unlimited | Unlimited |
| `antislop-report.md` generation | Yes | Yes | Yes |
| VS Code diagnostics | Yes | Yes | Yes |
| Gemini agentic auto-fix | No | Yes | Yes |
| Agent Skills and Git branch safety | No | Yes | Yes |
| CI/CD integration | No | No | Yes |
| Custom enterprise rule packs | No | No | Yes |
| Manager analytics dashboard | No | No | Yes |

## Quickstart

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- Git for branch-isolated remediation

### Scan a project

Run a local scan without uploading source code:

```bash
npx antislop scan ./src --output antislop-report.md
```

Pin a version for reproducible CI runs:

```bash
npx antislop@<version> scan ./src --output antislop-report.md
```

### Develop the monorepo

```bash
git clone <repository-url>
cd anti-slop.dev
npm install
npm run build -w @anti-slop/npm-package
npm run dev:frontend
npm run build:vscode
```

The repository uses npm workspaces. The current workspace package and frontend are under active implementation; verify package scripts before depending on a command in automation. Configure Gemini, Supabase, and Stripe credentials through environment variables or your deployment secret manager. Never commit API keys, Supabase service-role keys, webhook secrets, or generated credentials.

## Privacy & Security Warranties

- **Local by default:** Free scans parse source files locally and generate the report on the developer's machine. Source is not sent to the cloud platform merely to perform an AST scan.
- **Explicit AI boundary:** Gemini semantic evaluation and auto-fix require an opt-in Pro workflow and the relevant API configuration. Teams should review provider retention and data-processing terms for their deployment.
- **Git branch safety net:** Auto-fix mutations run on disposable branches, leaving the active branch untouched until a developer reviews and applies the diff.
- **Validation before review:** Proposed changes are checked with ESLint and Prettier where configured. Passing tooling does not guarantee semantic correctness or eliminate security review.
- **Credential hygiene:** Store secrets in environment configuration or a secret manager, scope them to the minimum required permissions, and rotate them if exposure is suspected.

## License

No license file is currently declared in the repository. Until an approved `LICENSE` file is added, all rights are reserved. Do not redistribute or use this project as open-source software without the team's written authorization.

## Team Credits & Academic Affiliation

AntiSlop.dev is developed by the Full Stack AI team at the **School of Computer Science, University of Petroleum & Energy Studies (UPES), Dehradun, Uttarakhand**:

| Team member | SAP ID |
| --- | --- |
| Abhinav Singh | 500122529 |
| Sahil Narang | 500119480 |
| Mahi Goyal | 500119139 |
| Anshul Paliwal | 500121850 |

## Contributing

Contributions should preserve the boundaries between engine, editor UI, remediation, and platform layers. New rules should include a stable identifier, category, severity, source range, explanation, and focused examples or tests. Do not include real credentials or private source code in issues and pull requests.
