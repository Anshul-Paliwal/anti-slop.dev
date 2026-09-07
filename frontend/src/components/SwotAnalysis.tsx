"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Terminal, Cpu, ShieldCheck, Zap } from "lucide-react";

interface PipelineTab {
  id: string;
  title: string;
  badge: string;
  ascii: string[];
  metrics: { label: string; val: string; status?: "ok" | "warn" | "neutral" }[];
}

const TABS: PipelineTab[] = [
  {
    id: "ast-engine",
    title: "Platform-AST://Core",
    badge: "ACTIVE",
    metrics: [
      { label: "Throughput", val: "1.4k AST/s", status: "ok" },
      { label: "Slop Intercept", val: "99.4%", status: "ok" },
      { label: "Heuristic Drift", val: "0.02ms", status: "neutral" },
    ],
    ascii: [
      "        .----------------------------.",
      "       /       CODE VALIDATORS      /|",
      "      +----------------------------+ |",
      "      | [S1] Halstead Metric  0.94 | |",
      "      | [S2] Redundant Imports 0.91 | |",
      "      | [S3] Hallucinated APIs 0.08!| |",
      "      |   --> SLOP OUTLIER DETECTED| |",
      "      +----------------------------+ |",
      "      |    SLOP FILTER / REFACTOR  |/",
      "      +----------------------------+",
      "        |",
      "        +===================> [AST PURIFICATION]",
      "                                    |",
      "                                    v",
      "                            +---------------+",
      "                            | + ZERO-SLOP   |",
      "                            |   BUILD READY |",
      "                            +---------------+",
    ],
  },
  {
    id: "threat-shield",
    title: "Threat-Model://Shield",
    badge: "MONITORING",
    metrics: [
      { label: "False Flags", val: "< 0.01%", status: "ok" },
      { label: "Token Bloat", val: "-68.4%", status: "ok" },
      { label: "Agent Compat", val: "100%", status: "ok" },
    ],
    ascii: [
      "        .----------------------------.",
      "       /      AI AGENT PAYLOAD      /|",
      "      +----------------------------+ |",
      "      | [P1] Boilerplate Sprawl    | |",
      "      | [P2] Insecure Default Ptr  | |",
      "      | [P3] Dead Async Loops      | |",
      "      +----------------------------+ |",
      "      |    PATTERN HEURISTIC SCAN  |/",
      "      +----------------------------+",
      "        |",
      "        +===================> [NEUTRALIZATION]",
      "                                    |",
      "                                    v",
      "                            +---------------+",
      "                            | + PRODUCTION  |",
      "                            |   CERTIFIED   |",
      "                            +---------------+",
    ],
  },
  {
    id: "ci-pipeline",
    title: "Deploy-Gate://PreCommit",
    badge: "OPTIMIZED",
    metrics: [
      { label: "Latency", val: "8ms", status: "ok" },
      { label: "VCS Hooks", val: "Git / CI", status: "neutral" },
      { label: "Local First", val: "Enabled", status: "ok" },
    ],
    ascii: [
      "        .----------------------------.",
      "       /       LOCAL GIT STAGING    /|",
      "      +----------------------------+ |",
      "      | [C1] git diff --staged     | |",
      "      | [C2] AntiSlop Linter Pass  | |",
      "      | [C3] Rule-Tree Matching    | |",
      "      +----------------------------+ |",
      "      |     AUTO-REPAIR ENGINE     |/",
      "      +----------------------------+",
      "        |",
      "        +===================> [INSTANT COMMIT]",
      "                                    |",
      "                                    v",
      "                            +---------------+",
      "                            | + ZERO-SLOP   |",
      "                            |   SHIP PUSH   |",
      "                            +---------------+",
    ],
  },
];

export default function SwotAnalysis() {
  const [activeTab, setActiveTab] = useState<string>("ast-engine");
  const current = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <section className="w-full py-24 md:py-32 px-6 relative overflow-hidden z-10">
      {/* Terminal Header */}
      <div className="w-full text-center mb-16 relative z-20">
        <div className="inline-flex items-center text-muted-foreground font-mono text-sm mb-4">
          ../System/Architecture../
          <motion.span
            animate={{ opacity: [1, 1, 0, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="inline-block w-2 h-[1em] bg-muted-foreground ml-1 align-middle"
          />
        </div>
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
          System Architecture & Pipeline
        </h2>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Terminal Window Frame */}
        <div className="rounded-2xl border border-white/10 bg-[#0C0C0E] shadow-2xl overflow-hidden backdrop-blur-sm">
          
          {/* Top Window Bar with Controls & Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 px-4 py-3 bg-[#121214] gap-3">
            <div className="flex items-center gap-3">
              {/* Terminal Window Dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
              </div>
              <span className="text-xs font-mono text-muted-foreground ml-2">
                {current.title}
              </span>
            </div>

            {/* Switcher Tabs */}
            <div className="flex items-center gap-1 bg-[#0A0A0B] p-1 rounded-lg border border-white/5">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                    activeTab === tab.id
                      ? "bg-white/10 text-terminal-green font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Body */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Main: Authentic ASCII Flow Diagram */}
            <div className="lg:col-span-8 bg-[#070709] border border-white/5 rounded-xl p-6 overflow-x-auto select-none shadow-inner">
              <pre className="font-mono text-xs sm:text-sm leading-relaxed tracking-wider text-muted-foreground/90 font-medium">
                {current.ascii.map((line, idx) => {
                  // Color highlight key parts of ASCII
                  const isHeader = line.includes("VALIDATORS") || line.includes("PAYLOAD") || line.includes("STAGING");
                  const isAlert = line.includes("SLOP OUTLIER") || line.includes("0.08!");
                  const isAction = line.includes("FILTER") || line.includes("NEUTRALIZATION") || line.includes("AUTO-REPAIR");
                  const isSuccess = line.includes("ZERO-SLOP") || line.includes("PRODUCTION") || line.includes("SHIP PUSH");

                  return (
                    <div key={idx} className="whitespace-pre">
                      {isHeader ? (
                        <span className="text-sky-400 font-bold">{line}</span>
                      ) : isAlert ? (
                        <span className="text-amber-400 font-semibold">{line}</span>
                      ) : isAction ? (
                        <span className="text-sky-300 font-medium">{line}</span>
                      ) : isSuccess ? (
                        <span className="text-terminal-green font-bold">{line}</span>
                      ) : (
                        <span className="text-white/70">{line}</span>
                      )}
                    </div>
                  );
                })}
              </pre>
            </div>

            {/* Right: Telemetry & Metrics Panel */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-terminal-green" />
                Pipeline Telemetry
              </div>

              {/* Status Badge */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#121214]/60 flex items-center justify-between font-mono">
                <span className="text-xs text-muted-foreground">State</span>
                <span className="text-xs font-semibold text-terminal-green flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
                  {current.badge}
                </span>
              </div>

              {/* Metrics List */}
              <div className="flex flex-col gap-2">
                {current.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-white/5 bg-[#121214]/40 flex items-center justify-between font-mono text-xs"
                  >
                    <span className="text-muted-foreground">{m.label}</span>
                    <span
                      className={`font-semibold ${
                        m.status === "ok"
                          ? "text-terminal-green"
                          : "text-foreground"
                      }`}
                    >
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Terminal Caption */}
              <div className="text-[11px] font-mono text-muted-foreground/70 leading-relaxed border-t border-white/5 pt-3">
                $ antislop --inspect --live-stream
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
