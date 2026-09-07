"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldCheck, Sparkles, FastForward } from "lucide-react";

interface TerminalIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export default function TerminalIntro({ onComplete, forceShow = false }: TerminalIntroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [textWelcome, setTextWelcome] = useState("");
  const [textSlop, setTextSlop] = useState("");
  const [progress, setProgress] = useState(0);

  const welcomeTarget = "Welcome !";
  const slopTarget = "Here we remove the slop";

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

  // Animation timeline sequence
  useEffect(() => {
    if (!isVisible) return;

    // Step 0: Command line executes
    const timer0 = setTimeout(() => {
      setStep(1);
    }, 400);

    return () => clearTimeout(timer0);
  }, [isVisible]);

  // Typewriter for "Welcome !"
  useEffect(() => {
    if (step !== 1) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= welcomeTarget.length) {
        setTextWelcome(welcomeTarget.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStep(2), 250);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [step]);

  // Typewriter for "Here we remove the slop"
  useEffect(() => {
    if (step !== 2) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= slopTarget.length) {
        setTextSlop(slopTarget.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStep(3), 300);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [step]);

  // Progress Bar & Final status
  useEffect(() => {
    if (step !== 3) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep(4);
            setTimeout(() => {
              finishIntro();
            }, 800);
          }, 350);
          return 100;
        }
        return prev + 10;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [step, finishIntro]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="terminal-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(12px)",
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070709] text-foreground font-mono overflow-hidden select-none cursor-pointer"
          onClick={finishIntro}
        >
          {/* Subtle Cyberpunk Background Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(57,255,136,0.12),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2215_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2215_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

          {/* CRT Scanline Effect */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40 z-20" />

          {/* Terminal Window Container */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-30 w-full max-w-2xl mx-4 bg-[#0D0D11]/90 backdrop-blur-2xl border border-[#27272A]/90 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(57,255,136,0.08)] overflow-hidden"
          >
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#131318]/90 border-b border-[#27272A]/80">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]/80 border border-[#EF4444]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80 border border-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#39FF88]/80 border border-[#39FF88]" />
                <span className="ml-2 text-xs font-mono text-muted-foreground/80 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-terminal-green" />
                  antislop@core:~ (v1.0.0)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60 font-mono">
                <span>UTF-8</span>
                <span>•</span>
                <span className="text-terminal-green/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 md:p-8 min-h-[300px] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Command Invocation */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-terminal-green font-bold">➜</span>
                  <span className="text-[#38BDF8]">~</span>
                  <span className="text-white/90">antislop boot --clean-env</span>
                </div>

                {/* Primary Coding Aesthetic Message: "Welcome !" */}
                <div className="pt-2">
                  <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-white flex items-center flex-wrap gap-2">
                    <span className="text-terminal-green drop-shadow-[0_0_12px_rgba(57,255,136,0.4)]">
                      {textWelcome}
                    </span>
                    {step === 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                        className="inline-block w-3 h-8 md:h-10 bg-terminal-green align-middle shadow-[0_0_8px_#39FF88]"
                      />
                    )}
                  </div>
                </div>

                {/* Secondary Message: "Here we remove the slop" */}
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pt-1"
                  >
                    <p className="text-lg md:text-2xl font-mono font-medium text-foreground/90 flex items-center gap-2 flex-wrap">
                      <span className="text-[#38BDF8]">{">"}</span>
                      <span>{textSlop}</span>
                      {step === 2 && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                          className="inline-block w-2.5 h-5 md:h-6 bg-foreground align-middle"
                        />
                      )}
                    </p>
                  </motion.div>
                )}

                {/* System Status and Diagnostics */}
                {step >= 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="pt-4 space-y-2 text-xs md:text-sm text-muted-foreground font-mono"
                  >
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>[OK] AI hallucination scanner loaded</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                      <span>[OK] AntiSlop heuristics engine online</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                        <span>Launching interface...</span>
                        <span className="text-terminal-green">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1F1F24] rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-terminal-green shadow-[0_0_10px_#39FF88]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bottom Footer Actions */}
              <div className="pt-4 border-t border-[#27272A]/40 flex items-center justify-between text-xs text-muted-foreground/70">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-terminal-green/80" />
                  Press <kbd className="px-1.5 py-0.5 bg-[#1F1F24] border border-white/10 rounded text-[10px] text-foreground">ESC</kbd> or <kbd className="px-1.5 py-0.5 bg-[#1F1F24] border border-white/10 rounded text-[10px] text-foreground">ENTER</kbd>
                </span>

                <button
                  type="button"
                  onClick={finishIntro}
                  className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-foreground/80 hover:text-terminal-green transition-all hover:scale-105 active:scale-95"
                >
                  <FastForward className="w-3 h-3" />
                  <span>Skip intro</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
