"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Check, Terminal, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { siNpm } from "simple-icons";

export default function InstallRow() {
  const [copied, setCopied] = useState(false);
  const command = "npm i -g antislop";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full py-12 md:py-16 px-6 flex flex-col items-center justify-center z-10 relative" id="install">
      {/* Compact Glassmorphic Installation Card */}
      <div className="relative max-w-4xl w-full rounded-2xl border border-white/10 bg-[#0C0C0F]/80 backdrop-blur-xl p-8 sm:p-10 overflow-hidden shadow-2xl">
        {/* Subtle Ambient Top Accent Glow */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-terminal-green/40 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-terminal-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Left Column: Heading & Subtitle */}
          <div className="flex flex-col text-center lg:text-left items-center lg:items-start max-w-md">
            <div className="inline-flex items-center text-muted-foreground font-mono text-xs mb-3">
              ../Install/Quick_Start../
              <motion.span
                animate={{ opacity: [1, 1, 0, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="inline-block w-1.5 h-[1em] bg-terminal-green ml-1 align-middle"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground tracking-tight">
              Ready to clean up?
            </h2>
            <p className="text-muted-foreground text-sm font-sans mt-2">
              Zero configuration required. Install the IDE extension or purge slop directly from your terminal.
            </p>
          </div>

          {/* Right Column: Interactive Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            
            {/* VS Code Extension Button */}
            <motion.a
              href="https://marketplace.visualstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-3 px-6 h-12 w-full sm:w-auto rounded-xl bg-foreground text-background font-semibold text-sm transition-all duration-200 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current transition-colors"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
              </svg>
              <span>VS Code Extension</span>
              <ArrowRight className="w-3.5 h-3.5 text-background/70 group-hover:translate-x-0.5 transition-transform" />
            </motion.a>

            {/* CLI Command Copy Box */}
            <div className="flex items-center justify-between gap-3 px-4 h-12 w-full sm:w-auto rounded-xl border border-white/10 bg-[#141418] hover:border-white/20 transition-all font-mono text-xs text-foreground/90">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-terminal-green" />
                <span className="text-white/80">{command}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all ml-2"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-terminal-green" />
                    <span className="text-terminal-green text-[11px] font-sans font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-sans">Copy</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
