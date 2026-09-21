"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

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
    <section className="relative w-full min-h-[70vh] bg-transparent overflow-hidden flex flex-col justify-center pt-32 pb-16">
      <div className="max-w-[90rem] mx-auto px-6 w-full flex flex-col relative z-10">
        
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-12 lg:mb-20">
          
          {/* Top Left: Typewriter Header & Welcome */}
          <div className="flex flex-col">
            <h1 className="text-6xl md:text-[6rem] lg:text-[8rem] font-bold font-mono text-[#F5F5F4] tracking-tight whitespace-nowrap">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="inline-block w-[6px] md:w-[12px] h-[0.8em] bg-[#F5F5F4] ml-2 align-baseline"
              />
            </h1>
            <p className="text-terminal-green font-mono text-xl md:text-2xl mt-2">
              {">"} Welcome to the anti-slop movement.
            </p>
          </div>
          
          {/* Top Right: Unified CTA */}
          <div className="relative group flex items-center cursor-pointer mt-12 md:mt-0 md:mr-12 lg:mr-24">
            {/* Soft Glow on hover */}
            <div className="absolute inset-0 bg-[#39FF88]/0 group-hover:bg-[#39FF88]/20 blur-xl rounded-full transition-all duration-500 pointer-events-none z-0" />
            
            <div className="relative h-14 md:h-16 px-8 md:px-10 bg-[#F5F5F4] text-[#0A0A0B] rounded-full flex items-center justify-center font-bold text-sm md:text-base tracking-wide z-10 transition-colors shadow-lg">
              Let's Get Started
            </div>
            <div className="relative w-14 h-14 md:w-16 md:h-16 ml-3 bg-[#F5F5F4] text-[#0A0A0B] rounded-full flex items-center justify-center z-10 overflow-hidden shadow-lg">
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
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
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#F5F5F4] to-[#F5F5F4]/40">
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
