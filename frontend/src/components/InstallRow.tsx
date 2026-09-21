"use client";

import { motion } from "framer-motion";
import { siNpm } from "simple-icons";

export default function InstallRow() {
  return (
    <section className="w-full py-24 md:py-32 px-6 flex flex-col items-center justify-center z-10 relative">
      {/* Terminal Header */}
      <div className="w-full text-center mb-8">
        <div className="inline-flex items-center text-muted-foreground font-mono text-sm mb-4">
          ../Install/Get_Started../
          <motion.span
            animate={{ opacity: [1, 1, 0, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="inline-block w-2 h-[1em] bg-muted-foreground ml-1 align-middle"
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight">
          Ready to clean up?
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        
        {/* VS Code Extension Button */}
        <motion.a
          href="#vscode"
          className="group relative flex items-center gap-3 px-8 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-terminal-green/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(57,255,136,0.15)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-[#007ACC] group-hover:fill-terminal-green transition-colors duration-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
          </svg>
          <span className="font-semibold text-foreground">VS Code Extension</span>
        </motion.a>

        {/* NPM Package Button */}
        <motion.a
          href="#npm"
          className="group relative flex items-center gap-3 px-8 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-terminal-green/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(57,255,136,0.15)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            className="w-8 h-8 fill-[#CB3837] group-hover:fill-terminal-green transition-colors duration-300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={siNpm.path} />
          </svg>
          <span className="font-semibold text-foreground">Npm Package</span>
        </motion.a>

      </div>
    </section>
  );
}
