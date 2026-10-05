import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KineticCenterBuild from "@/components/ui/smoothui/kinetic-center-build";

export const metadata = {
  title: "About | AntiSlop.dev",
  description: "Learn more about the Anti-Slop AST purification tool.",
};

import AboutNavLinks from "@/components/AboutNavLinks";

export default function AboutPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0a] selection:bg-white/20 selection:text-white">
      {/* Subtle Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', 
        backgroundSize: '24px 24px' 
      }}></div>
      
      <div className="z-10 relative">
        <Navbar />
        
        <main className="flex-1 relative pt-32 pb-32 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24">
            
            {/* Sidebar Navigation */}
            <div className="hidden md:block w-48 shrink-0">
               <AboutNavLinks />
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              
              <div className="flex items-center gap-4 mb-6">
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/60 border border-white/10 uppercase tracking-widest">Company</div>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-10 tracking-tight flex items-end">
                About Anti-Slop<span className="w-[0.5em] h-[0.8em] bg-white ml-3 animate-pulse inline-block opacity-80 mb-1"></span>
              </h1>
              
              <section className="mb-20">
                <div className="space-y-20">
                  <div id="mission" className="scroll-mt-32">
                    <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-4 flex items-center gap-4">
                      <span className="text-white/20 text-xl font-light select-none">01</span>
                      Mission
                    </h2>
                    <p className="text-sm md:text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
                      AI is changing how we write code, but it&apos;s also producing an unprecedented amount of <span className="text-white font-bold border-b border-white/30 pb-0.5">slop</span>—needless abstractions, trivial memos, and redundant layers. We&apos;re building tools to automatically purge this cruft, keeping codebases human-readable and mathematically minimal.
                    </p>
                    <div className="bg-[#111111] p-6 rounded-lg border border-white/10 shadow-2xl font-mono text-white/70 italic text-sm">
                      &quot;The best code is no code at all. The second best code is purified AST.&quot;
                    </div>
                  </div>

                  {/* Section Separator */}
                  <div className="w-full flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-white/20 rounded-sm rotate-45"></div>
                    <div className="flex-1 h-px border-t border-dashed border-white/20"></div>
                  </div>

                  <div id="swot" className="scroll-mt-32">
                    <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-4 flex items-center gap-4">
                      <span className="text-white/20 text-xl font-light select-none">02</span>
                      SWOT Analysis
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      {/* Strengths */}
                      <div className="bg-[#111111] p-6 rounded-lg border border-white/10 hover:border-white/30 transition-colors group">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><span className="text-[#27c93f] group-hover:text-white transition-colors">[S]</span> Strengths</h3>
                        <ul className="text-sm text-[#A3A3A3] font-mono space-y-2">
                          <li>- 100% deterministic AST parsing</li>
                          <li>- Zero cloud dependencies</li>
                          <li>- Sub-millisecond execution time</li>
                        </ul>
                      </div>
                      
                      {/* Weaknesses */}
                      <div className="bg-[#111111] p-6 rounded-lg border border-white/10 hover:border-white/30 transition-colors group">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><span className="text-[#ff5f56] group-hover:text-white transition-colors">[W]</span> Weaknesses</h3>
                        <ul className="text-sm text-[#A3A3A3] font-mono space-y-2">
                          <li>- High learning curve for custom rules</li>
                          <li>- False positives on extreme edge cases</li>
                          <li>- Only supports JS/TS currently</li>
                        </ul>
                      </div>

                      {/* Opportunities */}
                      <div className="bg-[#111111] p-6 rounded-lg border border-white/10 hover:border-white/30 transition-colors group">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><span className="text-[#ffbd2e] group-hover:text-white transition-colors">[O]</span> Opportunities</h3>
                        <ul className="text-sm text-[#A3A3A3] font-mono space-y-2">
                          <li>- Enterprise pipeline integration</li>
                          <li>- Expansion to Python / Go / Rust</li>
                          <li>- Real-time pair-programming bots</li>
                        </ul>
                      </div>

                      {/* Threats */}
                      <div className="bg-[#111111] p-6 rounded-lg border border-white/10 hover:border-white/30 transition-colors group">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><span className="text-white/40 group-hover:text-white transition-colors">[T]</span> Threats</h3>
                        <ul className="text-sm text-[#A3A3A3] font-mono space-y-2">
                          <li>- LLMs eventually generating perfect code</li>
                          <li>- Native linter implementations</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Section Separator */}
                  <div className="w-full flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-white/20 rounded-sm rotate-45"></div>
                    <div className="flex-1 h-px border-t border-dashed border-white/20"></div>
                  </div>

                  <div id="team" className="scroll-mt-32">
                    <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-4 flex items-center gap-4">
                      <span className="text-white/20 text-xl font-light select-none">03</span>
                      The Team
                    </h2>
                    <p className="text-sm md:text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
                      We are a group of compiler engineers and designers obsessed with syntax purity and architectural minimalism.
                    </p>
                    
                    <div className="bg-[#111111] p-6 rounded-lg border border-white/10 shadow-2xl flex gap-6 items-center">
                       <div className="w-16 h-16 rounded bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center font-bold text-xl text-white/50">
                         AS
                       </div>
                       <div>
                         <h3 className="font-bold text-white font-mono text-sm md:text-base">Anonymous Syndication</h3>
                         <p className="text-xs md:text-sm text-[#A3A3A3] font-mono mt-1">Core Maintainers</p>
                         <p className="text-xs text-white/40 mt-3 font-mono">contact@antislop.dev</p>
                       </div>
                    </div>
                  </div>

                </div>
              </section>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
