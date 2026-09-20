"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Terminal, Zap, Shield, Clock, Sparkles, CheckCircle2 } from "lucide-react";

interface AdvantageTab {
  id: string;
  tabLabel: string;
  title: string;
  badge: string;
  badgeType?: "green" | "cyan" | "purple" | "amber";
  tagline: string;
  ascii: string[];
  metrics: { label: string; val: string; status?: "ok" | "warn" | "neutral" }[];
  summary: string;
  highlights: string[];
}

const TABS: AdvantageTab[] = [
  {
    id: "zero-bloat",
    tabLabel: "ZERO-BLOAT",
    title: "Advantage://Clean-Codebase",
    badge: "ESSENTIAL",
    badgeType: "green",
    tagline: "Purge AI-generated boilerplate & over-engineered fluff instantly.",
    summary: "LLMs frequently hallucinate complex wrappers and unnecessary dependencies. Anti-Slop intercepts this at the AST level before it pollutes your repository.",
    highlights: [
      "Eliminates phantom imports & unused utility helpers",
      "Translates 50 lines of bloated boilerplate into 5 idiomatic lines",
      "Enforces strict anti-hallucination type checking",
    ],
    metrics: [
      { label: "Boilerplate Reduction", val: "-68.4%", status: "ok" },
      { label: "Maintainability Score", val: "A+ Rating", status: "ok" },
      { label: "Slop Intercept Rate", val: "99.4%", status: "ok" },
    ],
    ascii: [
      "  +--------------------------------------------------------+",
      "  |  [!] UNPROTECTED AI COPILOT OUTPUT                     |",
      "  +--------------------------------------------------------+",
      "  |  - 140 lines of redundant helper wrappers              |",
      "  |  - Hallucinated imports & deprecated function calls    |",
      "  |  - Deeply nested unnecessary async try/catch chains    |",
      "  +---------------------------+----------------------------+",
      "                              |",
      "                              v [ANTI-SLOP AST REFACTOR]",
      "  +--------------------------------------------------------+",
      "  |  [✓] CLEAN, IDIOMATIC PRODUCTION CODE                  |",
      "  +--------------------------------------------------------+",
      "  |  + Direct, minimal & performant modern syntax          |",
      "  |  + 100% verified dependencies & type safety            |",
      "  |  + Zero cognitive noise for code reviews               |",
      "  +--------------------------------------------------------+",
    ],
  },
  {
    id: "review-speed",
    tabLabel: "5X-FASTER-REVIEWS",
    title: "Advantage://Velocity-&-Focus",
    badge: "5X VELOCITY",
    badgeType: "cyan",
    tagline: "Cut PR review cycles by 75% by eliminating review fatigue.",
    summary: "Teams waste countless hours reading messy AI code in pull requests. Anti-Slop pre-purifies code at author time so PRs stay concise, readable, and fast to merge.",
    highlights: [
      "Engineers review what actually matters, not syntactic fluff",
      "Saves senior engineers 5-8 hours per week in PR churn",
      "Prevents tech debt accumulation from day one",
    ],
    metrics: [
      { label: "Review Time / PR", val: "-75%", status: "ok" },
      { label: "Weekly Dev Hours Saved", val: "6.5 hrs", status: "ok" },
      { label: "PR Merge Velocity", val: "3.8x Faster", status: "ok" },
    ],
    ascii: [
      "  +--------------------------------------------------------+",
      "  |  WITHOUT ANTI-SLOP: SLOW & FATIGUING PR REVIEWS        |",
      "  |  [####################] 45 mins / PR (600 lines diff)  |",
      "  |  -> Reviewers drown in boilerplate & miss critical bugs|",
      "  +--------------------------------------------------------+",
      "                              vs",
      "  +--------------------------------------------------------+",
      "  |  WITH ANTI-SLOP: LEAN & ACCELERATED PR REVIEWS         |",
      "  |  [####................]  8 mins / PR (120 lines diff)  |",
      "  |  -> Clean, concise diffs focused 100% on core logic    |",
      "  +--------------------------------------------------------+",
    ],
  },
  {
    id: "token-efficiency",
    tabLabel: "TOKEN-SAVINGS",
    title: "Advantage://Context-Optimization",
    badge: "MAX EFFICIENCY",
    badgeType: "purple",
    tagline: "Save up to 70% in LLM context windows and API token costs.",
    summary: "When prompts and codebase contexts are flooded with bloated boilerplate, LLM intelligence degrades and costs skyrocket. Clean context yields smarter answers.",
    highlights: [
      "Keeps codebase within optimal LLM reasoning context",
      "Reduces API costs across Cursor, Copilot, and Claude agents",
      "Prevents model degradation caused by token exhaustion",
    ],
    metrics: [
      { label: "Token Waste Avoided", val: "-72%", status: "ok" },
      { label: "API Cost Savings", val: "Up to 55%", status: "ok" },
      { label: "Model Reasoning Accuracy", val: "+34%", status: "ok" },
    ],
    ascii: [
      "  +--------------------------------------------------------+",
      "  |  CONTEXT WINDOW SATURATION & WASTED TOKENS             |",
      "  +--------------------------------------------------------+",
      "  |  Uncleaned Codebase: [====================] 128k Tokens|",
      "  |  * High latency, high API cost, frequent forgetting   |",
      "  |                                                        |",
      "  |  Anti-Slop Cleaned:  [======..............] 36k Tokens |",
      "  |  * Razor-sharp LLM focus, faster prompt completion    |",
      "  +--------------------------------------------------------+",
    ],
  },
  {
    id: "privacy-first",
    tabLabel: "LOCAL-&-PRIVATE",
    title: "Advantage://Zero-Data-Leak",
    badge: "100% OFFLINE",
    badgeType: "green",
    tagline: "Engineered to run natively on your machine with zero cloud upload.",
    summary: "Your proprietary code never leaves your workstation. All AST analysis, slop detection, and automated refactoring run in ultra-fast native Rust/WASM locally.",
    highlights: [
      "Zero telemetry, zero cloud storage, zero tracking",
      "Works seamlessly offline, in air-gapped setups & enterprise VPNs",
      "Sub-millisecond execution with negligible CPU footprint",
    ],
    metrics: [
      { label: "Cloud Uploads", val: "0 bytes (None)", status: "ok" },
      { label: "Execution Latency", val: "< 4ms (Local)", status: "ok" },
      { label: "Enterprise Security", val: "SOC2 Ready", status: "ok" },
    ],
    ascii: [
      "  +--------------------------------------------------------+",
      "  |  NATIVE ON-DEVICE SECURITY ARCHITECTURE                |",
      "  +--------------------------------------------------------+",
      "  |  [✓] 100% Local AST Engine (Rust / WASM)               |",
      "  |  [✓] Zero Cloud Endpoints / Zero Telemetry Transmit    |",
      "  |  [✓] Instant Pre-Commit & In-Editor Hot Linter         |",
      "  |  [✓] Air-Gapped & Enterprise Repository Compliant      |",
      "  +--------------------------------------------------------+",
      "  |  BENEFIT: Complete data sovereignty for your IP        |",
      "  +--------------------------------------------------------+",
    ],
  },
];

export default function SwotAnalysis() {
  const [activeTab, setActiveTab] = useState<string>("zero-bloat");
  const current = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <section className="w-full py-24 md:py-32 px-6 relative overflow-hidden z-10" id="advantages">
      {/* Terminal Header */}
      <div className="w-full text-center mb-16 relative z-20">
        <div className="inline-flex items-center text-muted-foreground font-mono text-sm mb-4">
          ../Why/AntiSlop../
          <motion.span
            animate={{ opacity: [1, 1, 0, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="inline-block w-2 h-[1em] bg-muted-foreground ml-1 align-middle"
          />
        </div>
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
          Why Use The Anti-Slop Extension?
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-4 font-sans">
          Built for developers who love AI velocity but refuse to drown in generated boilerplate, hallucinated packages, and technical debt.
        </p>
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
            <div className="flex items-center gap-1 bg-[#0A0A0B] p-1 rounded-lg border border-white/5 flex-wrap">
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
                  {tab.tabLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Body */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Main: Visual ASCII Benefit Comparison */}
            <div className="lg:col-span-8 bg-[#070709] border border-white/5 rounded-xl p-6 overflow-x-auto select-none shadow-inner flex flex-col justify-between min-h-[300px]">
              <pre className="font-mono text-xs sm:text-sm leading-relaxed tracking-wider text-muted-foreground/90 font-medium">
                {current.ascii.map((line, idx) => {
                  const isAlert = line.includes("[!]") || line.includes("WITHOUT") || line.includes("WASTED");
                  const isSuccess = line.includes("[✓]") || line.includes("WITH ANTI-SLOP") || line.includes("BENEFIT");
                  const isAction = line.includes("REFACTOR") || line.includes("vs") || line.includes("Anti-Slop Cleaned");

                  return (
                    <div key={idx} className="whitespace-pre">
                      {isAlert ? (
                        <span className="text-amber-400 font-semibold">{line}</span>
                      ) : isSuccess ? (
                        <span className="text-terminal-green font-bold">{line}</span>
                      ) : isAction ? (
                        <span className="text-sky-300 font-medium">{line}</span>
                      ) : (
                        <span className="text-white/80">{line}</span>
                      )}
                    </div>
                  );
                })}
              </pre>

              {/* Tagline & Highlights below ASCII */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-xs md:text-sm text-foreground/90 font-sans mb-3">
                  {current.summary}
                </p>
                <div className="flex flex-col gap-1.5">
                  {current.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-terminal-green shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Concrete Impact Metrics Panel */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-terminal-green" />
                Extension Impact
              </div>

              {/* Status / Value Badge */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#121214]/60 flex items-center justify-between font-mono">
                <span className="text-xs text-muted-foreground">Impact Tier</span>
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

              {/* Terminal Quick Command */}
              <div className="text-[11px] font-mono text-muted-foreground/70 leading-relaxed border-t border-white/5 pt-3">
                $ code --install-extension antislop.dev
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
