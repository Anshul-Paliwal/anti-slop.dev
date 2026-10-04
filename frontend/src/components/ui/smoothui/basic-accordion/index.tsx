"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const CHEVRON_ROTATION_DEGREES = 180;
const CHEVRON_ANIMATION_DURATION = 0.2;

export interface AccordionItem {
  content: React.ReactNode;
  id: string | number;
  title: string;
}

export interface BasicAccordionProps {
  allowMultiple?: boolean;
  className?: string;
  defaultExpandedIds?: Array<string | number>;
  items: AccordionItem[];
}

export default function BasicAccordion({
  items,
  allowMultiple = false,
  className = "",
  defaultExpandedIds = [],
}: BasicAccordionProps) {
  const [expandedItems, setExpandedItems] =
    useState<Array<string | number>>(defaultExpandedIds);
  const shouldReduceMotion = useReducedMotion();

  const toggleItem = (id: string | number) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((item) => item !== id));
    } else if (allowMultiple) {
      setExpandedItems([...expandedItems, id]);
    } else {
      setExpandedItems([id]);
    }
  };

  return (
    <div
      className={`flex w-full flex-col overflow-hidden space-y-2 ${className}`}
    >
      {items.map((item) => {
        const isExpanded = expandedItems.includes(item.id);

        return (
          <div className="overflow-hidden group rounded-lg border border-white/10 bg-[#111]" key={item.id}>
            <button
              aria-controls={`accordion-content-${item.id}`}
              aria-expanded={isExpanded}
              className={`flex min-h-[50px] w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors bg-[#111] hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-terminal-green ${isExpanded ? "border-b border-white/10" : ""}`}
              id={`accordion-header-${item.id}`}
              onClick={() => toggleItem(item.id)}
              type="button"
            >
              <h3 className="font-mono font-bold text-sm sm:text-base flex items-start gap-3">
                <span className="text-terminal-green/50 select-none">Q.</span>
                <span className={isExpanded ? "text-white" : "text-white/80 group-hover:text-white"}>{item.title}</span>
              </h3>
              <motion.div
                animate={{ rotate: isExpanded ? CHEVRON_ROTATION_DEGREES : 0 }}
                className={`shrink-0 transition-colors ${isExpanded ? "text-terminal-green" : "text-muted-foreground group-hover:text-foreground"}`}
                transition={{
                  duration: shouldReduceMotion ? 0 : CHEVRON_ANIMATION_DURATION,
                }}
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </button>

            <motion.div
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              aria-labelledby={`accordion-header-${item.id}`}
              className="overflow-hidden"
              id={`accordion-content-${item.id}`}
              inert={!isExpanded}
              initial={false}
              role="region"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      height: {
                        damping: 38,
                        duration: 0.28,
                        stiffness: 450,
                        type: "spring" as const,
                      },
                      opacity: { duration: 0.22 },
                    }
              }
            >
              <div className="bg-[#0a0a0a] px-5 py-5 text-sm text-[#A3A3A3] font-mono leading-relaxed pl-12 border-t border-transparent">
                {item.content}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
