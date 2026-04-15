"use client";
import React from "react";
import { motion } from "framer-motion";
import { useProfileStore } from "@/store/profile";
import { SignatureCard } from "@/components/cosmic/SignatureCard";

export default function CosmicSignature() {
  const { name, signature, lifePath, setStage } = useProfileStore();

  if (!signature) return null;

  const cards = [
    { title: "Ascendant (Lagna)", value: signature.lagna.sign, subtitle: `Ruled by ${signature.lagna.lord}` },
    { title: "Moon Sign (Rashi)", value: signature.moon.sign, subtitle: "Emotional Nature" },
    { title: "Sun (Surya)", value: signature.sun.sign, subtitle: "Soul Essence" },
    { title: "Nakshatra", value: signature.nakshatra.name, subtitle: `Deity: ${signature.nakshatra.deity}` },
    { title: "Life Path", value: lifePath?.toString() || "", subtitle: "Core Destiny Number" },
    { title: "Current Season", value: signature.mahadasha.lord, subtitle: "Mahadasha Lord" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 pb-20 pt-8 z-10 relative"
    >
      {/* Aurora */}
      <div className="aurora" />

      {/* Sanskrit header */}
      <motion.p
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="text-xs tracking-[0.3em] uppercase text-[var(--color-gold)] mb-4"
        style={{ fontFamily: "var(--font-devanagari), serif" }}
      >
        ब्रह्मांडीय हस्ताक्षर
      </motion.p>

      {/* Title with shimmer */}
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-5xl font-serif italic text-shimmer mb-3 text-center"
      >
        Your Cosmic Signature
      </motion.h2>

      {/* User's name as a gentle subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-sm tracking-widest text-[var(--color-gold)] mb-10 uppercase"
      >
        ✦ &nbsp; {name} &nbsp; ✦
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent mb-12"
      />

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl w-full mb-16">
        {cards.map((card, i) => (
          <SignatureCard
            key={i}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            delay={0.8 + i * 0.15}
            index={i}
          />
        ))}
      </div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        onClick={() => setStage(4)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="
          px-10 py-4 bg-transparent
          border border-[var(--color-gold)]/40
          text-[var(--color-gold)] rounded-full
          text-sm md:text-base tracking-[0.2em] uppercase
          transition-all duration-500
          hover:bg-[var(--color-gold)] hover:text-[var(--color-void)]
          hover:shadow-[0_0_30px_rgba(212,168,75,0.4),0_0_60px_rgba(212,168,75,0.15)]
          hover:tracking-[0.25em]
          focus:outline-none
        "
      >
        Ask the stars a question
      </motion.button>

      {/* Subtle Nakshatra detail line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 2.8, duration: 1 }}
        className="mt-10 text-xs text-center text-[var(--color-ivory)] max-w-sm leading-relaxed"
      >
        {signature.nakshatra.symbol} &middot; {signature.nakshatra.deity} watches over you &middot; {signature.nakshatra.symbol}
      </motion.p>
    </motion.div>
  );
}
