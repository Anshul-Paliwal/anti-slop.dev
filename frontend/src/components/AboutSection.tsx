"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Workflow, Zap, Code2, Play } from "lucide-react";

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
  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center text-muted-foreground font-mono text-sm mb-4">
            ../About Package../
            <motion.span
              animate={{ opacity: [1, 1, 0, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block w-2 h-[1em] bg-muted-foreground ml-1 align-middle"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            What AntiSlop actually catches.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[minmax(160px,auto)]">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className={`p-6 rounded-2xl border border-white/10 bg-[#121214] flex flex-col justify-between ${card.className}`}
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Mockup with Parallax */}
          <div className="relative h-full min-h-[500px] w-full flex items-center justify-center lg:ml-8 mt-12 lg:mt-0">
            {/* Decorative Ring */}
            <motion.div
              className="absolute w-[600px] h-[600px] rounded-full border border-white/[0.03] -z-10 pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              style={{ borderStyle: "dashed" }}
            />
            
            {/* Parallax Mockup Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full max-w-md bg-[#18181B] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Mockup Header */}
              <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-[#121214]">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                <div className="ml-4 text-xs font-mono text-muted-foreground flex-1 text-center pr-10">antislop-report.md</div>
              </div>
              {/* Mockup Content */}
              <div className="p-6 font-mono text-sm text-muted-foreground bg-[#0A0A0B] h-[400px] overflow-y-hidden relative">
                <div className="text-terminal-green mb-4">$ antislop scan ./src</div>
                <div className="mb-2 text-white">Scanning 142 files...</div>
                <div className="mb-4 text-white">Found 3 issues requiring attention:</div>
                
                <div className="mb-4 border-l-2 border-red-500/50 pl-4">
                  <div className="text-red-400">✖ [React Anti-Pattern] src/components/List.tsx:42</div>
                  <div className="text-zinc-500">Missing memoization on heavy computation</div>
                </div>
                
                <div className="mb-4 border-l-2 border-yellow-500/50 pl-4">
                  <div className="text-yellow-400">⚠ [Logic Bloat] src/utils/auth.ts:18</div>
                  <div className="text-zinc-500">Redundant null checks on guaranteed user object</div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <span>Press <kbd className="bg-white/10 px-1 rounded">f</kbd> to auto-fix with Pro</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
