import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** Set to true for containers like chat where floating would be disorienting */
  isStatic?: boolean;
  /** Enable the rotating conic-gradient border shimmer */
  shimmerBorder?: boolean;
}

export function GlassCard({ children, className = '', isStatic = false, shimmerBorder = false }: GlassCardProps) {
  const floatAnimation = isStatic
    ? {}
    : { y: [-4, 4, -4] };

  const floatTransition = isStatic
    ? {}
    : { duration: 6, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={floatAnimation}
      transition={floatTransition}
      className={`
        backdrop-blur-xl bg-white/[0.04] rounded-3xl relative overflow-hidden
        ${shimmerBorder ? 'border-shimmer' : 'border border-[var(--color-gold)]/20'}
        shadow-[0_0_30px_rgba(212,168,75,0.04),0_8px_32px_rgba(0,0,0,0.4)]
        ${className}
      `}
    >
      {/* Inner gold hairline glow */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl border border-[var(--color-gold)]/[0.08]" />
      {/* Subtle top-left light reflection */}
      <div className="absolute top-0 left-0 w-1/2 h-1/3 pointer-events-none rounded-tl-3xl bg-gradient-to-br from-white/[0.04] to-transparent" />
      {children}
    </motion.div>
  );
}
