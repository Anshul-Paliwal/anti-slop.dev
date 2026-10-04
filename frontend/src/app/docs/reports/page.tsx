import { PlannedFeature } from "@/components/PlannedFeature";
import Link from "next/link";

export const metadata = {
  title: "Reports | AntiSlop.dev",
  description: "Learn about antislop-report.md files.",
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">Reports</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          AntiSlop scans generate structured markdown reports suitable for both human review and LLM ingestion.
        </p>
      </div>

      <PlannedFeature 
        title="Report Generator" 
        description="The structured report format and automated issue serialization engine are currently in development." 
      />

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/vscode" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> VS Code Extension
        </Link>
        <Link href="/docs/rules" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          Detection Rules <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
