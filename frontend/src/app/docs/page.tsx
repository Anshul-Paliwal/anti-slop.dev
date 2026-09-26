import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DigitalNightBackground from "@/components/DigitalNightBackground";
import { Terminal, Book, Code, Settings, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const metadata = {
  title: "Documentation | AntiSlop.dev",
  description: "Official documentation for Anti-Slop AST purification.",
};

const DocsNavLinks = () => (
  <>
    <div className="text-[#F5F5F4] font-bold mb-2 uppercase tracking-widest text-[10px]">Getting Started</div>
    <a href="#intro" className="text-terminal-green hover:underline">Introduction</a>
    <a href="#" className="text-muted-foreground hover:text-[#F5F5F4] transition-colors">Core Concepts</a>
    <a href="#" className="text-muted-foreground hover:text-[#F5F5F4] transition-colors">Architecture</a>
    
    <div className="text-[#F5F5F4] font-bold mt-6 mb-2 uppercase tracking-widest text-[10px]">Configuration</div>
    <a href="#antislop-json" className="text-muted-foreground hover:text-[#F5F5F4] transition-colors">antislop.json</a>
    <a href="#" className="text-muted-foreground hover:text-[#F5F5F4] transition-colors">Custom Rule Trees</a>
    <a href="#" className="text-muted-foreground hover:text-[#F5F5F4] transition-colors">.antislopignore</a>
  </>
);

export default function DocsPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background bg-grain selection:bg-terminal-green/30 selection:text-terminal-green overflow-hidden">
      <DigitalNightBackground />
      <Navbar />
      
      <main className="flex-1 z-10 relative pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-16 border-b border-white/10 pb-8">
            <div className="inline-flex items-center text-muted-foreground font-mono text-sm mb-4">
              ../Docs/Overview..
              <span className="inline-block w-2 h-[1em] bg-muted-foreground ml-1 align-middle animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#F5F5F4] tracking-tight">
              Documentation
            </h1>
            <p className="text-terminal-green font-mono mt-4 text-lg">
              {">"} Everything you need to integrate and configure Anti-Slop.
            </p>
          </div>

          {/* Docs Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Mobile Sheet Trigger (Visible only on small screens) */}
            <div className="md:hidden col-span-1 flex items-center justify-between border border-white/10 p-4 rounded-xl bg-black/40">
              <span className="font-mono text-sm text-[#F5F5F4]">Table of Contents</span>
              <Sheet>
                <SheetTrigger className="p-2 border border-white/10 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                  <Menu size={20} className="text-white" />
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#0A0A0B]/95 backdrop-blur-xl border-r border-white/10 text-white font-mono p-6 sm:max-w-[300px]">
                  <SheetHeader className="text-left mb-8 border-b border-white/10 pb-4">
                    <SheetTitle className="font-heading text-xl text-[#F5F5F4]">Navigation</SheetTitle>
                    <SheetDescription className="text-muted-foreground text-xs hidden">
                      Docs navigation menu
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-4">
                    <DocsNavLinks />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Sidebar Navigation */}
            <div className="col-span-1 hidden md:flex flex-col gap-4 font-mono text-sm border-l border-white/10 pl-6 h-fit sticky top-32">
              <DocsNavLinks />
            </div>

            {/* Main Content Area */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-12 -mt-4 md:mt-0">
              
              {/* Section 1 */}
              <section id="intro" className="bg-[#0A0A0B]/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl hover:border-terminal-green/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <Book className="text-terminal-green w-6 h-6" />
                  <h2 className="text-2xl font-bold text-[#F5F5F4]">Introduction</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed font-sans mb-6">
                  Anti-Slop analyzes your codebase by generating Abstract Syntax Trees (ASTs) in real time. It identifies patterns commonly produced by LLMs that introduce bloat, redundant abstractions, or logical errors.
                </p>
                <div className="bg-black/50 p-5 rounded-xl border border-white/5 font-mono text-sm text-white/80 overflow-x-auto shadow-inner">
                  <div className="text-terminal-green/50 mb-2"># Example Output</div>
                  <div className="mb-2"><span className="text-terminal-green">$</span> antislop scan ./src</div>
                  <div className="text-muted-foreground">Scanning 142 files...</div>
                  <div className="text-red-400 mt-3">⨯ [React Anti-Pattern] src/components/List.tsx:42</div>
                  <div className="text-muted-foreground">  Missing memoization on heavy computation</div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="antislop-json" className="bg-[#0A0A0B]/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl hover:border-terminal-green/30 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="text-terminal-green w-6 h-6" />
                  <h2 className="text-2xl font-bold text-[#F5F5F4]">Configuration</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed font-sans mb-6">
                  Configure Anti-Slop by creating an <code className="text-[#F5F5F4] font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded border border-white/20">antislop.json</code> file in your project root.
                </p>
                <div className="bg-black/50 p-5 rounded-xl border border-white/5 font-mono text-sm text-terminal-green/90 overflow-x-auto shadow-inner">
                  <pre>
{`{
  "strictMode": true,
  "ignoreDirs": ["node_modules", ".next"],
  "rules": {
    "react-hooks": "error",
    "tailwind-conflicts": "warn",
    "dead-code": "error"
  }
}`}
                  </pre>
                </div>
              </section>

            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
