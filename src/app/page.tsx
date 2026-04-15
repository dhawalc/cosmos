"use client";
import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useProfileStore } from '@/store/profile';
import Invocation from '@/components/stages/Invocation';
import BirthImprint from '@/components/stages/BirthImprint';
import CosmicSignature from '@/components/stages/CosmicSignature';
import Oracle from '@/components/stages/Oracle';

export default function Home() {
  const currentStage = useProfileStore((s) => s.currentStage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative overflow-hidden text-[var(--color-ivory)]">
      <AnimatePresence mode="wait">
        {currentStage === 1 && <Invocation key="invocation" />}
        {currentStage === 2 && <BirthImprint key="birth" />}
        {currentStage === 3 && <CosmicSignature key="signature" />}
        {currentStage === 4 && <Oracle key="oracle" />}
      </AnimatePresence>
    </main>
  );
}
