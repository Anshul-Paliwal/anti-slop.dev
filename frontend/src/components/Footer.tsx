import Link from "next/link";
import { siGithub, siX, siDiscord } from "simple-icons";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-md mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="inline-flex items-center text-muted-foreground font-mono text-sm mb-6">
              ../System/Footer../
              <span className="inline-block w-2 h-[1em] bg-muted-foreground ml-1 align-middle animate-pulse" />
            </div>
            <br />
            <Link href="/" className="flex items-center gap-3 mb-6 inline-flex">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background font-mono text-sm font-bold">
                {">_"}
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">AntiSlop.dev</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Detects and auto-fixes the bad patterns your AI coding agent leaves behind. Ship clean code, always.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a href="#" className="text-muted-foreground hover:text-terminal-green transition-colors group">
                <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d={siGithub.path} />
                </svg>
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-terminal-green transition-colors group">
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d={siX.path} />
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-terminal-green transition-colors group">
                <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d={siDiscord.path} />
                </svg>
                <span className="sr-only">Discord</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-sm font-semibold text-foreground tracking-wider mb-2">Product</h4>
            <Link href="#" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">VS Code Extension</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">CLI Tool</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Pro Tier</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Changelog</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-sm font-semibold text-foreground tracking-wider mb-2">Legal</h4>
            <Link href="#" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Contact</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-terminal-green transition-colors">Security</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4 relative z-10">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AntiSlop.dev. All rights reserved.
          </p>
        </div>
      </div>

      {/* Massive Watermark - Edge to Edge */}
      <div className="w-full relative flex justify-center overflow-hidden pointer-events-auto select-none mt-0">
        <div className="text-[18vw] md:text-[19vw] lg:text-[20vw] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.07] to-transparent transition-colors duration-700 ease-out hover:from-white/[0.15] cursor-default">
          AntiSlop
        </div>
      </div>
    </footer>
  );
}
