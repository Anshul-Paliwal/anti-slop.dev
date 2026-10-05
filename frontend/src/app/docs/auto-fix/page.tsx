import { PlannedFeature } from "@/components/PlannedFeature";
import Link from "next/link";
import { Callout } from "@/components/Callout";

export const metadata = {
  title: "Auto-Fix | AntiSlop.dev",
  description: "Optional LLM-assisted remediation.",
};

export default function AutoFixPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">Auto-Fix</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          Static analysis detects issues locally. Auto-Fix is an optional remediation layer that utilizes LLMs to suggest fixes.
        </p>
      </div>
      
      <Callout type="important" title="Git Safety">
        Auto-fix will never silently modify your primary branch without generating a diff and requesting developer approval.
      </Callout>

      <PlannedFeature 
        title="Auto-Fix Provider Abstraction" 
        description="The external provider integrations (OpenAI, Anthropic, Ollama) and Git-safety stash implementations are planned for future releases." 
      />

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/configuration" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> Configuration
        </Link>
        <Link href="/docs/security" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          Privacy & Security <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
