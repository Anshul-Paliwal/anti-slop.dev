"use client";
import { Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "bash", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#111111] rounded-lg border border-white/10 overflow-hidden shadow-2xl group my-6 w-full max-w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-black/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-black/20"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-black/20"></div>
          </div>
          {filename && <span className="text-[11px] font-mono text-white/50">{filename}</span>}
        </div>
        <div className="text-[10px] text-white/40 font-mono flex items-center gap-2 select-none uppercase tracking-widest">
          {language === "bash" ? <Terminal size={12} /> : null} {language}
        </div>
      </div>
      <div className="p-5 font-mono flex justify-between items-start text-sm overflow-x-auto relative">
        <pre className="text-white/80 leading-relaxed pr-8 whitespace-pre-wrap break-all md:break-normal md:whitespace-pre">
          <code>{code}</code>
        </pre>
        <button 
          onClick={handleCopy}
          className="absolute right-4 top-4 text-white/20 hover:text-white/80 transition-colors opacity-0 group-hover:opacity-100 bg-[#111] p-1.5 rounded border border-white/10" 
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} className="text-terminal-green" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  );
}
