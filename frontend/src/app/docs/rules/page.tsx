import { PlannedFeature } from "@/components/PlannedFeature";
import Link from "next/link";

export const metadata = {
  title: "Detection Rules | AntiSlop.dev",
  description: "Understand the AST detection rules.",
};

export default function RulesPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">Detection Rules</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          AntiSlop uses deterministic static analysis (AST parsing) to detect structural issues and logic bloat left by LLMs.
        </p>
      </div>

      <PlannedFeature 
        title="Rule Engine" 
        description="The AST rule traverser and built-in rules (CSS Slop, Logic Slop, Artifact Slop) are currently in active development." 
      />

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/vscode" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> VS Code Extension
        </Link>
        <Link href="/docs/configuration" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          Configuration <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
