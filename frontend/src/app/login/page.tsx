import Navbar from "@/components/Navbar";

import Link from "next/link";
import { Terminal, GitBranch } from "lucide-react";

export const metadata = {
  title: "Log In | AntiSlop.dev",
  description: "Log in to your Anti-Slop dashboard.",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0a0a0a] selection:bg-terminal-green/20 selection:text-terminal-green">
      {/* Subtle Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', 
        backgroundSize: '24px 24px' 
      }}></div>
      
      <div className="z-10 relative flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 relative flex items-center justify-center pt-32 pb-24 px-6">
          <div className="w-full max-w-md">
            
            <div className="bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-black/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-black/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-black/20"></div>
                </div>
                <div className="text-[10px] text-white/40 font-mono flex items-center gap-2 select-none uppercase tracking-widest">
                  <Terminal size={12} /> auth_session
                </div>
                <div className="w-12"></div> {/* Spacer */}
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-mono font-bold text-white mb-2">Welcome Back</h1>
                  <p className="text-sm text-white/50 font-mono">Authenticate to access your dashboard</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-white/70 uppercase tracking-wider block">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="dev@example.com"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-terminal-green/50 focus:ring-1 focus:ring-terminal-green/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-white/70 uppercase tracking-wider block">Password</label>
                      <a href="#" className="text-xs font-mono text-terminal-green hover:underline">Forgot?</a>
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-terminal-green/50 focus:ring-1 focus:ring-terminal-green/50 transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/90 font-mono font-bold text-sm py-3 rounded-lg transition-colors mt-2"
                  >
                    Initialize Session
                  </button>
                </div>

                <div className="flex items-center gap-4 my-6">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Or</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <button className="w-full bg-[#111] hover:bg-[#1a1a1a] border border-white/10 text-white font-mono text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-3">
                  <GitBranch size={18} />
                  Continue with GitHub
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm font-mono text-white/50">
                Don&apos;t have an account? <Link href="/signup" className="text-white hover:text-terminal-green transition-colors">Register here</Link>.
              </p>
            </div>

          </div>
        </main>
        

      </div>
    </div>
  );
}
