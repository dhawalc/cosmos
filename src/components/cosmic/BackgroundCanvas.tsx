"use client";
import { Canvas } from "@react-three/fiber";
import { Starfield } from "./Starfield";
import { useState, useEffect } from "react";

export default function BackgroundCanvas() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 60 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true }}
      >
        <Starfield mobile={isMobile} />
      </Canvas>
      {/* Radial vignette overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, var(--void) 100%)",
        }}
      />
    </div>
  );
}
