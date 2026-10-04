import { PlannedFeature } from "@/components/PlannedFeature";
import { Callout } from "@/components/Callout";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "Quick Start | AntiSlop.dev",
  description: "Run your first AntiSlop analysis.",
};

export default function QuickStartPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">Quick Start</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          Walk through your first AntiSlop scan. This guide assumes you have the CLI fully installed.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-mono font-bold text-white mb-4">1. Open your project</h2>
          <CodeBlock code="cd my-project" />
        </section>

        <section>
          <h2 className="text-xl font-mono font-bold text-white mb-4">2. Run AntiSlop</h2>
          <CodeBlock code="npx anti-slop hello" />
          <Callout type="note" title="Early Development">
            Currently, the only available command is <code className="bg-white/10 px-1 py-0.5 rounded text-white text-xs">hello</code> while the analysis engine is being developed.
          </Callout>
        </section>

        <section>
          <PlannedFeature 
            title="3. Wait for the workspace scan" 
            description="AntiSlop will discover supported source files and execute its static-analysis rules." 
          />
        </section>
        
        <section>
          <PlannedFeature 
            title="4. Review detected issues" 
            description="Issues contain the rule, category, severity, file, line, description, and suggested action." 
          />
        </section>

        <section>
          <PlannedFeature 
            title="5. Review the generated report" 
            description="A structured antislop-report.md file will be generated for human and agent review." 
          />
        </section>
      </div>

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/installation" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> Installation
        </Link>
        <Link href="/docs/cli" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          CLI Reference <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
