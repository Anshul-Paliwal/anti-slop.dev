"use client";

import { motion } from "framer-motion";
import { ArrowRight, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Hello-World!";
  
  // Typewriter effect
  useEffect(() => {
    let currentLength = 0;
    const interval = setInterval(() => {
      if (currentLength < fullText.length) {
        setTypedText(fullText.slice(0, currentLength + 1));
        currentLength++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[70vh] bg-transparent overflow-hidden flex flex-col justify-center pt-32 pb-8">
      <div className="max-w-[90rem] mx-auto px-6 w-full flex flex-col relative z-10">
        
        {/* Top Row: Title & Button perfectly aligned */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-2 lg:mb-4">
          
          {/* Top Left: Typewriter Header */}
          <h1 className="text-6xl md:text-[6rem] lg:text-[8rem] font-bold font-mono text-[#F5F5F4] tracking-tight whitespace-nowrap">
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="inline-block w-[6px] md:w-[12px] h-[0.8em] bg-[#F5F5F4] ml-2 align-baseline"
            />
          </h1>
          
          {/* Top Right: Primary CTA */}
          <div className="relative flex flex-col items-end mt-8 md:mt-0">
            <Link
              href="#install"
              className="relative z-10 flex items-center gap-2 md:gap-3 group scale-100 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Left Side: White Button Capsule (Wider & Centered) */}
              <div className="flex items-center justify-center gap-3 h-14 md:h-16 w-[220px] md:w-[280px] bg-[#F5F5F4] group-hover:bg-white text-[#0A0A0B] rounded-full font-mono font-bold text-sm md:text-base transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                <Terminal className="w-5 h-5 opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="uppercase tracking-widest mt-0.5">Start_Now</span>
              </div>

              {/* Right Side: Outside Circle Arrow */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0A0A0B] border border-white/20 text-white flex items-center justify-center transition-all duration-300 group-hover:bg-terminal-green group-hover:border-terminal-green group-hover:text-[#0A0A0B]">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>

        {/* Subtitle placed below the aligned row */}
        <div className="w-full mb-12 lg:mb-20">
          <p className="text-terminal-green font-mono text-xl md:text-2xl">
            {">"} Welcome to the anti-slop movement.
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-12 lg:gap-0">
          
          {/* Bottom Left: Paragraph */}
          <div className="order-2 md:order-1 flex flex-col items-start">
            <div className="inline-flex items-center text-muted-foreground font-mono text-sm mb-4">
              ../Core/Diagnostic_Engine../
              <span className="inline-block w-2 h-[1em] bg-muted-foreground ml-1 align-middle" />
            </div>
            <p className="text-[#F5F5F4]/80 text-lg md:text-xl leading-relaxed max-w-lg font-sans">
              An advanced <strong className="text-[#F5F5F4] font-semibold italic">diagnostic engine</strong> that purges AI bloat and refactors <strong className="text-terminal-green font-semibold">low-quality boilerplate</strong> before it hits your <strong className="text-[#F5F5F4] font-semibold italic">production codebase</strong>.
            </p>
          </div>

          {/* Bottom Right: Massive Wordmark */}
          <motion.div
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            whileInView={{
              opacity: [0, 0.5, 0.2, 1, 0.8, 1],
              x: [50, -20, 10, -5, 2, 0],
              y: [0, 10, -10, 5, -2, 0],
              skewX: [0, 15, -15, 5, 0, 0],
              filter: ["blur(10px)", "blur(2px)", "blur(8px)", "blur(0px)", "blur(1px)", "blur(0px)"]
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
            className="text-6xl md:text-[5rem] lg:text-[7rem] font-black tracking-tighter text-right font-heading whitespace-nowrap order-1 md:order-2 flex items-baseline justify-end"
          >
            <span className="text-[#F5F5F4]">
              Anti-Slop
            </span>
            <span className="text-terminal-green ml-1 font-mono text-5xl md:text-[4rem] lg:text-[6rem] opacity-90 drop-shadow-[0_0_15px_rgba(57,255,136,0.3)]">
              .dev
            </span>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
