"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import KineticCenterBuild from "@/components/ui/smoothui/kinetic-center-build";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const NAV_GROUPS = [
  {
    title: ["Getting Started", "Begin Journey"],
    links: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/quick-start", label: "Quick Start", planned: true },
    ],
  },
  {
    title: ["Using AntiSlop", "Core Tools"],
    links: [
      { href: "/docs/cli", label: "CLI Reference" },
      { href: "/docs/vscode", label: "VS Code Extension" },
      { href: "/docs/reports", label: "Reports", planned: true },
    ],
  },
  {
    title: ["Detection", "Rules Engine"],
    links: [
      { href: "/docs/rules", label: "Detection Rules", planned: true },
    ],
  },
  {
    title: ["Configuration", "Settings"],
    links: [
      { href: "/docs/configuration", label: "Configuration", planned: true },
    ],
  },
  {
    title: ["Auto-Fix", "Remediation"],
    links: [
      { href: "/docs/auto-fix", label: "Auto-Fix", planned: true },
    ],
  },
  {
    title: ["Help & Info", "Resources"],
    links: [
      { href: "/docs/security", label: "Privacy & Security" },
      { href: "/docs/troubleshooting", label: "Troubleshooting", planned: true },
      { href: "/docs/faq", label: "FAQ", planned: true },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-8 pb-12">
      {NAV_GROUPS.map((group, idx) => (
        <div key={idx}>
          <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
            <KineticCenterBuild phrases={group.title} interval={4000} className="!justify-start gap-1" />
          </div>
          <div className="flex flex-col gap-3 pl-4 border-l border-white/10 relative">
            {group.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.href} className="relative">
                  {isActive && (
                    <div className="absolute -left-[17px] top-0 h-full w-[2px] bg-terminal-green shadow-[0_0_8px_rgba(39,201,63,0.5)]"></div>
                  )}
                  <Link
                    href={link.href}
                    className={`font-mono text-[13px] relative group flex items-center ${
                      isActive ? "text-white font-bold" : "text-white/50 hover:text-white transition-colors"
                    }`}
                  >
                    {!isActive && <span className="absolute -left-[18px] opacity-0 group-hover:opacity-100 text-white/50 transition-opacity">{'>'}</span>}
                    <span className={!isActive ? "group-hover:translate-x-1 transition-transform" : ""}>{link.label}</span>
                    {link.planned && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[9px] text-white/30 uppercase tracking-wider">Planned</span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DocsMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setTimeout(() => setIsOpen(false), 0);
  }, [pathname]);

  return (
    <div className="md:hidden mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-4 py-3 bg-[#111] border border-white/10 rounded-lg text-white/80 font-mono text-sm"
      >
        <Menu size={16} /> Documentation Menu
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md pt-24 px-6 overflow-y-auto">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>
          <div className="max-w-md mx-auto">
            <DocsSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
