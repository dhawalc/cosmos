"use client";
import { motion } from "framer-motion";

/** Vedic planet glyphs mapped to lords and chart keys */
const PLANET_GLYPHS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿",
  Jupiter: "♃", Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

/** Sanskrit accent glyphs for card corners */
const DEVANAGARI_ACCENTS = ["ॐ", "श्री", "✦", "◈", "꩜", "⟡"];

interface Props {
  title: string;
  value: string;
  subtitle: string;
  delay: number;
  index?: number;
}

export function SignatureCard({ title, value, subtitle, delay, index = 0 }: Props) {
  const glyph = PLANET_GLYPHS[value] || PLANET_GLYPHS[subtitle.replace(/^Ruled by /, "")] || "";
  const accent = DEVANAGARI_ACCENTS[index % DEVANAGARI_ACCENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="h-full relative group"
    >
      {/* Orbit trail SVG that draws in */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 200 200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
      >
        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="var(--gold)"
          strokeWidth="0.3"
          strokeDasharray="565"
          initial={{ strokeDashoffset: 565 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ delay: delay + 0.1, duration: 1.5, ease: "easeOut" }}
          opacity="0.15"
        />
      </motion.svg>

      <div className="border-shimmer rounded-3xl h-full">
        <div className="backdrop-blur-xl bg-white/[0.04] rounded-3xl p-3 sm:p-6 h-full flex flex-col justify-center items-center text-center relative overflow-hidden cursor-pointer transition-all duration-500 hover:bg-white/[0.08]">
          {/* Devanagari accent — top right corner */}
          <span
            className="absolute top-3 right-4 text-[var(--color-gold)]/20 text-lg font-devanagari select-none"
            style={{ fontFamily: "var(--font-devanagari)" }}
          >
            {accent}
          </span>

          {/* Planet glyph — large, glowing */}
          {glyph && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.5, duration: 0.6, ease: "backOut" }}
              className="text-xl sm:text-3xl mb-2 sm:mb-3 block"
              style={{
                filter: "drop-shadow(0 0 12px rgba(212,168,75,0.5))",
                color: "var(--gold-soft)",
              }}
            >
              {glyph}
            </motion.span>
          )}

          {/* Title */}
          <h3 className="text-[9px] sm:text-[10px] opacity-50 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-1.5 sm:mb-3 font-semibold text-[var(--color-ivory)]">
            {title}
          </h3>

          {/* Main value — shimmer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.6 }}
            className="text-lg sm:text-3xl font-serif text-shimmer mb-1 sm:mb-2 transition-transform duration-300 group-hover:scale-110"
          >
            {value}
          </motion.p>

          {/* Subtitle */}
          <p className="text-xs opacity-60 text-[var(--color-ivory)]">{subtitle}</p>

          {/* Bottom glow accent */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
