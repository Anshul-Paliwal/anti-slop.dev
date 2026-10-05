"use client";

import { useEffect, useState } from "react";
import KineticCenterBuild from "@/components/ui/smoothui/kinetic-center-build";

export default function AboutNavLinks() {
  const [activeSection, setActiveSection] = useState("mission");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["mission", "swot", "team"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "mission", label: "Mission" },
    { id: "swot", label: "SWOT Analysis" },
    { id: "team", label: "The Team" },
  ];

  return (
    <div className="flex flex-col gap-8 sticky top-32">
      <div>
        <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
          <KineticCenterBuild phrases={["About Us", "Our Mission", "The Collective"]} interval={4000} className="!justify-start gap-1" />
        </div>
        <div className="flex flex-col gap-3 pl-4 border-l border-white/10 relative">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <div key={item.id} className="relative">
                {isActive && (
                  <div className="absolute -left-[17px] top-0 h-full w-[2px] bg-terminal-green shadow-[0_0_8px_rgba(39,201,63,0.5)]"></div>
                )}
                <a
                  href={`#${item.id}`}
                  className={`font-mono text-[13px] relative group flex items-center ${
                    isActive ? "text-white font-bold" : "text-white/50 hover:text-white transition-colors"
                  }`}
                >
                  {!isActive && <span className="absolute -left-[18px] opacity-0 group-hover:opacity-100 text-white/50 transition-opacity">{'>'}</span>}
                  <span className={!isActive ? "group-hover:translate-x-1 transition-transform" : ""}>{item.label}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
