"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Terminal } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Edit Issue",
    description: "Real-time AST squiggles directly in your editor.",
    code: `export default function UserProfile({ user }) {
  // AntiSlop: Unnecessary nested memoization detected
  const data = useMemo(() => {
    return useMemo(() => user.data, [user.data]);
  }, [user]);

  return <div>{data.name}</div>;
}`,
    lang: "tsx",
    highlightLines: [2, 3, 4, 5],
    color: "#ff5f56"
  },
  {
    id: 2,
    title: "Pro Auto-Fix",
    description: "One-click remediation for AI-generated slop.",
    code: `export default function UserProfile({ user }) {
  // Purged 2 levels of redundant memoization
  // AST simplified to direct access
  const data = user.data;

  return <div>{data.name}</div>;
}`,
    lang: "tsx",
    highlightLines: [4],
    color: "#27c93f"
  },
  {
    id: 3,
    title: "CLI Report",
    description: "Deterministic terminal reports for your CI/CD.",
    code: `$ antislop scan ./src

[WARN] src/components/Hero.tsx:12
       Detected phantom wrapper 'LayoutContainer'
       Fix: Unwrap children directly

[PASS] Scanned 1,402 files in 1.2s.
       1 issue found.`,
    lang: "bash",
    highlightLines: [4, 5],
    color: "#ffbd2e"
  },
];

export default function ShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section 
      className="w-full py-24 md:py-32 overflow-hidden relative z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-[1400px] mx-auto px-6 relative flex flex-col items-center">
        {/* Typewriter Header */}
        <div className="w-full text-center mb-16">
          <div className="inline-flex items-center text-white/40 font-mono text-[10px] uppercase tracking-widest mb-4 gap-2">
             <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
            ../analysis/showcase..
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold text-white tracking-tight flex items-center justify-center flex-wrap">
            See the cleanup action: before, after, and pro auto-fix
            <motion.span
              animate={{ opacity: [1, 1, 0, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="inline-block w-[0.5em] h-[0.8em] bg-white ml-2 align-middle mb-1 opacity-80"
            />
          </h2>
        </div>
        
        {/* Carousel Container */}
        <div className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center perspective-[1000px]">
          {/* Ambient glow behind active card */}
          <div className="absolute w-[60%] h-[60%] bg-terminal-green/5 blur-[120px] pointer-events-none -z-10 rounded-full" />

          <AnimatePresence initial={false}>
            {slides.map((slide, i) => {
              const isActive = i === currentIndex;
              const isPrev = i === (currentIndex - 1 + slides.length) % slides.length;
              const isNext = i === (currentIndex + 1) % slides.length;

              if (!isActive && !isPrev && !isNext) return null;

              // Calculate positions
              let x = 0;
              let scale = 1;
              let zIndex = 30;
              let rotateY = 0;
              let opacity = 1;

              if (isActive) {
                x = 0;
                scale = 1;
                zIndex = 30;
                rotateY = 0;
                opacity = 1;
              } else if (isPrev) {
                x = -400; // Shift left
                scale = 0.8;
                zIndex = 10;
                rotateY = 15; // Angle slightly
                opacity = 0.4;
              } else if (isNext) {
                x = 400; // Shift right
                scale = 0.8;
                zIndex = 10;
                rotateY = -15; // Angle slightly
                opacity = 0.4;
              }

              return (
                <motion.div
                  key={slide.id}
                  className="absolute top-0 w-full max-w-[700px] h-full"
                  initial={false}
                  animate={{
                    x: x,
                    scale: scale,
                    zIndex: zIndex,
                    rotateY: rotateY,
                    opacity: opacity,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 250, 
                    damping: 25, 
                    mass: 0.8 
                  }}
                  style={{ transformOrigin: "center center" }}
                  onClick={() => {
                    if (isPrev) handlePrev();
                    if (isNext) handleNext();
                  }}
                >
                  {/* Card Body */}
                  <div className={`w-full h-full flex flex-col bg-[#0f0f13] border ${isActive ? 'border-white/15' : 'border-white/5'} rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl transition-colors cursor-pointer`}>
                    
                    {/* Fake Mac Titlebar */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/10 shrink-0">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-black/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-black/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-black/20"></div>
                      </div>
                      <div className="text-[10px] text-white/30 font-mono flex items-center gap-2 select-none uppercase tracking-widest">
                         {slide.lang}
                      </div>
                      <div className="w-12"></div>
                    </div>

                    {/* Code Area */}
                    <div className="flex-1 p-6 md:p-8 bg-[#0a0a0a] overflow-hidden relative">
                      {/* Line Numbers & Code */}
                      <div className="font-mono text-xs md:text-sm leading-relaxed overflow-hidden">
                         {slide.code.split('\n').map((line, idx) => {
                           const isHighlighted = slide.highlightLines.includes(idx + 1);
                           return (
                             <div 
                               key={idx} 
                               className={`flex items-start ${isHighlighted ? 'bg-white/5 -mx-6 px-6 border-l-2' : ''}`}
                               style={{ borderColor: isHighlighted ? slide.color : 'transparent' }}
                             >
                               <span className="w-8 shrink-0 text-white/20 select-none text-right pr-4">{idx + 1}</span>
                               <span className={`${isHighlighted ? 'text-white' : 'text-white/60'} whitespace-pre-wrap font-mono`}>{line}</span>
                             </div>
                           );
                         })}
                      </div>
                    </div>

                    {/* Footer Area with Title/Description */}
                    <div className="p-6 md:p-8 bg-[#111] border-t border-white/10 flex flex-col items-center justify-center text-center shrink-0">
                      <h3 className="text-xl md:text-2xl font-bold font-mono text-white mb-2">{slide.title}</h3>
                      <p className="text-sm md:text-base text-white/50 font-mono">{slide.description}</p>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Subtle Navigation Dots (Optional, since cards are clickable) */}
        <div className="mt-12 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-terminal-green w-6' : 'bg-white/20 hover:bg-white/40'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
