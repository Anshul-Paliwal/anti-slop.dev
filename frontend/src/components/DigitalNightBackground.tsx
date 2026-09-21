"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  isGlyph: boolean;
  glyph?: string;
  vy: number;
}

const MINIMAL_GLYPHS = [".", "*", "+", "·", "°", "{}"];

export default function DigitalNightBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      // Minimal, gentle density
      const count = Math.floor((width * height) / 14000);
      for (let i = 0; i < count; i++) {
        const isGlyph = Math.random() > 0.85;
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: isGlyph ? 9 : Math.random() * 0.9 + 0.4, // micro size for stars
          baseAlpha: Math.random() * 0.25 + 0.05, // very subtle (5% to 30%)
          alpha: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          isGlyph,
          glyph: isGlyph ? MINIMAL_GLYPHS[Math.floor(Math.random() * MINIMAL_GLYPHS.length)] : undefined,
          vy: -Math.random() * 0.12 - 0.03, // whisper slow upward drift
        });
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener("resize", handleResize);
    initStars();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed;
        const currentAlpha = Math.abs(Math.sin(s.alpha)) * s.baseAlpha + 0.03;

        s.y += s.vy;

        // Wrap around smoothly
        if (s.y < -15) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }

        if (s.isGlyph && s.glyph) {
          ctx.font = `400 ${s.radius}px monospace`;
          ctx.fillStyle = `rgba(245, 245, 244, ${currentAlpha * 0.7})`;
          ctx.fillText(s.glyph, s.x, s.y);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 245, 244, ${currentAlpha})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Deep Obsidian Background */}
      <div className="absolute inset-0 bg-[#0A0A0B]" />

      {/* Very faint, quiet white ambient starlight gradient at the top */}
      <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      {/* Canvas with subtle white stars and micro glyphs */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-70" />
    </div>
  );
}
