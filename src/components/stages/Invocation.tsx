"use client";
import React from "react";
import { motion } from "framer-motion";
import { useProfileStore } from "@/store/profile";
import { Mandala } from "@/components/cosmic/Mandala";

/** Floating Sanskrit / celestial glyphs that drift around the background */
const FLOATING_GLYPHS = ["ॐ", "श्री", "☉", "☽", "♃", "♄", "꩜", "✦", "⟡", "◈", "☊", "☋"];

function FloatingGlyph({ glyph, index }: { glyph: string; index: number }) {
  const left = 5 + (index * 17) % 90;
  const top = 10 + (index * 23) % 75;
  const duration = 15 + (index % 5) * 4;
  const delay = index * 0.8;
  const size = 14 + (index % 4) * 6;

  return (
    <motion.span
      className="absolute pointer-events-none select-none"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        fontSize: `${size}px`,
        color: "var(--gold)",
        fontFamily: "var(--font-devanagari), serif",
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.12, 0.06, 0.15, 0],
        y: [0, -30, -15, -40, -60],
        x: [0, 10, -5, 8, -10],
        rotate: [0, 5, -3, 8, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {glyph}
    </motion.span>
  );
}

/** Particle burst effect behind the CTA button on hover */
function ParticleBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full bg-[var(--color-gold)]"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            whileHover={{
              x: Math.cos((angle * Math.PI) / 180) * 40,
              y: Math.sin((angle * Math.PI) / 180) * 40,
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export default function Invocation() {
  const setStage = useProfileStore((s) => s.setStage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10"
    >
      {/* Aurora background */}
      <div className="aurora" />

      {/* Floating Sanskrit glyphs */}
      {FLOATING_GLYPHS.map((g, i) => (
        <FloatingGlyph key={i} glyph={g} index={i} />
      ))}

      {/* Sacred geometry backdrop */}
      <Mandala />

      {/* Content */}
      <div className="z-20 flex flex-col items-center max-w-3xl">
        {/* Small Sanskrit invocation */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.3, duration: 1.2 }}
          className="text-sm tracking-[0.3em] uppercase mb-8 text-[var(--color-gold)]"
          style={{ fontFamily: "var(--font-devanagari), serif" }}
        >
          हिमानी · ज्योतिष · अंक विद्या
        </motion.p>

        {/* Main headline — word-by-word reveal with shimmer */}
        <h1 className="font-serif italic text-3xl sm:text-5xl md:text-8xl tracking-[-0.02em] mb-4 leading-[1.1]">
          {["The", "stars", "know", "you,"].map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.5 + i * 0.18,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-shimmer inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
          <br />
          {["Himani."].map((word, i) => (
            <motion.span
              key={`l2-${i}`}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: 1.3 + i * 0.18,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-gold-gradient inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/50 to-transparent my-6"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="text-[var(--color-ivory)] mb-8 sm:mb-12 text-sm sm:text-lg md:text-xl max-w-md mx-auto font-light leading-relaxed px-2"
        >
          Your personal Jyotish + numerology oracle, crafted just for you.
        </motion.p>

        {/* CTA button — gold border with glow on hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="relative"
        >
          <ParticleBurst />
          <button
            onClick={() => setStage(2)}
            className="
              relative px-6 sm:px-10 py-3 sm:py-4
              bg-[var(--color-void)]/50 backdrop-blur-md
              border border-[var(--color-gold)]/40
              text-[var(--color-gold)] rounded-full
              text-sm md:text-base tracking-[0.2em] uppercase
              transition-all duration-500
              hover:bg-[var(--color-gold)] hover:text-[var(--color-void)]
              hover:shadow-[0_0_30px_rgba(212,168,75,0.4),0_0_60px_rgba(212,168,75,0.15)]
              hover:tracking-[0.25em]
              focus:outline-none active:scale-95
            "
          >
            Begin your reading
          </button>
        </motion.div>

        {/* Tiny bottom accent */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 3.2, duration: 1.5 }}
          className="mt-16 text-xs tracking-widest text-[var(--color-gold)]"
        >
          ✦ &nbsp; COSMOS &nbsp; ✦
        </motion.p>
      </div>
    </motion.div>
  );
}
