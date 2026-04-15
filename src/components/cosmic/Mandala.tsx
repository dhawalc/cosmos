"use client";
import React from "react";
import { motion } from "framer-motion";

/**
 * Multi-layered Sri Yantra / sacred geometry mandala.
 * Three concentric rings rotate at different speeds and directions
 * with breathing opacity for a living, sacred feel.
 */
export function Mandala() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Outermost ring — slow clockwise */}
      <motion.svg
        className="absolute w-[280px] h-[280px] sm:w-[600px] sm:h-[600px] md:w-[900px] md:h-[900px]"
        viewBox="0 0 200 200"
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        style={{ filter: "drop-shadow(0 0 20px rgba(212,168,75,0.15))" }}
      >
        <defs>
          <radialGradient id="mandala-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Outer circle */}
        <circle cx="100" cy="100" r="98" fill="none" stroke="var(--gold)" strokeWidth="0.15" opacity="0.2" />
        <circle cx="100" cy="100" r="95" fill="none" stroke="var(--gold)" strokeWidth="0.3" opacity="0.15" />
        {/* 16-petal lotus outer ring */}
        {Array.from({ length: 16 }).map((_, i) => (
          <g key={`outer-${i}`} transform={`rotate(${i * 22.5} 100 100)`}>
            <path
              d="M 100 8 C 106 30, 106 70, 100 95 C 94 70, 94 30, 100 8 Z"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="0.15"
              opacity="0.12"
            />
          </g>
        ))}
        {/* Dotted circle ring */}
        <circle cx="100" cy="100" r="85" fill="none" stroke="var(--gold)" strokeWidth="0.2" strokeDasharray="1.5 3" opacity="0.2" />
      </motion.svg>

      {/* Middle ring — counter-clockwise, faster */}
      <motion.svg
        className="absolute w-[200px] h-[200px] sm:w-[420px] sm:h-[420px] md:w-[650px] md:h-[650px]"
        viewBox="0 0 200 200"
        animate={{ rotate: -360, opacity: [0.12, 0.22, 0.12] }}
        transition={{
          rotate: { duration: 120, repeat: Infinity, ease: "linear" },
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ filter: "drop-shadow(0 0 15px rgba(212,168,75,0.2))" }}
      >
        {/* Sri Yantra triangles — upward */}
        <polygon points="100,20 55,110 145,110" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.25" />
        <polygon points="100,30 65,105 135,105" fill="none" stroke="var(--gold)" strokeWidth="0.25" opacity="0.18" />
        {/* Sri Yantra triangles — downward */}
        <polygon points="100,130 55,40 145,40" fill="none" stroke="var(--gold)" strokeWidth="0.4" opacity="0.25" />
        <polygon points="100,120 65,48 135,48" fill="none" stroke="var(--gold)" strokeWidth="0.25" opacity="0.18" />
        {/* 8-petal inner lotus */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`mid-${i}`} transform={`rotate(${i * 45} 100 100)`}>
            <path
              d="M 100 35 C 108 55, 108 80, 100 100 C 92 80, 92 55, 100 35 Z"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="0.25"
              opacity="0.2"
            />
          </g>
        ))}
        {/* Inner guiding circle */}
        <circle cx="100" cy="100" r="65" fill="none" stroke="var(--gold)" strokeWidth="0.2" opacity="0.15" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="var(--gold)" strokeWidth="0.15" strokeDasharray="2 4" opacity="0.12" />
      </motion.svg>

      {/* Innermost ring — slow clockwise, breathing glow */}
      <motion.svg
        className="absolute w-[120px] h-[120px] sm:w-[230px] sm:h-[230px] md:w-[350px] md:h-[350px]"
        viewBox="0 0 200 200"
        animate={{
          rotate: 360,
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.03, 1],
        }}
        transition={{
          rotate: { duration: 90, repeat: Infinity, ease: "linear" },
          opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ filter: "drop-shadow(0 0 30px rgba(243,217,152,0.3))" }}
      >
        {/* Central bindu circle */}
        <circle cx="100" cy="100" r="5" fill="var(--gold)" opacity="0.4" />
        <circle cx="100" cy="100" r="8" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.3" />
        {/* Inner triangle (Shakti) */}
        <polygon points="100,60 75,120 125,120" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.35" />
        {/* Inner triangle (Shiva) */}
        <polygon points="100,140 75,80 125,80" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.35" />
        {/* Hexagram guide circles */}
        <circle cx="100" cy="100" r="35" fill="none" stroke="var(--gold)" strokeWidth="0.3" opacity="0.2" />
        <circle cx="100" cy="100" r="25" fill="none" stroke="var(--gold-soft)" strokeWidth="0.2" opacity="0.25" />
        {/* Tiny decorative dots around center */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const cx = 100 + 18 * Math.cos(angle);
          const cy = 100 + 18 * Math.sin(angle);
          return <circle key={`dot-${i}`} cx={cx} cy={cy} r="0.8" fill="var(--gold)" opacity="0.3" />;
        })}
      </motion.svg>
    </div>
  );
}
