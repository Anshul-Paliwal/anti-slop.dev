"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
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
      className={`flex w-full flex-col divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D11]/80 backdrop-blur-xl shadow-2xl ${className}`}
    >
      {items.map((item) => {
        const isExpanded = expandedItems.includes(item.id);

        return (
          <div className="overflow-hidden group" key={item.id}>
            <button
              aria-controls={`accordion-content-${item.id}`}
              aria-expanded={isExpanded}
              className="flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-4 px-6 py-4.5 text-left transition-colors bg-[#0D0D11]/60 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-terminal-green"
              id={`accordion-header-${item.id}`}
              onClick={() => toggleItem(item.id)}
              type="button"
            >
              <h3 className={`font-heading font-medium text-base sm:text-lg transition-colors ${isExpanded ? "text-terminal-green font-semibold" : "text-foreground group-hover:text-foreground/90"}`}>
                {item.title}
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
              <div className="border-t border-white/5 bg-[#09090C]/80 px-6 py-5 text-sm sm:text-base text-muted-foreground/90 leading-relaxed font-sans">
                {item.content}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
