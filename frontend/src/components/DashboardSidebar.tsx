"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  TerminalSquare, 
  Settings, 
  ShieldAlert, 
  CreditCard,
  LogOut,
  FolderGit2
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
    { name: "Scan Reports", href: "/dashboard/reports", icon: ShieldAlert },
    { name: "CLI Access", href: "/dashboard/cli", icon: TerminalSquare },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0f0f13] flex flex-col z-20 shrink-0">
      <div className="h-16 border-b border-white/10 flex items-center px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center text-background font-mono text-[10px] font-bold">
            {">_"}
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-white">AntiSlop</span>
        </Link>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4 px-2">Menu</div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={18} className={`transition-colors ${
                  isActive ? "text-terminal-green" : "text-white/40 group-hover:text-terminal-green"
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-terminal-green/20 border border-terminal-green/50 flex items-center justify-center text-terminal-green font-mono text-xs font-bold">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-medium text-white truncate">Jane Doe</div>
            <div className="text-xs text-white/40 truncate font-mono">Pro Plan</div>
          </div>
        </div>
        <Link href="/login" className="w-full flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm font-medium text-[#ff5f56]/70 hover:text-[#ff5f56] hover:bg-[#ff5f56]/10 transition-all">
          <LogOut size={18} />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
