'use client';

import React, { useState } from 'react';
import { Book, Code, Settings, Shield } from "lucide-react";

const FOLDER_DATA = [
  { 
    id: 'intro', 
    labelLeft: 'CE III', 
    labelRight: '19 special', 
    title: 'Final Stage', 
    subtitle: 'The whole purpose of education is to turn mirrors into windows',
    icon: <Book className="w-8 h-8 text-white mb-2 opacity-80" />,
    content: (
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <p className="text-white/60 mb-6 font-sans">
          Anti-Slop analyzes your codebase by generating Abstract Syntax Trees (ASTs) in real time. It identifies patterns commonly produced by LLMs that introduce bloat, redundant abstractions, or logical errors.
        </p>
        <div className="bg-black/50 p-4 rounded-xl border border-white/20 font-mono text-sm text-left w-full shadow-inner">
          <div className="text-terminal-green/50 mb-2"># Example Output</div>
          <div className="mb-2"><span className="text-terminal-green">$</span> antislop scan ./src</div>
          <div className="text-muted-foreground">Scanning 142 files...</div>
          <div className="text-red-400 mt-2">⨯ [React Anti-Pattern] src/components/List.tsx:42</div>
        </div>
      </div>
    )
  },
  { 
    id: 'core', 
    labelLeft: 'SL II', 
    labelRight: '16 middle', 
    title: 'Core Concepts', 
    subtitle: 'Understanding the Abstract Syntax Trees and purification process.',
    icon: <Code className="w-8 h-8 text-white mb-2 opacity-80" />,
    content: (
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <p className="text-white/60 mb-6 font-sans">
          Our parser builds a unified AST from your source files. The purifier then traverses the tree, matching nodes against known slop patterns and applying transformations.
        </p>
      </div>
    )
  },
  { 
    id: 'config', 
    labelLeft: 'KN I', 
    labelRight: '11 initial', 
    title: 'Configuration', 
    subtitle: 'Set up your antislop.json to tailor the rules.',
    icon: <Settings className="w-8 h-8 text-white mb-2 opacity-80" />,
    content: (
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <p className="text-white/60 mb-6 font-sans">
          Create an antislop.json file in your project root to configure rule strictness and ignore paths.
        </p>
        <div className="bg-black/50 p-4 rounded-xl border border-white/20 font-mono text-sm text-left w-full shadow-inner">
<pre className="text-terminal-green/90">
{`{
  "strictMode": true,
  "ignoreDirs": ["node_modules", ".next"],
  "rules": {
    "react-hooks": "error",
    "tailwind-conflicts": "warn"
  }
}`}
</pre>
        </div>
      </div>
    )
  },
  { 
    id: 'rules', 
    labelLeft: 'RL X', 
    labelRight: '07 senior', 
    title: 'Custom Rules', 
    subtitle: 'Build your own rule trees for specific architectural needs.',
    icon: <Shield className="w-8 h-8 text-white mb-2 opacity-80" />,
    content: (
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <p className="text-white/60 mb-6 font-sans">
          You can define custom rule sets using our Query Language to target specific AST node patterns unique to your organization&apos;s style guide.
        </p>
      </div>
    )
  },
];

export default function FolderDocs() {
  const [activeId, setActiveId] = useState('intro');
  const activeIndex = FOLDER_DATA.findIndex(f => f.id === activeId);

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 select-none relative pb-32">
      {/* Container for the stacked folders */}
      <div className="relative h-[700px] w-full flex flex-col justify-start items-center">
        
        {FOLDER_DATA.map((folder, index) => {
          const isActive = index === activeIndex;
          
          // Layout calculations
          const zIndex = isActive ? 50 : (FOLDER_DATA.length - index);
          // When active, it moves up. When inactive, it stacks downwards.
          const topOffset = index * 40; 
          
          return (
            <div
              key={folder.id}
              className={`absolute left-1/2 -translate-x-1/2 w-full max-w-4xl transition-all duration-700 ease-out cursor-pointer`}
              style={{
                top: `${topOffset}px`,
                zIndex,
                transform: `translateX(-50%) ${isActive ? 'translateY(-20px)' : 'translateY(0)'}`,
              }}
              onClick={() => setActiveId(folder.id)}
            >
              
              {/* Tabs Container */}
              <div className="relative w-full h-12 flex justify-between px-12 z-20">
                {/* Left Tab */}
                <div 
                  className={`relative h-10 px-8 flex items-center justify-center border-t border-l border-r rounded-t-xl transition-colors duration-300
                    ${isActive ? 'bg-black border-white text-white' : 'bg-[#0a0a0a] border-white/30 text-white/50 hover:bg-[#111] hover:text-white/80'}
                  `}
                  style={{
                    borderBottom: 'none',
                    transform: 'perspective(100px) rotateX(10deg)',
                    transformOrigin: 'bottom',
                    marginBottom: '-2px'
                  }}
                >
                  <span className="font-mono font-bold text-sm" style={{ transform: 'perspective(100px) rotateX(-10deg)' }}>
                    {folder.labelLeft}
                  </span>
                </div>

                {/* Right Tab */}
                <div 
                  className={`relative h-10 px-8 flex items-center justify-center border-t border-l border-r rounded-t-xl transition-colors duration-300
                    ${isActive ? 'bg-black border-white text-white' : 'bg-[#0a0a0a] border-white/30 text-white/50 hover:bg-[#111] hover:text-white/80'}
                  `}
                  style={{
                    borderBottom: 'none',
                    transform: 'perspective(100px) rotateX(10deg)',
                    transformOrigin: 'bottom',
                    marginBottom: '-2px'
                  }}
                >
                  <span className="font-mono text-sm" style={{ transform: 'perspective(100px) rotateX(-10deg)' }}>
                    {folder.labelRight}
                  </span>
                </div>
              </div>

              {/* Folder Body */}
              <div 
                className={`w-full bg-black rounded-b-xl rounded-t-sm pt-12 pb-16 px-12 transition-all duration-500
                  ${isActive ? 'border-2 border-white shadow-[0_0_50px_rgba(255,255,255,0.05)]' : 'border border-white/30'}
                `}
                style={{
                  minHeight: '400px'
                }}
              >
                 <div className={`transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex flex-col items-center mt-4">
                      {folder.icon}
                      <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{folder.title}</h3>
                      <p className="text-white/40 text-sm mb-12">{folder.subtitle}</p>
                      
                      <div className="w-full">
                        {folder.content}
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          )
        })}
        
        {/* Front Folder Lip / Cover */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-[105%] max-w-[50rem] h-48 bg-[#050505] border-t-2 border-white rounded-t-xl rounded-b-3xl z-[60] flex items-center justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
          style={{ top: `${FOLDER_DATA.length * 40 + 350}px` }}
        >
           {/* Logo or text on the front folder */}
           <div className="flex items-center gap-3 opacity-90 mt-8">
              <div className="w-6 h-6 border-2 border-white rounded-md flex items-center justify-center">
                 <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              </div>
              <span className="text-white font-semibold tracking-wider text-lg">antislop designer®</span>
           </div>
        </div>

      </div>
    </div>
  );
}
