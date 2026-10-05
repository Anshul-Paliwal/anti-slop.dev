import { PlannedFeature } from "@/components/PlannedFeature";
import Link from "next/link";

export const metadata = {
  title: "Troubleshooting | AntiSlop.dev",
  description: "Troubleshoot common AntiSlop issues.",
};

export default function TroubleshootingPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">Troubleshooting</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          Find solutions to common AntiSlop errors and setup issues.
        </p>
      </div>

      <PlannedFeature 
        title="Knowledge Base" 
        description="Troubleshooting guides will be published here as the CLI and VS Code extensions are rolled out to beta testers." 
      />

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/security" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> Privacy & Security
        </Link>
        <Link href="/docs/faq" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          FAQ <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
