"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "VS Code Extension",
    description: "Inline warning squiggles on slop code right in your editor.",
    imagePlaceholder: "VS Code Mockup",
  },
  {
    id: 2,
    title: "CLI Scan",
    description: "Terminal output and antislop-report.md from a project scan.",
    imagePlaceholder: "Terminal Mockup",
  },
  {
    id: 3,
    title: "Pro Auto-Fix",
    description: "Before/after diff showcasing one-click resolution.",
    imagePlaceholder: "Diff Mockup",
  },
];

export default function ShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
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
      <div className="max-w-7xl mx-auto px-6 relative flex flex-col items-center">
        {/* Terminal Header */}
        <div className="w-full text-center mb-10">
          <div className="inline-flex items-center text-muted-foreground font-mono text-sm mb-4">
            ../Features/Showcase../
            <motion.span
              animate={{ opacity: [1, 1, 0, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block w-2 h-[1em] bg-muted-foreground ml-1 align-middle"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            See the cleanup in action.
          </h2>
        </div>
        
        <div className="relative w-full h-[500px] flex items-center justify-center">
        <AnimatePresence initial={false} mode="popLayout">
          {slides.map((slide, i) => {
            const isActive = i === currentIndex;
            const isPrev = i === (currentIndex - 1 + slides.length) % slides.length;
            const isNext = i === (currentIndex + 1) % slides.length;

            if (!isActive && !isPrev && !isNext) return null;

            return (
              <motion.div
                key={slide.id}
                layout
                initial={{ opacity: 0, scale: 0.8, x: isNext ? 300 : isPrev ? -300 : 0 }}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  scale: isActive ? 1 : 0.7,
                  x: isActive ? 0 : isNext ? "60%" : "-60%",
                  zIndex: isActive ? 30 : 10,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute w-full max-w-4xl h-[400px] bg-[#121214] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl"
              >
                <div className="flex-1 w-full flex items-center justify-center bg-black/50 rounded-xl border border-white/5 mb-6">
                  <span className="font-mono text-muted-foreground">{slide.imagePlaceholder}</span>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">{slide.title}</h3>
                  <p className="text-muted-foreground">{slide.description}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-12 z-40 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-foreground hover:bg-white/10 hover:border-terminal-green/50 transition-colors backdrop-blur-md"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-12 z-40 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-foreground hover:bg-white/10 hover:border-terminal-green/50 transition-colors backdrop-blur-md"
        >
          <ChevronRight size={24} />
        </button>
        </div>
      </div>
    </section>
  );
}
