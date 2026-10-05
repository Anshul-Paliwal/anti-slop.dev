"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const codeLines = [
  "import React from \"react\";",
  "",
  "export function UserCard({ user }) {",
  "  console.log(\"Rendering user:\", user);",
  "",
  "  if (user !== null) {",
  "    if (user !== null) {",
  "      return <div>{user.name}</div>;",
  "    }",
  "  }",
  "",
  "  return null;",
  "}"
];

const astNodes = [
  "ImportDeclaration",
  "FunctionDeclaration",
  "CallExpression",
  "IfStatement",
  "BinaryExpression",
  "ReturnStatement"
];

export default function AstPurification() {
  const [stage, setStage] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    // Sequence: 
    // 0: PARSE (Initial)
    // 1: BUILD AST (1.5s)
    // 2: ANALYZE (3s)
    // 3: DETECT (4.5s)
    // 4: REPORT (6s)
    const timers = [
      setTimeout(() => setStage(1), 1500),
      setTimeout(() => setStage(2), 3000),
      setTimeout(() => setStage(3), 4500),
      setTimeout(() => setStage(4), 6000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section className="w-full py-24 md:py-32 relative z-10" ref={containerRef}>
      <div className="max-w-[1200px] mx-auto px-6 relative">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div className="flex flex-col gap-3 font-mono text-[10px] text-white/50 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="text-white/30">../STATIC ANALYSIS &gt;</span>
              <div className="w-2 h-4 bg-white/20 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <span>LOCAL ANALYSIS</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"></span> ACTIVE
              </span>
            </div>
            <div className="w-12 h-2 bg-terminal-green rounded-full shadow-[0_0_10px_rgba(39,201,63,0.5)]"></div>
          </div>
          
          <div className="text-right">
            <h2 className="text-2xl md:text-3xl font-mono text-white/80">
              AntiSlop analyzes your code at the <span className="font-bold text-white">AST level</span>.
              <br />
              More than <span className="text-terminal-green font-bold">just a linter</span>.
            </h2>
          </div>
        </div>

        {/* Main Dashboard Window */}
        <div className="w-full bg-[#0d0d11] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(39,201,63,0.05)] overflow-hidden flex flex-col relative">
          
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-terminal-green/10 blur-[100px] -translate-y-1/2 rounded-full pointer-events-none" />

          {/* Mac Header */}
          <div className="flex items-center px-4 py-3 bg-[#111] border-b border-white/10 shrink-0">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-black/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-black/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-black/20"></div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row p-8 lg:p-12 gap-12 lg:gap-8 min-h-[500px]">
            
            {/* Left AST Diagram */}
            <div className="flex-1 relative flex items-center justify-center">
              <div className="relative w-full max-w-[400px] h-[350px] flex items-center justify-between">
                
                {/* Root Node */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: stage >= 1 ? 1 : 0, scale: stage >= 1 ? 1 : 0.8 }}
                  className="z-10 bg-[#111] border border-terminal-green/50 text-terminal-green font-mono px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(39,201,63,0.2)]"
                >
                  AST
                </motion.div>

                {/* SVG Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: "drop-shadow(0 0 4px rgba(39,201,63,0.4))" }}>
                  {[35, 91, 147, 203, 259, 315].map((y, i) => (
                    <motion.path
                      key={i}
                      d={`M 65 175 C 130 175, 150 ${y}, 230 ${y}`}
                      fill="none"
                      stroke="#27c93f"
                      strokeWidth={stage >= 2 && (i === 2 || i === 3) ? "3" : "2"}
                      strokeOpacity={stage >= 2 && (i === 2 || i === 3) ? "0.8" : "0.3"}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: stage >= 1 ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: stage === 1 ? i * 0.1 : 0, ease: "easeOut" }}
                    />
                  ))}
                </svg>

                {/* Child Nodes */}
                <div className="absolute right-0 h-full w-[180px]">
                  {astNodes.map((label, i) => {
                    const isTargetNode = label === 'CallExpression' || label === 'IfStatement';
                    const isHighlighted = stage >= 2 && isTargetNode;
                    const yPositions = [35, 91, 147, 203, 259, 315];
                    
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: stage >= 1 ? 1 : 0, 
                          x: stage >= 1 ? 0 : -20,
                          scale: isHighlighted ? 1.05 : 1
                        }}
                        transition={{ duration: 0.4, delay: stage === 1 ? 0.3 + (i * 0.1) : 0 }}
                        className={`absolute left-0 w-full font-mono text-[11px] px-3 py-2 rounded-lg transition-all duration-500 border ${
                          isHighlighted 
                            ? "bg-terminal-green/20 border-terminal-green text-white shadow-[0_0_15px_rgba(39,201,63,0.4)]" 
                            : "bg-[#111] border-terminal-green/30 text-terminal-green/80"
                        }`}
                        style={{ top: yPositions[i], translateY: "-50%" }}
                      >
                        {label}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Code Window */}
            <div className="flex-1 flex items-center justify-center lg:justify-end z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-[480px] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">UserCard.tsx</div>
                </div>
                
                <div className="py-4 font-mono text-[11px] md:text-xs text-white/70 leading-loose overflow-x-auto">
                  {codeLines.map((line, idx) => {
                    const isConsoleLog = idx === 3;
                    const isRedundantIf = idx === 5 || idx === 6;
                    const isHighlighted = stage >= 3 && (isConsoleLog || isRedundantIf);
                    
                    let highlightClass = "px-6 border-l-2 border-transparent transition-colors duration-500";
                    if (isHighlighted && isConsoleLog) highlightClass = "px-6 border-l-2 border-[#ff5f56] bg-[#ff5f56]/10 text-white";
                    if (isHighlighted && isRedundantIf) highlightClass = "px-6 border-l-2 border-[#ffbd2e] bg-[#ffbd2e]/10 text-white";

                    return (
                      <div key={idx} className={`flex items-start ${highlightClass}`}>
                        <span className="w-6 shrink-0 text-white/20 select-none text-right pr-3">{idx + 1}</span>
                        <span className="whitespace-pre">{line}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
            
          </div>

          {/* Bottom Terminal Report Area */}
          <div className="border-t border-white/10 bg-[#111] p-6 lg:p-8 font-mono min-h-[220px] flex flex-col justify-center relative overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

            {stage < 4 ? (
               <div className="flex flex-col items-center justify-center text-center gap-4 text-terminal-green h-full relative z-10">
                  <div className="text-2xl animate-spin">⠋</div>
                  <div className="text-sm tracking-widest uppercase">
                    {stage === 0 && "01 / PARSING SOURCE CODE..."}
                    {stage === 1 && "02 / BUILDING ABSTRACT SYNTAX TREE..."}
                    {stage === 2 && "03 / ANALYZING STRUCTURAL NODES..."}
                    {stage === 3 && "04 / DETECTING ANTI-PATTERNS..."}
                  </div>
               </div>
            ) : (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-xs md:text-sm relative z-10 w-full max-w-3xl mx-auto"
               >
                  <div className="text-white font-bold mb-6 flex items-center gap-3 border-b border-white/10 pb-3">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f56]"></span>
                    SCAN COMPLETE — 2 ISSUES DETECTED
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    <div className="flex gap-4">
                      <div className="text-[#ff5f56] font-bold shrink-0">✖ [Leak]</div>
                      <div>
                        <div className="text-white/90 font-semibold mb-1">console.log detected in production artifact</div>
                        <div className="text-white/40 text-[11px] uppercase tracking-wider">UserCard.tsx:4</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="text-[#ffbd2e] font-bold shrink-0">⚠ [Logic]</div>
                      <div>
                        <div className="text-white/90 font-semibold mb-1">Redundant nested condition on guaranteed user object</div>
                        <div className="text-white/40 text-[11px] uppercase tracking-wider">UserCard.tsx:6-7</div>
                      </div>
                    </div>
                  </div>
               </motion.div>
            )}
          </div>
        </div>

        {/* Explanatory Caption */}
        <div className="mt-8 text-center max-w-2xl mx-auto">
          <p className="text-sm md:text-base text-white/60 font-mono leading-relaxed">
            <strong className="text-white">Understand the code, not just the text.</strong><br/>
            AntiSlop parses your source code into structured syntax, analyzes relevant nodes with targeted rules, and reports high-confidence code-quality issues. <span className="text-white/40">Static analysis runs locally. LLM remediation is a separate, optional step.</span>
          </p>
        </div>

      </div>
    </section>
  );
}
