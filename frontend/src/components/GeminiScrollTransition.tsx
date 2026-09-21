"use client";

import { useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { GoogleGeminiEffect } from "./ui/google-gemini-effect";

export default function GeminiScrollTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div
      className="h-[200vh] bg-transparent w-full relative pt-20 -mt-20 z-0"
      ref={ref}
    >
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
        title="Scanning Repository..."
        description="AntiSlop analyzes your codebase for AI-generated logic bloat, redundant checks, and React anti-patterns."
        className="mt-[5vh]"
      />
    </div>
  );
}
