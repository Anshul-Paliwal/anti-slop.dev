import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Terminal, Copy, Monitor } from "lucide-react";
import KineticCenterBuild from "@/components/ui/smoothui/kinetic-center-build";

export const metadata = {
  title: "Installation | AntiSlop.dev",
  description: "Install Anti-Slop locally and configure your IDE.",
};

import InstallNavLinks from "@/components/InstallNavLinks";

export default function InstallPage() {
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
               <InstallNavLinks />
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              
              <div className="flex items-center gap-4 mb-6">
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/60 border border-white/10 uppercase tracking-widest">v1.0.0</div>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-10 tracking-tight flex items-end">
                Installation Guide<span className="w-[0.5em] h-[0.8em] bg-white ml-3 animate-pulse inline-block opacity-80 mb-1"></span>
              </h1>
              
              <section className="mb-20">
                <p className="text-base md:text-lg text-[#A3A3A3] font-mono leading-relaxed mb-16">
                  Get <span className="text-white font-bold relative inline-block group">Anti-Slop<span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 group-hover:bg-white transition-colors"></span></span> running on your local machine in under 30 seconds. Zero cloud dependencies, absolute privacy.
                </p>

                <div className="space-y-20">
                  <div id="cli" className="scroll-mt-32">
                    <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-4 flex items-center gap-4">
                      <span className="text-white/20 text-xl font-light select-none">01</span>
                      CLI Install
                    </h2>
                    <p className="text-sm md:text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
                      Install the binary globally using <span className="text-white font-bold border-b border-white/30 pb-0.5">npm</span>. This allows you to run <span className="text-white font-mono bg-white/10 px-1 rounded border border-white/10">antislop scan</span> anywhere.
                    </p>
                    
                    {/* Terminal Block */}
                    <div className="bg-[#111111] rounded-lg border border-white/10 overflow-hidden shadow-2xl group">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                        <div className="flex gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-black/20"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-black/20"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-black/20"></div>
                        </div>
                        <div className="text-[10px] text-white/40 font-mono flex items-center gap-2 select-none uppercase tracking-widest">
                          <Terminal size={12} /> bash
                        </div>
                        <div className="w-12"></div> {/* Spacer */}
                      </div>
                      <div className="p-5 font-mono text-white/90 flex justify-between items-start text-sm">
                        <div>
                          <span className="text-white/40 mr-3 select-none">$</span>npm install -g @antislop/cli
                        </div>
                        <button className="text-white/20 hover:text-white/80 transition-colors opacity-0 group-hover:opacity-100" title="Copy to clipboard">
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Separator */}
                  <div className="w-full flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-white/20 rounded-sm rotate-45"></div>
                    <div className="flex-1 h-px border-t border-dashed border-white/20"></div>
                  </div>

                  <div id="ide" className="scroll-mt-32">
                    <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-4 flex items-center gap-4">
                      <span className="text-white/20 text-xl font-light select-none">02</span>
                      IDE Integrations
                    </h2>
                    <p className="text-sm md:text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
                      Get real-time squiggles and auto-fixes in your editor. Currently supporting <span className="text-white font-bold border-b border-white/30 pb-0.5">VS Code</span> and Cursor.
                    </p>
                    
                    <div className="bg-[#111111] p-6 rounded-lg border border-white/10 shadow-2xl">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2"><Monitor size={18} /> VS Code Extension</h3>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-black bg-white px-2 py-0.5 rounded">Recommended</span>
                        </div>
                        <p className="text-sm text-white/50 font-mono">
                          Search for &quot;AntiSlop&quot; in the Extensions Marketplace or install via command line:
                        </p>
                        <div className="mt-2 p-4 bg-black rounded border border-white/10 font-mono text-sm text-white/70 flex justify-between group">
                          <div><span className="text-white/30 mr-2 select-none">$</span>code --install-extension antislop.vscode</div>
                          <button className="text-white/20 hover:text-white/80 transition-colors opacity-0 group-hover:opacity-100" title="Copy">
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Separator */}
                  <div className="w-full flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-white/20 rounded-sm rotate-45"></div>
                    <div className="flex-1 h-px border-t border-dashed border-white/20"></div>
                  </div>

                  <div id="hooks" className="scroll-mt-32">
                    <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-4 flex items-center gap-4">
                      <span className="text-white/20 text-xl font-light select-none">03</span>
                      Git Hooks
                    </h2>
                    <p className="text-sm md:text-base text-[#A3A3A3] font-mono leading-relaxed mb-6">
                      Prevent slop from ever entering your codebase by catching it at commit time using <span className="text-white font-bold border-b border-white/30 pb-0.5">Husky</span>.
                    </p>
                    
                    {/* Code Block */}
                    <div className="bg-[#111111] rounded-lg border border-white/10 overflow-hidden shadow-2xl group relative">
                      <div className="absolute top-3 right-3 text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded border border-white/10 select-none">bash</div>
                      <button className="absolute bottom-3 right-3 text-white/20 hover:text-white/80 transition-colors opacity-0 group-hover:opacity-100 bg-[#111] p-1.5 rounded border border-white/10" title="Copy to clipboard">
                          <Copy size={14} />
                      </button>
                      <div className="p-5 font-mono text-white/70 overflow-x-auto text-xs md:text-sm">
<pre className="leading-relaxed"><code dangerouslySetInnerHTML={{ __html: `<span class="text-white/40"># .husky/pre-commit</span>\nnpx antislop scan --staged` }} /></pre>
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
