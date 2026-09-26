import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DigitalNightBackground from "@/components/DigitalNightBackground";
import InstallRow from "@/components/InstallRow";
import { CheckCircle2, Monitor } from "lucide-react";

export const metadata = {
  title: "Installation | AntiSlop.dev",
  description: "Install Anti-Slop locally and configure your IDE.",
};

export default function InstallPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background bg-grain selection:bg-terminal-green/30 selection:text-terminal-green overflow-hidden">
      <DigitalNightBackground />
      <Navbar />
      
      <main className="flex-1 z-10 relative pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          
          {/* Header */}
          <div className="text-center md:text-left border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#F5F5F4] tracking-tight mb-4">
              Installation Guide
            </h1>
            <p className="text-muted-foreground font-mono text-sm md:text-base max-w-2xl">
              Get Anti-Slop running on your local machine in under 30 seconds. Zero cloud dependencies, absolute privacy.
            </p>
          </div>

          {/* Primary CLI Install (Re-using component) */}
          <div className="-mx-6">
            <InstallRow />
          </div>

          {/* IDE Integrations */}
          <section className="bg-[#0A0A0B]/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
              <Monitor className="text-terminal-green w-6 h-6" />
              <h2 className="text-2xl font-bold text-[#F5F5F4]">IDE Integrations</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* VS Code */}
              <div className="flex flex-col gap-4 p-6 rounded-xl border border-white/5 bg-black/40">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#F5F5F4]">VS Code / Cursor</h3>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-terminal-green px-2 py-1 bg-terminal-green/10 rounded">Recommended</span>
                </div>
                <p className="text-sm text-muted-foreground font-sans">
                  The official extension provides inline squiggles, auto-fixes on save, and hover diagnostics.
                </p>
                <div className="mt-auto pt-4 flex flex-col gap-2 font-mono text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-terminal-green" /> Search for "AntiSlop" in Extensions
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-terminal-green" /> Click Install
                  </div>
                </div>
              </div>

              {/* CLI Global */}
              <div className="flex flex-col gap-4 p-6 rounded-xl border border-white/5 bg-black/40">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#F5F5F4]">Pre-commit Hook</h3>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-white/40 px-2 py-1 bg-white/5 rounded">Husky</span>
                </div>
                <p className="text-sm text-muted-foreground font-sans">
                  Prevent slop from ever entering your codebase by catching it at commit time.
                </p>
                <div className="mt-auto pt-4 bg-black p-3 rounded border border-white/10 font-mono text-xs overflow-x-auto">
                  <div className="text-terminal-green/50 mb-1">// .husky/pre-commit</div>
                  <div className="text-white/80">npx antislop scan --staged</div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
