"use client";

import { motion } from "framer-motion";

export default function DriftingBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blob 1 */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#39FF88]/5 rounded-full blur-[120px]"
      />
      
      {/* Blob 2 */}
      <motion.div
        animate={{
          x: [0, -150, 50, 0],
          y: [0, 100, -100, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#F5F5F4]/5 rounded-full blur-[140px]"
      />
    </div>
  );
}
