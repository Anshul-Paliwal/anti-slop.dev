import { PlannedFeature } from "@/components/PlannedFeature";
import Link from "next/link";

export const metadata = {
  title: "Configuration | AntiSlop.dev",
  description: "Configure AntiSlop for your project.",
};

export default function ConfigPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">Configuration</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          Learn how to customize AntiSlop for your specific repository requirements.
        </p>
      </div>

      <PlannedFeature 
        title="Configuration API" 
        description="The antislop.json configuration schema, severity adjustments, and rule toggling are actively being developed." 
      />

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/rules" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> Detection Rules
        </Link>
        <Link href="/docs/auto-fix" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          Auto-Fix <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
