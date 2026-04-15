"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useProfileStore } from "@/store/profile";
import { Loader2, Sparkles } from "lucide-react";

const SANSKRIT_GLYPHS = ["ॐ", "श्री", "꩜", "✦", "⟡", "◈", "☉", "☽"];

export default function BirthImprint() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [glyphIndex, setGlyphIndex] = useState(0);

  const setProfile = useProfileStore((s) => s.setProfile);
  const setStage = useProfileStore((s) => s.setStage);

  // Cycle a floating glyph on each keystroke
  const handleNameChange = (val: string) => {
    setName(val);
    if (val.length > 0) setGlyphIndex((prev) => (prev + 1) % SANSKRIT_GLYPHS.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const actualTime = unknownTime ? "12:00" : time;
      const res = await fetch("/api/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, time: actualTime, place }),
      });
      const data = await res.json();
      if (data.signature) {
        setProfile({
          name, dob, time: actualTime, place,
          signature: data.signature,
          lifePath: data.lifePath,
          expression: data.expression,
          soulUrge: data.soulUrge,
        });
        setStage(3);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full bg-white/[0.04] border border-[var(--color-gold)]/20 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 focus:border-[var(--color-gold)]/60 text-[var(--color-ivory)] placeholder:text-white/20";

  const dateInputClasses =
    "w-full bg-[var(--color-void)]/80 text-[var(--color-ivory)] border border-[var(--color-gold)]/20 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 focus:border-[var(--color-gold)]/60 [color-scheme:dark]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center min-h-screen px-4 z-10 relative"
    >
      {/* Aurora */}
      <div className="aurora" />

      {/* Section title */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6"
        style={{ fontFamily: "var(--font-devanagari), serif" }}
      >
        जन्म छाप
      </motion.p>

      <GlassCard shimmerBorder className="w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-3xl font-serif italic text-shimmer mb-2 text-center">
          Your Cosmic Imprint
        </h2>
        <p className="text-xs text-center opacity-40 mb-8 tracking-wide">
          The universe needs three things to remember you
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name field with floating glyph */}
          <div className="relative">
            <label className="block text-[11px] opacity-50 mb-2 tracking-widest uppercase">
              Full Name (at birth)
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClasses}
              placeholder="As written in the stars..."
            />
            {/* Floating glyph that changes on type */}
            <AnimatePresence mode="wait">
              {name.length > 0 && (
                <motion.span
                  key={glyphIndex}
                  initial={{ opacity: 0, y: 5, scale: 0.5 }}
                  animate={{ opacity: 0.3, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-4 top-9 text-lg text-[var(--color-gold)] pointer-events-none"
                  style={{ fontFamily: "var(--font-devanagari), serif" }}
                >
                  {SANSKRIT_GLYPHS[glyphIndex]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* DOB + Time row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] opacity-50 mb-2 tracking-widest uppercase">
                Date of Birth
              </label>
              <input
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={dateInputClasses}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] opacity-50 mb-2 tracking-widest uppercase">
                Time of Birth
              </label>
              <input
                disabled={unknownTime}
                required={!unknownTime}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`${dateInputClasses} disabled:opacity-30`}
              />
            </div>
          </div>

          <label className="flex items-center text-xs opacity-50 gap-2 cursor-pointer hover:opacity-70 transition-opacity">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => setUnknownTime(e.target.checked)}
              className="accent-[var(--color-gold)]"
            />
            <span>Time unknown — defaults to solar noon</span>
          </label>

          {/* Place */}
          <div>
            <label className="block text-[11px] opacity-50 mb-2 tracking-widest uppercase">
              Place of Birth
            </label>
            <input
              required
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g. Mumbai, India"
              className={inputClasses}
            />
          </div>

          {/* Submit button */}
          <motion.button
            disabled={loading}
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              w-full py-4 mt-3
              bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-saffron)]
              text-[var(--color-void)] font-semibold rounded-xl
              transition-all duration-500 uppercase tracking-[0.15em] text-sm
              hover:shadow-[0_0_25px_rgba(212,168,75,0.35)]
              disabled:opacity-40 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Reading the cosmos...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Reveal My Signature
              </>
            )}
          </motion.button>
        </form>
      </GlassCard>

      {/* Back link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        onClick={() => setStage(1)}
        className="mt-6 text-xs tracking-widest text-[var(--color-gold)] hover:opacity-70 transition-opacity uppercase"
      >
        ← Back
      </motion.button>
    </motion.div>
  );
}
