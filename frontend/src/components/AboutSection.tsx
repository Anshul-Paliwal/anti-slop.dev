"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Workflow, Zap, Code2, Play } from "lucide-react";
import { useState, useEffect } from "react";

const cards = [
  {
    id: 1,
    title: "Catches real problems",
    description: "Tailwind conflicts, logic bloat, debug leftovers, security holes, React anti-patterns.",
    icon: Shield,
    className: "col-span-1 md:col-span-2 row-span-1", // Wide
  },
  {
    id: 2,
    title: "Works with the agent you already use",
    description: "Copilot, Cursor, Cline.",
    icon: Code2,
    className: "col-span-1 md:col-span-1 row-span-1", // Medium
  },
  {
    id: 3,
    title: "Local-first, zero setup",
    description: "Free unlimited scans, generates antislop-report.md.",
    icon: Terminal,
    className: "col-span-1 md:col-span-2 row-span-1", // Wide
  },
  {
    id: 4,
    title: "Pro auto-fixes it",
    description: "$9.99/mo, your own LLM key.",
    icon: Zap,
    className: "col-span-1 md:col-span-1 row-span-1 border-terminal-green/30 bg-terminal-green/5", // Narrow & Highlighted
  }
];

export default function AboutSection() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.floor(Math.random() * 12) + 3;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const safeProgress = Math.min(100, progress);
  const totalBlocks = 20;
  const filledBlocks = Math.floor((safeProgress / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const asciiBarFilled = "█".repeat(filledBlocks);
  const asciiBarEmpty = ".".repeat(emptyBlocks);

  return (
    <section className="pt-12 pb-24 md:pt-16 md:pb-32 px-6 relative overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Row: Breadcrumb & Intro Text */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start w-full gap-8 mb-20 relative z-10">
          
          {/* Left Side: Breadcrumb & Metrics */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center text-muted-foreground font-mono text-sm">
              ../About AntiSlop...
              <motion.span
                animate={{ opacity: [1, 1, 0, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block w-2 h-[1em] bg-muted-foreground ml-1 align-middle"
              />
            </div>
            
            {/* Animated Terminal Scanner */}
            <div className="hidden md:flex flex-col mt-8 w-72 cursor-default select-none">
              <div className="flex items-center justify-between w-full mb-1">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse shadow-[0_0_5px_#39FF88]" />
                  <span>AST_SCANNER_V2</span>
                </div>
                <span className="font-mono text-[10px] text-terminal-green">ACTIVE</span>
              </div>
              
              <div className="font-mono text-sm tracking-widest whitespace-pre my-1">
                <span className="text-white/30">[</span>
                <span className="text-terminal-green drop-shadow-[0_0_5px_rgba(57,255,136,0.4)]">{asciiBarFilled}</span>
                <span className="text-white/20">{asciiBarEmpty}</span>
                <span className="text-white/30">]</span> <span className="text-white/80">{safeProgress.toString().padStart(3, ' ')}%</span>
              </div>
              
              <div className="flex items-center justify-between mt-1 font-mono text-[9px] text-muted-foreground/40">
                <span>[MEM: OPTIMAL]</span>
                <span>[LAG: 0ms]</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-heading font-light text-muted-foreground max-w-2xl md:text-right leading-relaxed">
            AntiSlop is a real-time <strong className="font-semibold text-[#F5F5F4] italic">AST purification</strong> tool. <br />
            More than <strong className="font-semibold text-terminal-green italic">just a linter</strong>.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Pill Cards & Link Button */}
          <div className="relative flex flex-col gap-6 w-full max-w-xl">
            
            {/* Primary Highlighted Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white text-black p-8 rounded-[2rem] w-full shadow-xl relative z-10"
            >
              <h3 className="text-2xl font-medium mb-4">Catches real problems</h3>
              <p className="font-mono text-sm leading-relaxed text-black/80">
                Tailwind conflicts / logic bloat / debug leftovers / React anti-patterns / security holes / hallucinated imports
              </p>
            </motion.div>

            {/* Circular Action Button Group */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute right-0 md:-right-6 top-[100px] z-20 flex items-center gap-1.5"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 bg-[#0A0A0B] flex items-center justify-center shadow-xl">
                 <Terminal className="w-5 h-5 text-white/50" />
              </div>
              <a href="#" className="w-14 h-14 rounded-full bg-[#0A0A0B] border border-white/20 flex items-center justify-center text-white hover:bg-terminal-green hover:border-terminal-green hover:text-[#0A0A0B] transition-all shadow-xl group">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
            </motion.div>

            {/* Secondary Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="border border-white/10 p-8 rounded-[2rem] w-[85%] bg-[#0A0A0B]/50 backdrop-blur-sm"
            >
              <h3 className="text-xl font-medium mb-4 text-white">Integrations</h3>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                Copilot / Cursor / Cline / Aider / GitHub Actions / Pre-commit
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="border border-white/10 p-8 rounded-[2rem] w-[95%] bg-[#0A0A0B]/50 backdrop-blur-sm"
            >
              <h3 className="text-xl font-medium mb-4 text-white">Local-first</h3>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                Zero setup / generates antislop-report.md / 100% offline parsing
              </p>
            </motion.div>
            
            <div className="mt-6">
               <p className="text-xs text-muted-foreground/60 italic max-w-sm">
                 Some of our favorite patterns to detect, analyze, and automatically refactor.
               </p>
            </div>
          </div>

          {/* Right Column: Mockup with Parallax */}
          <div className="relative h-full min-h-[500px] w-full flex items-center justify-center lg:ml-8 mt-12 lg:mt-0 group">
            
            {/* Subtle Green Glow Behind Mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-terminal-green/10 blur-[100px] rounded-full pointer-events-none opacity-50 group-hover:opacity-80 group-hover:bg-terminal-green/20 transition-all duration-700" />

            {/* Decorative Ring (Matching the screenshot's faint circle) */}
            <motion.div
              className="absolute w-[800px] h-[800px] rounded-full border border-white/[0.04] -z-10 pointer-events-none -left-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Parallax Mockup Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full max-w-md bg-[#0A0A0B]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-[0_0_50px_-12px_rgba(0,255,0,0.1)] hover:shadow-[0_0_50px_-12px_rgba(0,255,0,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col group/mockup"
            >
              {/* Mockup Header */}
              <div className="h-12 border-b border-white/10 flex items-center px-6 gap-2 bg-[#121214]/80 backdrop-blur-md relative">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-mono text-muted-foreground opacity-70">
                  antislop-report.md
                </div>
              </div>
              {/* Mockup Content */}
              <div className="p-8 font-mono text-sm text-muted-foreground bg-transparent h-[450px] overflow-y-hidden relative">
                <div className="text-terminal-green mb-4">$ antislop scan ./src</div>
                <div className="mb-2 text-white">Scanning 142 files...</div>
                <div className="mb-6 text-white">Found 3 issues requiring attention:</div>
                
                <div className="mb-6 border-l-2 border-red-500/50 pl-4">
                  <div className="text-red-400">✖ [React Anti-Pattern] src/components/List.tsx:42</div>
                  <div className="text-zinc-500 mt-1">Missing memoization on heavy computation</div>
                </div>
                
                <div className="mb-6 border-l-2 border-yellow-500/50 pl-4">
                  <div className="text-yellow-400">⚠ [Logic Bloat] src/utils/auth.ts:18</div>
                  <div className="text-zinc-500 mt-1">Redundant null checks on guaranteed user object</div>
                </div>

                <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
                  <span>Press <kbd className="bg-white/10 px-2 py-1 rounded-md text-white border border-white/20">f</kbd> to auto-fix with Pro</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
