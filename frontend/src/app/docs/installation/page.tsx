import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "@/components/Callout";
import Link from "next/link";

export const metadata = {
  title: "Installation | AntiSlop.dev",
  description: "Learn how to install AntiSlop.dev on your machine.",
};

export default function InstallationPage() {
  return (
    <div className="flex flex-col gap-10 pb-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6 tracking-tight">Installation</h1>
        <p className="text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
          AntiSlop can be installed globally as a standalone CLI tool. It is distributed via npm.
        </p>
      </div>

      <Callout type="note" title="Prerequisites">
        Ensure you have Node.js and npm installed. AntiSlop requires Node.js environment to run.
      </Callout>

      <div className="space-y-6">
        <h2 className="text-xl font-mono font-bold text-white">Global Installation</h2>
        <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed">
          The recommended way to install the AntiSlop CLI is globally. This allows you to run <code className="bg-white/10 px-1 py-0.5 rounded text-white text-xs">anti-slop</code> in any directory.
        </p>
        <CodeBlock code="npm install -g @anti-slop/npm-package" />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-mono font-bold text-white">Running the CLI</h2>
        <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed">
          Once installed, you can verify the installation by running the CLI tool:
        </p>
        <CodeBlock code="anti-slop --version" />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-mono font-bold text-white">Project-Level Installation</h2>
        <p className="text-sm text-[#A3A3A3] font-mono leading-relaxed">
          You can also add it as a development dependency if you want to tie it to your project lifecycle (like a Git pre-commit hook).
        </p>
        <CodeBlock code="npm install --save-dev @anti-slop/npm-package" />
      </div>

      <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
        <Link href="/docs" className="text-white/50 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors">
          <span>&larr;</span> Introduction
        </Link>
        <Link href="/docs/quick-start" className="text-white hover:text-terminal-green font-mono text-sm flex items-center gap-2 transition-colors">
          Quick Start <span>&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
