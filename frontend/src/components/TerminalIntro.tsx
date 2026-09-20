"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldCheck, Sparkles, FastForward, CheckCircle2 } from "lucide-react";
import KineticCenterBuild from "@/components/ui/smoothui/kinetic-center-build";

interface TerminalIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

const INTRO_PHRASES = [
  "Anti-Slop.dev",
  "Purging AI Bloat",
  "Zero Hallucinations",
  "Welcome to Clean Code",
];

export default function TerminalIntro({ onComplete, forceShow = false }: TerminalIntroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing AST Engine...");

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem("antislop_intro_seen", "true");
    } catch {
      // ignore storage errors
    }
    setIsVisible(false);
    if (onComplete) onComplete();
  }, [onComplete]);

  // Initial check on mount
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("antislop_intro_seen");
      const urlParams = new URLSearchParams(window.location.search);
      const replayParam = urlParams.get("intro") === "1" || urlParams.get("intro") === "true";

      if (!seen || forceShow || replayParam) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, [forceShow]);

  // Keyboard shortcut to skip
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finishIntro();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, finishIntro]);

  // Smooth Loading Progress Bar while kinetic center build runs
  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const duration = 2600; // 2.6 seconds total intro runtime

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(pct);

      if (pct < 35) {
        setStatusText("Mounting AST Heuristics...");
      } else if (pct < 70) {
        setStatusText("Pre-loading Diagnostic Filters...");
      } else if (pct < 95) {
        setStatusText("Purging AI Hallucinations...");
      } else {
        setStatusText("Environment Ready.");
      }

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          finishIntro();
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isVisible, finishIntro]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="kinetic-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(14px)",
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070709] text-foreground font-mono overflow-hidden select-none px-6"
          onClick={finishIntro}
        >
          {/* Cybernetic Background Ambience */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(57,255,136,0.14),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2220_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2220_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

          {/* CRT Scanline */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-30 z-10" />

          {/* Center Kinetic Hero Container */}
          <div
            className="relative z-20 flex flex-col items-center justify-center text-center max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Prompt Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-mono text-muted-foreground mb-8 shadow-lg"
            >
              <Terminal className="w-3.5 h-3.5 text-terminal-green" />
              <span>antislop-core://boot_sequence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse ml-1" />
            </motion.div>

            {/* Kinetic Center Build Headline Animation */}
            <div className="min-h-[90px] sm:min-h-[120px] flex items-center justify-center w-full mb-8">
              <KineticCenterBuild
                phrases={INTRO_PHRASES}
                interval={1800}
                className="font-heading font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              />
            </div>

            {/* Glowing Cybernetic Loading Bar */}
            <div className="w-full max-w-md flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 text-terminal-green/90">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
                  {statusText}
                </span>
                <span className="font-semibold text-terminal-green">{progress}%</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 bg-[#141418] rounded-full overflow-hidden border border-white/10 p-0.5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-terminal-green to-[#5aff9d] rounded-full shadow-[0_0_14px_#39FF88]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Skip & Keyboard Controls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground/80 font-mono"
            >
              <span className="flex items-center gap-1.5">
                Press <kbd className="px-1.5 py-0.5 bg-[#1F1F24] border border-white/10 rounded text-[10px] text-foreground">ESC</kbd> or <kbd className="px-1.5 py-0.5 bg-[#1F1F24] border border-white/10 rounded text-[10px] text-foreground">ENTER</kbd>
              </span>
              <span className="text-white/20">•</span>
              <button
                type="button"
                onClick={finishIntro}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-foreground hover:text-terminal-green transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FastForward className="w-3 h-3" />
                <span>Skip intro</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
