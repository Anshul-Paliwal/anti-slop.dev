import Link from "next/link";
import { Terminal, Copy } from "lucide-react";

export const metadata = {
  title: "Documentation | AntiSlop.dev",
  description: "Official documentation for Anti-Slop AST purification.",
};

export default function DocsLandingPage() {
  return (
    <div className="flex flex-col gap-16 pb-12">
      <div className="flex items-center gap-4">
        <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/60 border border-white/10 uppercase tracking-widest">v1.0.0</div>
        <div className="h-px bg-white/10 flex-1"></div>
      </div>

      <div>
        <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-6 tracking-tight flex items-end">
          AntiSlop.dev Documentation<span className="w-[0.5em] h-[0.8em] bg-white ml-3 animate-pulse inline-block opacity-80 mb-1"></span>
        </h1>
        <p className="text-base md:text-lg text-[#A3A3A3] font-mono leading-relaxed mb-8">
          Build cleaner AI-assisted codebases. AntiSlop.dev detects problematic patterns commonly introduced during AI-assisted development and provides actionable information for fixing them.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/docs/installation" className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs rounded hover:bg-white/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Get Started -&gt;
          </Link>
          <a href="https://github.com/antislop/antislop" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-[#111] border border-white/10 text-white font-mono text-xs rounded hover:bg-white/5 transition-colors">
            View on GitHub
          </a>
        </div>
      </div>

      <div className="bg-[#111111] rounded-lg border border-white/10 overflow-hidden shadow-2xl group max-w-2xl">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-black/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-black/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-black/20"></div>
          </div>
          <div className="text-[10px] text-white/40 font-mono flex items-center gap-2 select-none uppercase tracking-widest">
            <Terminal size={12} /> bash
          </div>
          <div className="w-12"></div>
        </div>
        <div className="p-5 font-mono text-white/90 flex justify-between items-start text-sm">
          <div>
            <span className="text-white/40 mr-3 select-none">$</span>npx anti-slop hello
          </div>
          <button className="text-white/20 hover:text-white/80 transition-colors opacity-0 group-hover:opacity-100" title="Copy to clipboard">
            <Copy size={14} />
          </button>
        </div>
      </div>

      {/* Section Separator */}
      <div className="w-full flex items-center gap-4">
        <div className="w-1.5 h-1.5 bg-white/20 rounded-sm rotate-45"></div>
        <div className="flex-1 h-px border-t border-dashed border-white/20"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/docs/installation" className="group bg-[#111] border border-white/10 p-6 rounded-lg hover:border-white/30 transition-all">
          <h3 className="text-white font-mono font-bold mb-2 group-hover:text-terminal-green transition-colors">GET STARTED</h3>
          <p className="text-[#A3A3A3] text-sm font-mono leading-relaxed">Learn how to install AntiSlop.dev and scan your first project.</p>
        </Link>
        <Link href="/docs/cli" className="group bg-[#111] border border-white/10 p-6 rounded-lg hover:border-white/30 transition-all">
          <h3 className="text-white font-mono font-bold mb-2 group-hover:text-terminal-green transition-colors">CLI</h3>
          <p className="text-[#A3A3A3] text-sm font-mono leading-relaxed">Run AntiSlop directly from your terminal or CI environment.</p>
        </Link>
        <Link href="/docs/vscode" className="group bg-[#111] border border-white/10 p-6 rounded-lg hover:border-white/30 transition-all">
          <h3 className="text-white font-mono font-bold mb-2 group-hover:text-terminal-green transition-colors">VS CODE</h3>
          <p className="text-[#A3A3A3] text-sm font-mono leading-relaxed">Detect AI slop directly inside your editor.</p>
        </Link>
        <Link href="/docs/rules" className="group bg-[#111] border border-white/10 p-6 rounded-lg hover:border-white/30 transition-all">
          <h3 className="text-white font-mono font-bold mb-2 group-hover:text-terminal-green transition-colors flex items-center gap-2">DETECTION RULES <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] uppercase">Planned</span></h3>
          <p className="text-[#A3A3A3] text-sm font-mono leading-relaxed">Understand what AntiSlop looks for and why an issue was reported.</p>
        </Link>
        <Link href="/docs/reports" className="group bg-[#111] border border-white/10 p-6 rounded-lg hover:border-white/30 transition-all">
          <h3 className="text-white font-mono font-bold mb-2 group-hover:text-terminal-green transition-colors flex items-center gap-2">REPORTS <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] uppercase">Planned</span></h3>
          <p className="text-[#A3A3A3] text-sm font-mono leading-relaxed">Learn how to work with antislop-report.md.</p>
        </Link>
        <Link href="/docs/auto-fix" className="group bg-[#111] border border-white/10 p-6 rounded-lg hover:border-white/30 transition-all">
          <h3 className="text-white font-mono font-bold mb-2 group-hover:text-terminal-green transition-colors flex items-center gap-2">AUTO-FIX <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] uppercase">Planned</span></h3>
          <p className="text-[#A3A3A3] text-sm font-mono leading-relaxed">Understand the optional remediation workflow and its Git safety mechanisms.</p>
        </Link>
      </div>
    </div>
  );
}
