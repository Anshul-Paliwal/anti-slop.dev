import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";

export const metadata = {
  title: "Dashboard | AntiSlop.dev",
  description: "Manage your Anti-Slop configuration and view scan reports.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-screen bg-[#0a0a0a] selection:bg-terminal-green/20 selection:text-terminal-green overflow-hidden">
      
      {/* Sidebar Component */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        {/* Subtle Blueprint Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', 
          backgroundSize: '24px 24px' 
        }}></div>

        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
          <div className="font-mono text-xs text-white/50 tracking-widest uppercase">
             ../dashboard/overview
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"></span>
              <span className="text-terminal-green">API Connected</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 z-10 relative">
          {children}
        </div>
      </main>

    </div>
  );
}
