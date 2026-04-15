"use client";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/** A single shooting star that streaks across the sky and resets */
function ShootingStar({ delay }: { delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(delay);
  const active = useRef(false);
  const speed = useMemo(() => 1.5 + Math.random() * 2, []);
  const startPos = useMemo(() => ({
    x: (Math.random() - 0.5) * 60,
    y: 15 + Math.random() * 15,
    z: -(Math.random() * 20 + 5),
  }), []);
  const dir = useMemo(() => new THREE.Vector3(-0.5 - Math.random() * 0.3, -0.8 - Math.random() * 0.2, 0).normalize(), []);
  const interval = useMemo(() => 8 + Math.random() * 20, []);

  useFrame((_, delta) => {
    startTime.current -= delta;
    if (startTime.current > 0) return;

    if (!active.current) {
      active.current = true;
      if (ref.current) {
        ref.current.position.set(startPos.x, startPos.y, startPos.z);
      }
    }

    if (ref.current && trailRef.current) {
      ref.current.position.addScaledVector(dir, speed * delta * 30);
      trailRef.current.position.copy(ref.current.position);
      trailRef.current.position.addScaledVector(dir, -0.8);

      // Fade out over distance
      const dist = ref.current.position.distanceTo(new THREE.Vector3(startPos.x, startPos.y, startPos.z));
      const opacity = Math.max(0, 1 - dist / 40);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity;
      (trailRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.4;

      if (dist > 45) {
        active.current = false;
        startTime.current = interval;
        ref.current.position.set(startPos.x, startPos.y, startPos.z);
      }
    }
  });

  return (
    <>
      <mesh ref={ref} position={[startPos.x, startPos.y, startPos.z]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial color="#F3D998" transparent opacity={0} />
      </mesh>
      <mesh ref={trailRef} position={[startPos.x, startPos.y, startPos.z]}>
        <sphereGeometry args={[0.02, 4, 4]} />
        <meshBasicMaterial color="#D4A84B" transparent opacity={0} />
      </mesh>
    </>
  );
}

export function Starfield() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x -= delta * 0.008;
      groupRef.current.rotation.y -= delta * 0.03;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Dense starfield */}
        <Stars
          radius={100}
          depth={60}
          count={6000}
          factor={4}
          saturation={0}
          fade
          speed={0.8}
        />
        {/* Warm gold dust layer */}
        <Sparkles
          count={400}
          scale={40}
          size={5}
          speed={0.3}
          opacity={0.35}
          color="#F3D998"
        />
        {/* Deeper cool sparkle layer */}
        <Sparkles
          count={150}
          scale={50}
          size={3}
          speed={0.15}
          opacity={0.2}
          color="#8B7FD4"
        />
      </group>

      {/* Shooting stars — independent of rotation */}
      {Array.from({ length: 5 }).map((_, i) => (
        <ShootingStar key={i} delay={i * 4 + Math.random() * 6} />
      ))}

      {/* Nebula ambient light tint */}
      <ambientLight intensity={0.02} color="#5B2A86" />
      <pointLight position={[0, 0, 5]} intensity={0.03} color="#D4A84B" distance={50} />
    </>
  );
}
