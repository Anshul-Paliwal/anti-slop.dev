import { PlannedFeature } from "@/components/PlannedFeature";
import { Callout } from "@/components/Callout";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = {
  title: "VS Code Extension | AntiSlop.dev",
  description: "Official VS Code extension for AntiSlop.dev.",
};

export default function VSCodePage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">VS Code Extension</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          The AntiSlop VS Code extension brings AI slop detection directly into your editor, providing inline diagnostics and quick fixes.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-mono font-bold text-white">Current Status</h2>
        <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed">
          The extension is currently a skeleton containing basic activation logic. It registers the following initial command:
        </p>
        
        <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-left font-mono text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-white/50 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-normal">Command ID</th>
                <th className="px-6 py-3 font-normal">Title</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white/80">
              <tr>
                <td className="px-6 py-4 font-bold text-white">anti-slop.helloWorld</td>
                <td className="px-6 py-4 text-[#A3A3A3]">Hello World</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Callout type="note" title="Installation">
        The extension has not yet been published to the VS Code Marketplace. It can currently be compiled and run locally from the <code className="bg-white/10 px-1 py-0.5 rounded text-white text-xs">vscode-extension</code> directory in the repository.
      </Callout>

      <div className="space-y-6">
        <h2 className="text-xl font-mono font-bold text-white">Building Locally</h2>
        <CodeBlock 
          code={`cd vscode-extension\nnpm install\nnpm run compile`} 
        />
        <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed mt-2">
          Press F5 in VS Code to launch the Extension Development Host.
        </p>
      </div>

      <PlannedFeature 
        title="Inline Diagnostics & Quick Fixes" 
        description="Future versions will parse the active document against AntiSlop AST rules, surfacing issues as standard VS Code diagnostics (squiggles) with automated code action providers." 
      />

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/cli" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> CLI Reference
        </Link>
        <Link href="/docs/reports" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          Reports <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
