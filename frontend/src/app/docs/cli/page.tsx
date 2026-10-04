import { CodeBlock } from "@/components/CodeBlock";
import { PlannedFeature } from "@/components/PlannedFeature";
import { Callout } from "@/components/Callout";
import Link from "next/link";

export const metadata = {
  title: "CLI Reference | AntiSlop.dev",
  description: "Reference for the AntiSlop Command Line Interface.",
};

export default function CliPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">CLI Reference</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          The AntiSlop CLI is your primary interface for running scans on your codebase, generating reports, and triggering auto-fix routines.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-mono font-bold text-white">Available Commands</h2>
        <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed">
          The CLI is currently in early development. Available commands are listed below.
        </p>
        
        <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-normal">Command</th>
                <th className="px-6 py-3 font-normal">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white/80">
              <tr>
                <td className="px-6 py-4 font-bold text-white">hello</td>
                <td className="px-6 py-4 text-[#A3A3A3]">Prints a hello message to verify installation.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-mono font-bold text-white">Examples</h2>
        <CodeBlock code="anti-slop hello" />
      </div>

      <Callout type="note" title="CLI Options">
        Detailed CLI flags (like <code className="bg-white/10 px-1 py-0.5 rounded text-white text-xs">--format</code>, <code className="bg-white/10 px-1 py-0.5 rounded text-white text-xs">--fix</code>, etc.) will be documented here as the static analysis engine is completed.
      </Callout>

      <PlannedFeature 
        title="AST Scanning & Reporting" 
        description="Commands for triggering static analysis scans and generating structured antislop-report.md files are actively being developed." 
      />

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/quick-start" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> Quick Start
        </Link>
        <Link href="/docs/vscode" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          VS Code Extension <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
