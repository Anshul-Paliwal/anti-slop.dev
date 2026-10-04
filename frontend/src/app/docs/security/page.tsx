import { Callout } from "@/components/Callout";
import Link from "next/link";
import { ShieldAlert, Key, HardDrive } from "lucide-react";

export const metadata = {
  title: "Privacy & Security | AntiSlop.dev",
  description: "Learn how AntiSlop.dev protects your codebase.",
};

export default function SecurityPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">Privacy & Security</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          AntiSlop performs normal static analysis locally. Source code does not need to be uploaded to AntiSlop.dev to run a standard scan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#111] border border-white/10 p-6 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-terminal-green/10 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-terminal-green" />
            </div>
            <h3 className="text-lg font-mono font-bold text-white">Local Analysis</h3>
          </div>
          <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed">
            The core AST parser and rule engine run entirely on your local machine. No proprietary source code is sent to AntiSlop.dev servers during a standard analysis pass.
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 p-6 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-mono font-bold text-white">External LLMs (Auto-Fix)</h3>
          </div>
          <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed">
            When using the planned Auto-Fix feature, relevant snippets of code will only leave your machine if you explicitly configure an external LLM provider (like OpenAI or Anthropic). You can avoid external transmission entirely by configuring a local Ollama instance.
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 p-6 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-mono font-bold text-white">API Keys</h3>
          </div>
          <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed">
            Provider API keys must be kept locally in your environment. The CLI will never log, expose, or transmit your LLM provider secrets to AntiSlop.dev servers.
          </p>
        </div>
      </div>

      <Callout type="important" title="Repository Storage">
        Your repository source code is not persisted on AntiSlop.dev servers as part of the static analysis process.
      </Callout>

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs/auto-fix" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> Auto-Fix
        </Link>
        <Link href="/docs/troubleshooting" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          Troubleshooting <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
