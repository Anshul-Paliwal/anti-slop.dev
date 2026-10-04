"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KineticCenterBuild from "@/components/ui/smoothui/kinetic-center-build";
import BasicAccordion, { AccordionItem } from "@/components/ui/smoothui/basic-accordion";
import { 
  Terminal, Shield, Cpu, Zap, HelpCircle, FileSearch, 
  Settings, Wrench, Download, GitBranch, Box, CheckCircle, 
  FileText, Activity, AlertCircle, Users
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

const FaqNavLinks = () => {
  const [activeSection, setActiveSection] = useState("general");

  const navItems = [
    { id: "general", label: "General" },
    { id: "installation", label: "Installation" },
    { id: "scanning", label: "Scanning & Detection" },
    { id: "ast", label: "AST & Engine" },
    { id: "rules", label: "Detection Rules" },
    { id: "accuracy", label: "Accuracy" },
    { id: "reports", label: "Reports" },
    { id: "vscode", label: "VS Code Extension" },
    { id: "autofix", label: "Auto-Fix" },
    { id: "llm", label: "AI Providers" },
    { id: "privacy", label: "Privacy & Security" },
    { id: "git", label: "Git & Safety" },
    { id: "performance", label: "Performance" },
    { id: "configuration", label: "Configuration" },
    { id: "teams", label: "CI/CD & Teams" },
    { id: "troubleshooting", label: "Troubleshooting" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.id);
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col gap-8 sticky top-32">
      <div>
        <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
          <KineticCenterBuild phrases={["Knowledge Base", "FAQ", "Help Center"]} interval={4000} className="!justify-start gap-1" />
        </div>
        <div className="flex flex-col gap-3 pl-4 border-l border-white/10 relative max-h-[60vh] overflow-y-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <div key={item.id} className="relative">
                {isActive && (
                  <div className="absolute -left-[17px] top-0 h-full w-[2px] bg-terminal-green shadow-[0_0_8px_rgba(39,201,63,0.5)]"></div>
                )}
                <a
                  href={`#${item.id}`}
                  className={`font-mono text-[12px] relative group flex items-center ${
                    isActive ? "text-white font-bold" : "text-white/50 hover:text-white transition-colors"
                  }`}
                >
                  {!isActive && <span className="absolute -left-[18px] opacity-0 group-hover:opacity-100 text-white/50 transition-opacity">{'>'}</span>}
                  <span className={!isActive ? "group-hover:translate-x-1 transition-transform" : ""}>{item.label}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const GENERAL_FAQS: AccordionItem[] = [
  {
    id: "what-is-antislop",
    title: "What is AntiSlop.dev?",
    content: (
      <div className="space-y-4">
        <p>
          AntiSlop.dev is an AI Slop Detection & Auto-Remediation platform designed specifically for AI-assisted or &quot;vibe-coded&quot; codebases.
        </p>
        <p>
          It acts as an automated quality-assurance layer that sits between your AI coding assistants (like Cursor, Copilot, or Claude) and your production environment, ensuring that machine-generated code remains clean, maintainable, and mathematically minimal.
        </p>
      </div>
    )
  },
  {
    id: "what-is-ai-slop",
    title: "What is \"AI slop\"?",
    content: (
      <div className="space-y-4">
        <p>
          In the context of software development, <strong>AI slop</strong> refers to low-quality patterns introduced during rapid AI-assisted development. Common examples include:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-white/30">
          <li>Redundant code or unnecessary complexity</li>
          <li>Hallucinated dependencies or phantom wrappers</li>
          <li>Leftover debugging code and console logs</li>
          <li>Contradictory styling or questionable React/Vue patterns</li>
          <li>Dead code and over-defensive error handling</li>
          <li>Hardcoded secrets or security mistakes</li>
        </ul>
        <p className="text-sm text-white/50 italic">Note: While these patterns are extremely common in AI-generated output, AntiSlop does not assume every instance was necessarily generated by AI—it just purges the slop regardless of origin.</p>
      </div>
    )
  },
  {
    id: "only-ai-generated",
    title: "Is AntiSlop only for AI-generated code?",
    content: (
      <div className="space-y-4">
        <p>
          No. While AntiSlop is meticulously designed around problems commonly encountered in AI-assisted development, its structural rules are universal. Many of its detections will accurately identify logic bloat, redundant abstractions, and security mistakes in human-written code as well.
        </p>
      </div>
    )
  },
  {
    id: "who-is-it-for",
    title: "Who is AntiSlop.dev for?",
    content: (
      <div className="space-y-4">
        <p>AntiSlop is built for:</p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-white/30">
          <li>Developers using AI coding assistants (Cursor, Copilot, etc.)</li>
          <li>&quot;Vibe coders&quot; who prototype rapidly and need a cleanup phase</li>
          <li>Frontend and full-stack developers dealing with complex React/Vue/Tailwind bases</li>
          <li>Engineering teams standardizing AI adoption</li>
          <li>Senior developers reviewing AI-generated pull requests</li>
        </ul>
      </div>
    )
  },
  {
    id: "replace-eslint",
    title: "Does AntiSlop replace ESLint?",
    content: (
      <div className="space-y-4">
        <p>
          No, AntiSlop is designed to be <strong>complementary</strong> to traditional linters like ESLint or Biome.
        </p>
        <p>
          Traditional linters enforce <em>syntactic style</em> (semicolons, spacing, variable naming). AntiSlop operates at a higher <em>semantic level</em>, detecting structural anti-patterns, hallucinated abstractions, and logic bloat that standard linters miss.
        </p>
      </div>
    )
  },
  {
    id: "replace-code-review",
    title: "Does AntiSlop replace code review?",
    content: (
      <div className="space-y-4">
        <p>
          No. AntiSlop provides an automated quality layer to strip out obvious boilerplate and architectural cruft before the code is reviewed. Human review remains incredibly valuable for verifying business logic, product requirements, and system design.
        </p>
      </div>
    )
  },
  {
    id: "require-ai",
    title: "Does AntiSlop require AI to scan my code?",
    content: (
      <div className="space-y-4">
        <p>
          No. AntiSlop's normal detection pipeline is based primarily on <strong>deterministic static analysis</strong>. JavaScript, TypeScript, and CSS are analyzed structurally using Abstract Syntax Trees (ASTs) rather than sending your source code to an AI model.
        </p>
        <p>
          LLMs are part of the <strong>optional Auto-Fix remediation layer</strong>, which you explicitly invoke only when you want the AI to rewrite a complex chunk of detected slop.
        </p>
      </div>
    )
  }
];

const INSTALLATION_FAQS: AccordionItem[] = [
  {
    id: "how-to-run",
    title: "How do I run AntiSlop?",
    content: (
      <div className="space-y-4">
        <p>You can run the AntiSlop CLI immediately using npx without installing it manually:</p>
        <div className="p-3 bg-[#111] rounded-lg border border-white/10 font-mono text-xs text-white/80">
          <span className="text-white/30 mr-2 select-none">$</span>npx antislop
        </div>
        <p>
          <Link href="/docs/installation" className="text-terminal-green hover:underline">Learn more about installation →</Link>
        </p>
      </div>
    )
  },
  {
    id: "install-globally",
    title: "Do I need to install AntiSlop globally?",
    content: (
      <div className="space-y-4">
        <p>
          No. While you can install it globally, it is heavily recommended to use <code className="bg-white/10 px-1 py-0.5 rounded text-white text-xs">npx antislop</code> for one-off scans or install it as a development dependency in your project so your whole team shares the same version.
        </p>
      </div>
    )
  },
  {
    id: "where-to-run",
    title: "Where should I run AntiSlop?",
    content: (
      <div className="space-y-4">
        <p>
          You should run AntiSlop from the <strong>root directory</strong> of your project/workspace. The CLI will automatically discover supported files and respect your configuration files relative to where it was executed.
        </p>
      </div>
    )
  },
  {
    id: "supported-languages",
    title: "What languages does AntiSlop support?",
    content: (
      <div className="space-y-4">
        <p>AntiSlop currently focuses entirely on the modern web ecosystem. <strong>Currently supported</strong> file types include:</p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-white/30">
          <li>JavaScript (.js, .mjs, .cjs)</li>
          <li>TypeScript (.ts)</li>
          <li>JSX / TSX (.jsx, .tsx)</li>
          <li>React components</li>
        </ul>
        <p className="text-sm text-white/50 mt-2">Planned support: Vue, CSS, Tailwind CSS analysis, Python.</p>
      </div>
    )
  },
  {
    id: "react-support",
    title: "Does AntiSlop work with React?",
    content: (
      <div className="space-y-4">
        <p>
          Yes. AntiSlop has deep, native support for React. It can detect React-specific slop like needless <code className="text-xs bg-white/10 px-1 rounded">useMemo</code> wrappers, redundant `useEffect` chains, and hallucinated component props.
        </p>
      </div>
    )
  },
  {
    id: "nextjs-support",
    title: "Can I use AntiSlop with Next.js?",
    content: (
      <div className="space-y-4">
        <p>
          Absolutely. Because AntiSlop fundamentally analyzes JavaScript, TypeScript, and React (TSX), it works flawlessly with Next.js projects right out of the box. 
        </p>
      </div>
    )
  }
];

const SCANNING_FAQS: AccordionItem[] = [
  {
    id: "what-happens-scan",
    title: "What happens when I run an AntiSlop scan?",
    content: (
      <div className="space-y-4">
        <p>The scanning process follows a strict, deterministic pipeline:</p>
        <ol className="list-decimal pl-5 space-y-1.5 marker:text-white/50 text-sm">
          <li><strong>Workspace Discovery:</strong> AntiSlop identifies your project root.</li>
          <li><strong>File Discovery:</strong> It traverses your directories, skipping ignored folders.</li>
          <li><strong>Parsing:</strong> Supported files (JS/TS/TSX) are parsed into Abstract Syntax Trees.</li>
          <li><strong>Engine Evaluation:</strong> The ASTs are passed through the AntiSlop heuristic rule engine.</li>
          <li><strong>Detection:</strong> Slop patterns are flagged and logged.</li>
          <li><strong>Reporting:</strong> Results are presented directly in your CLI or VS Code window.</li>
        </ol>
      </div>
    )
  },
  {
    id: "scan-node-modules",
    title: "Does AntiSlop scan node_modules?",
    content: (
      <div className="space-y-4">
        <p>
          No. By default, AntiSlop completely ignores <code className="text-xs bg-white/10 px-1 rounded">node_modules/</code>, <code className="text-xs bg-white/10 px-1 rounded">.git/</code>, and standard build directories (like <code className="text-xs bg-white/10 px-1 rounded">dist/</code> or <code className="text-xs bg-white/10 px-1 rounded">.next/</code>) to keep scans lightning fast.
        </p>
      </div>
    )
  },
  {
    id: "kinds-of-problems",
    title: "What kinds of problems can AntiSlop detect?",
    content: (
      <div className="space-y-4">
        <p>AntiSlop groups detected issues into major categories:</p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-white/30">
          <li><strong>Logic Slop:</strong> Dead code, recursive loops, redundant abstractions.</li>
          <li><strong>Artifact Slop:</strong> Leftover AI comments, hallucinated imports, mock data in production files.</li>
          <li><strong>React Slop:</strong> Over-optimization (trivial memos), prop drilling, hydration risk patterns.</li>
          <li><strong>Security Slop:</strong> Hardcoded keys, blind try/catch swallows.</li>
        </ul>
      </div>
    )
  },
  {
    id: "modify-files",
    title: "Does AntiSlop modify files during a normal scan?",
    content: (
      <div className="space-y-4">
        <p>
          No. Ordinary scanning is strictly <strong>read-only</strong>. It analyzes your code and reports issues. Files are only modified if you explicitly invoke the Auto-Fix system.
        </p>
      </div>
    )
  },
  {
    id: "scan-monorepos",
    title: "Does AntiSlop support monorepos?",
    content: (
      <div className="space-y-4">
        <p>
          Yes. AntiSlop can scan from the root of a monorepo, analyzing all workspaces. However, it is currently recommended to run AntiSlop separately inside individual package directories for more targeted reporting.
        </p>
      </div>
    )
  }
];

const AST_FAQS: AccordionItem[] = [
  {
    id: "what-is-ast",
    title: "What is an AST?",
    content: (
      <div className="space-y-4">
        <p>
          <strong>AST</strong> stands for <strong>Abstract Syntax Tree</strong>. It is a tree representation of the abstract syntactic structure of source code.
        </p>
        <p>Instead of looking at code as a long string of text like this:</p>
        <div className="p-3 bg-[#111] rounded-lg border border-white/10 font-mono text-xs text-white/80">
          const total = price + tax;
        </div>
        <p>An AST breaks it down structurally:</p>
        <div className="p-3 bg-[#111] rounded-lg border border-white/10 font-mono text-xs text-white/80">
          Variable Declaration<br/>
          &nbsp;&nbsp;→ identifier: total<br/>
          &nbsp;&nbsp;→ Binary Expression (+)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ left: price<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ right: tax
        </div>
      </div>
    )
  },
  {
    id: "why-use-ast",
    title: "Why does AntiSlop use AST analysis?",
    content: (
      <div className="space-y-4">
        <p>
          AST analysis allows AntiSlop to reliably understand <strong>actual programming constructs</strong> rather than just text.
        </p>
        <p>
          For example, a plain text regex search for <code>console.log</code> might accidentally flag a comment like <code>// Remove console.log</code> or a string variable. An AST-based rule knows the difference between a comment, a string literal, and an actual function call expression, resulting in drastically fewer false positives.
        </p>
      </div>
    )
  },
  {
    id: "just-regex",
    title: "Does AntiSlop just use regex?",
    content: (
      <div className="space-y-4">
        <p>
          No. While some extremely lightweight checks (like searching for artifact markers like <code>&quot;As an AI language model...&quot;</code>) may use pattern matching, the core engine structurally parses JavaScript and TypeScript using ASTs. 
        </p>
      </div>
    )
  },
  {
    id: "why-not-llm",
    title: "Why not use an LLM to detect everything?",
    content: (
      <div className="space-y-4">
        <p>
          Deterministic static analysis is vastly superior for detection because it is:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-white/30 text-sm">
          <li><strong>Faster:</strong> Scans thousands of files in milliseconds.</li>
          <li><strong>Local & Private:</strong> Zero data leaves your machine.</li>
          <li><strong>Less Expensive:</strong> Costs nothing in API credits.</li>
          <li><strong>Predictable:</strong> Returns the exact same result every time.</li>
        </ul>
        <p>
          LLMs are incredibly powerful, but they are better treated as an optional remediation layer rather than the primary detection engine.
        </p>
      </div>
    )
  }
];

const RULES_FAQS: AccordionItem[] = [
  {
    id: "what-is-rule",
    title: "What is an AntiSlop rule?",
    content: (
      <div className="space-y-4">
        <p>
          An AntiSlop rule is a specific programmed heuristic that identifies a single, undesirable code pattern (e.g., &quot;redundant-use-memo&quot; or &quot;hallucinated-package-import&quot;).
        </p>
      </div>
    )
  },
  {
    id: "issue-info",
    title: "What information does a detected issue contain?",
    content: (
      <div className="space-y-4">
        <p>When a rule triggers, it generates an issue containing:</p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-white/30 text-sm">
          <li><strong>Rule ID:</strong> (e.g., <code>react/no-trivial-memo</code>)</li>
          <li><strong>Severity:</strong> (Warning, Error, Notice)</li>
          <li><strong>File & Line:</strong> The exact location in your code</li>
          <li><strong>Description:</strong> Why the code was flagged</li>
          <li><strong>Suggested Action:</strong> How to resolve it</li>
        </ul>
      </div>
    )
  },
  {
    id: "disable-rule",
    title: "Can I disable a rule?",
    content: (
      <div className="space-y-4">
        <p>
          Yes. You can disable specific rules via inline comments in your code (e.g., <code>// antislop-disable-next-line</code>) if you need a quick override. Support for disabling rules globally via configuration is currently planned.
        </p>
      </div>
    )
  }
];

const ACCURACY_FAQS: AccordionItem[] = [
  {
    id: "false-positives",
    title: "Can AntiSlop produce false positives?",
    content: (
      <div className="space-y-4">
        <p>
          Yes. No static-analysis system is completely infallible. While AntiSlop heavily prioritizes high-confidence detections, there will inevitably be edge cases where unconventional (but intentional) architecture is flagged as &quot;slop&quot;.
        </p>
      </div>
    )
  },
  {
    id: "intentional-code",
    title: "What should I do if AntiSlop reports something intentional?",
    content: (
      <div className="space-y-4">
        <p>
          Simply use an inline disable comment above the flagged line, or review the finding and choose to safely ignore it. You are always in control of your codebase.
        </p>
      </div>
    )
  },
  {
    id: "fix-everything",
    title: "Does every AntiSlop warning need to be fixed?",
    content: (
      <div className="space-y-4">
        <p>
          No. Like any linter, warnings are suggestions. Developers should read the description, understand the flagged issue, and use their engineering judgment to decide if a fix is actually warranted for their specific context.
        </p>
      </div>
    )
  },
  {
    id: "how-reduce-fps",
    title: "How does AntiSlop reduce false positives?",
    content: (
      <div className="space-y-4">
        <p>We keep false positives low through several strict engineering practices:</p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-white/30 text-sm">
          <li><strong>AST-aware analysis:</strong> We don't rely on naive pattern matching.</li>
          <li><strong>Narrowly scoped rules:</strong> Rules are designed to only catch extreme violations, defaulting to leniency.</li>
          <li><strong>Contextual checks:</strong> We verify variable scopes and imports before flagging unused logic.</li>
        </ul>
      </div>
    )
  }
];

const REPORTS_FAQS: AccordionItem[] = [
  {
    id: "what-is-report",
    title: "What is antislop-report.md?",
    content: (
      <div className="space-y-4">
        <p>
          When you run a scan, AntiSlop can optionally generate a structured report file (often named <code>antislop-report.md</code> or similar) containing all detected issues.
        </p>
      </div>
    )
  },
  {
    id: "machine-readable",
    title: "Is the report machine readable?",
    content: (
      <div className="space-y-4">
        <p>
          Yes. The report is deliberately structured to be highly readable for both humans and AI agents. It formats issues clearly with file paths, line ranges, and descriptions so you can pass it directly into tools like Cursor Composer or a GitHub Action workflow.
        </p>
      </div>
    )
  },
  {
    id: "give-to-agent",
    title: "Can I give the report to an AI coding agent?",
    content: (
      <div className="space-y-4">
        <p>
          Yes! This is the intended workflow. You can generate a report, open it in Cursor, and prompt the AI with: <em>&quot;Review these findings and fix the issues mentioned in the report.&quot;</em> The agent can read the structured markdown and resolve the slop automatically.
        </p>
      </div>
    )
  }
];

const VSCODE_FAQS: AccordionItem[] = [
  {
    id: "has-extension",
    title: "Does AntiSlop have a VS Code extension?",
    content: (
      <div className="space-y-4">
        <p>
          Currently, the VS Code Extension is <strong>in active development</strong> and is planned for release soon. Currently, the CLI is the primary way to interface with the detection engine.
        </p>
      </div>
    )
  }
];

const AUTOFIX_FAQS: AccordionItem[] = [
  {
    id: "what-is-autofix",
    title: "What is Auto-Fix?",
    content: (
      <div className="space-y-4">
        <p>
          <strong>Auto-Fix</strong> is an <em>optional remediation layer</em> for detected issues. When enabled, AntiSlop attempts to automatically rewrite the problematic code to resolve the flagged slop.
        </p>
      </div>
    )
  },
  {
    id: "same-as-detection",
    title: "Is Auto-Fix the same as detection?",
    content: (
      <div className="space-y-4">
        <p>No. They are distinct phases.</p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-white/30 text-sm">
          <li><strong>Detection:</strong> Local, deterministic static analysis (AST).</li>
          <li><strong>Auto-Fix:</strong> Optional remediation, which may invoke an external LLM for complex refactors.</li>
        </ul>
      </div>
    )
  },
  {
    id: "overwrite-code",
    title: "Does Auto-Fix automatically overwrite my code?",
    content: (
      <div className="space-y-4">
        <p>
          AntiSlop operates under a strict safety model. Destructive changes are designed to be explicitly reviewable. The Auto-Fix pipeline integrates with Git to ensure that you can easily view a diff of the proposed changes before accepting them.
        </p>
      </div>
    )
  },
  {
    id: "reject-changes",
    title: "Can I review and reject Auto-Fix changes?",
    content: (
      <div className="space-y-4">
        <p>
          Yes. Because changes are applied to your working directory or a dedicated branch, you can simply use standard Git commands (<code>git diff</code>, <code>git restore</code>) to review the exact lines changed, and reject or modify anything the Auto-Fix engine did.
        </p>
      </div>
    )
  }
];

const LLM_FAQS: AccordionItem[] = [
  {
    id: "uses-llm",
    title: "Does AntiSlop use an LLM?",
    content: (
      <div className="space-y-4">
        <p>
          For a <strong>normal scan</strong>, no. It uses deterministic static analysis.
        </p>
        <p>
          For <strong>Auto-Fix</strong>, it may optionally use an LLM to perform complex code remediation that cannot be handled by simple AST transformations.
        </p>
      </div>
    )
  },
  {
    id: "why-separate",
    title: "Why separate detection from AI remediation?",
    content: (
      <div className="space-y-4">
        <p>Keeping detection strictly separate from LLM remediation provides massive benefits:</p>
        <ul className="list-disc pl-5 space-y-1.5 marker:text-white/30 text-sm">
          <li><strong>Deterministic Results:</strong> No hallucinated errors.</li>
          <li><strong>Privacy:</strong> Code doesn't leave your machine just to be scanned.</li>
          <li><strong>Speed & Cost:</strong> Scanning is instant and free.</li>
          <li><strong>Reliability:</strong> Rules are easy to test and verify.</li>
        </ul>
      </div>
    )
  }
];

const PRIVACY_FAQS: AccordionItem[] = [
  {
    id: "upload-code",
    title: "Does AntiSlop upload my source code?",
    content: (
      <div className="space-y-4">
        <p>
          <strong>No.</strong> Normal static analysis runs entirely locally on your machine. Your source code is never sent to AntiSlop.dev servers for ordinary scanning.
        </p>
      </div>
    )
  },
  {
    id: "when-code-leaves",
    title: "When can my code leave my computer?",
    content: (
      <div className="space-y-4">
        <p>
          Your code (specifically, only the affected context snippets) leaves your machine <strong>only if you explicitly invoke the optional Auto-Fix functionality</strong> with a remote LLM provider.
        </p>
      </div>
    )
  },
  {
    id: "completely-locally",
    title: "Can I use AntiSlop completely locally?",
    content: (
      <div className="space-y-4">
        <p>
          Yes! By using the CLI for scanning and detection, your workflow remains 100% local, air-gapped, and secure.
        </p>
      </div>
    )
  }
];

const GIT_FAQS: AccordionItem[] = [
  {
    id: "why-git",
    title: "Why does Auto-Fix use Git?",
    content: (
      <div className="space-y-4">
        <p>
          Git provides the ultimate reviewable and reversible safety boundary. Instead of silently overwriting files and losing history, applying fixes over a Git repository ensures you always have a perfect fallback.
        </p>
      </div>
    )
  },
  {
    id: "commit-first",
    title: "Should I commit my work before running Auto-Fix?",
    content: (
      <div className="space-y-4">
        <p>
          <strong>Yes.</strong> It is always highly recommended to commit your working tree (or stash changes) before running any automated refactoring tool. This ensures you can easily review the exact diff that AntiSlop generated.
        </p>
      </div>
    )
  }
];

const PERFORMANCE_FAQS: AccordionItem[] = [
  {
    id: "fast-enough",
    title: "Is AntiSlop fast enough for large projects?",
    content: (
      <div className="space-y-4">
        <p>
          Yes. The architecture relies on highly efficient AST traversal, avoiding the overhead of booting up expensive language servers or repeated parsing. It is designed to be orders of magnitude faster than a traditional typescript compiler pass.
        </p>
      </div>
    )
  },
  {
    id: "performance-target",
    title: "What is AntiSlop's performance target?",
    content: (
      <div className="space-y-4">
        <p>
          Our internal design target is to be able to scan and analyze <strong>1,000 files in under 5 seconds</strong>. 
        </p>
        <p className="text-sm text-white/50 italic">Note: This is an architectural target, not a guaranteed measured benchmark on all hardware.</p>
      </div>
    )
  }
];

const CONFIG_FAQS: AccordionItem[] = [
  {
    id: "ignore-files",
    title: "Can I ignore certain files or directories?",
    content: (
      <div className="space-y-4">
        <p>
          Yes. Currently, AntiSlop automatically ignores common heavy directories like <code>node_modules/</code> and build folders. 
        </p>
      </div>
    )
  }
];

const TROUBLESHOOTING_FAQS: AccordionItem[] = [
  {
    id: "cli-not-working",
    title: "npx antislop isn't working. What should I check?",
    content: (
      <div className="space-y-4">
        <p>Ensure you have Node.js installed (v18+ recommended). Try running <code>npx clear-npx-cache</code> if the command fails to download the latest binary properly.</p>
      </div>
    )
  },
  {
    id: "not-detecting",
    title: "AntiSlop isn't detecting any files. Why?",
    content: (
      <div className="space-y-4">
        <p>Ensure you are running the command from the root of your workspace, and that your project actually contains supported files (.js, .ts, .jsx, .tsx).</p>
      </div>
    )
  }
];

export default function FaqPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0a] selection:bg-terminal-green/20 selection:text-terminal-green">
      {/* Subtle Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', 
        backgroundSize: '24px 24px' 
      }}></div>
      
      <div className="z-10 relative flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 relative pt-32 pb-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24">
            
            {/* Sidebar Navigation */}
            <div className="hidden md:block w-56 shrink-0">
               <FaqNavLinks />
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl">
              
              <div className="flex items-center gap-4 mb-6">
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/60 border border-white/10 uppercase tracking-widest">Support</div>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-6 tracking-tight flex items-end">
                Frequently Asked Questions<span className="w-[0.5em] h-[0.8em] bg-white ml-3 animate-pulse inline-block opacity-80 mb-1"></span>
              </h1>
              <p className="text-base md:text-lg text-[#A3A3A3] font-mono leading-relaxed mb-16">
                Everything you need to know about eliminating AI slop, local-first AST analysis, and supercharging code review velocity.
              </p>

              <div className="space-y-24">
                
                <section id="general" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <Terminal className="w-6 h-6 text-terminal-green" />
                    General
                  </h2>
                  <BasicAccordion items={GENERAL_FAQS} defaultExpandedIds={["what-is-antislop"]} allowMultiple />
                </section>

                <section id="installation" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <Download className="w-6 h-6 text-terminal-green" />
                    Installation & Getting Started
                  </h2>
                  <BasicAccordion items={INSTALLATION_FAQS} allowMultiple />
                </section>

                <section id="scanning" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <FileSearch className="w-6 h-6 text-terminal-green" />
                    Scanning & Detection
                  </h2>
                  <BasicAccordion items={SCANNING_FAQS} allowMultiple />
                </section>

                <section id="ast" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-terminal-green" />
                    AST & Detection Engine
                  </h2>
                  <BasicAccordion items={AST_FAQS} allowMultiple />
                </section>

                <section id="rules" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-terminal-green" />
                    Detection Rules
                  </h2>
                  <BasicAccordion items={RULES_FAQS} allowMultiple />
                </section>

                <section id="accuracy" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-terminal-green" />
                    False Positives & Accuracy
                  </h2>
                  <BasicAccordion items={ACCURACY_FAQS} allowMultiple />
                </section>

                <section id="reports" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-terminal-green" />
                    Reports
                  </h2>
                  <BasicAccordion items={REPORTS_FAQS} allowMultiple />
                </section>

                <section id="vscode" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <Box className="w-6 h-6 text-terminal-green" />
                    VS Code Extension
                  </h2>
                  <BasicAccordion items={VSCODE_FAQS} allowMultiple />
                </section>

                <section id="autofix" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <Wrench className="w-6 h-6 text-terminal-green" />
                    Auto-Fix
                  </h2>
                  <BasicAccordion items={AUTOFIX_FAQS} allowMultiple />
                </section>

                <section id="llm" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-terminal-green" />
                    AI / LLM Providers
                  </h2>
                  <BasicAccordion items={LLM_FAQS} allowMultiple />
                </section>

                <section id="privacy" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-terminal-green" />
                    Privacy & Security
                  </h2>
                  <BasicAccordion items={PRIVACY_FAQS} allowMultiple />
                </section>

                <section id="git" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <GitBranch className="w-6 h-6 text-terminal-green" />
                    Git & Code Safety
                  </h2>
                  <BasicAccordion items={GIT_FAQS} allowMultiple />
                </section>

                <section id="performance" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-terminal-green" />
                    Performance
                  </h2>
                  <BasicAccordion items={PERFORMANCE_FAQS} allowMultiple />
                </section>

                <section id="configuration" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <Settings className="w-6 h-6 text-terminal-green" />
                    Configuration
                  </h2>
                  <BasicAccordion items={CONFIG_FAQS} allowMultiple />
                </section>

                <section id="troubleshooting" className="scroll-mt-32">
                  <h2 className="text-2xl font-mono font-bold text-white mb-8 flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-terminal-green" />
                    Troubleshooting
                  </h2>
                  <BasicAccordion items={TROUBLESHOOTING_FAQS} allowMultiple />
                </section>

              </div>
              
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
