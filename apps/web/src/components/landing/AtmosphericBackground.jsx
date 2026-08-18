import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const AtmosphericBackground = () => {
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Global scroll progress tracking
  const { scrollYProgress } = useScroll();

  // Smooth scroll spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Background color interpolation across 7 sections
  const backgroundColor = useTransform(
    smoothProgress,
    [0, 0.16, 0.32, 0.48, 0.65, 0.82, 1],
    [
      '#080E24', // 1. Hero: Midnight Navy
      '#0A1330', // 2. Everyone Knows / Skills: Sapphire Navy
      '#09122C', // 3. Simulator / Match: Royal Midnight
      '#0D183E', // 4. Time Credit: Warm Indigo
      '#08102B', // 5. Sessions: Ocean Deep Blue
      '#0A1435', // 6. Living Network: Electric Midnight
      '#060B1C'  // 7. Final Invitation: Deep Abyss
    ]
  );

  // Parallax orb transformations
  const violetOrbY = useTransform(smoothProgress, [0, 1], [0, -180]);
  const goldOrbX = useTransform(smoothProgress, [0, 1], [0, 120]);
  const goldOrbY = useTransform(smoothProgress, [0, 1], [0, 80]);
  const blueOrbX = useTransform(smoothProgress, [0, 1], [0, -80]);

  // Subtle Knowledge Node Particles (24 particles)
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: (i * 37 + 13) % 96,
      y: (i * 53 + 7) % 94,
      size: (i % 3) + 1.5,
      color: i % 3 === 0 ? '#8B7CFF' : i % 3 === 1 ? '#D6B36A' : '#72C7FF',
      duration: 6 + (i % 5) * 2,
      delay: (i % 4) * 0.8
    }));
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      style={{ backgroundColor }}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-700"
    >
      {/* 1. Violet Breathing & Scroll Parallax Orb */}
      <motion.div
        style={prefersReducedMotion ? {} : { y: violetOrbY }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: ['-5%', '15%', '-5%'],
                scale: [1, 1.15, 1]
              }
        }
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-[#8B7CFF]/22 via-[#8B7CFF]/10 to-transparent blur-[160px]"
      />

      {/* 2. Champagne Gold Diagonal Parallax Orb */}
      <motion.div
        style={prefersReducedMotion ? {} : { x: goldOrbX, y: goldOrbY }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1.1, 0.95, 1.1]
              }
        }
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 -right-32 w-[850px] h-[850px] rounded-full bg-gradient-to-bl from-[#D6B36A]/16 via-[#D6B36A]/08 to-transparent blur-[170px]"
      />

      {/* 3. Ice Blue Horizontal Parallax Orb */}
      <motion.div
        style={prefersReducedMotion ? {} : { x: blueOrbX }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: ['-10%', '15%', '-10%'],
                scale: [0.95, 1.18, 0.95]
              }
        }
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 left-1/4 w-[950px] h-[950px] rounded-full bg-gradient-to-tr from-[#72C7FF]/18 via-[#72C7FF]/08 to-transparent blur-[180px]"
      />

      {/* 4. Knowledge Node Ambient Floating Particles */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color
              }}
              animate={{
                y: [0, -18, 0],
                opacity: [0.15, 0.6, 0.15]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut'
              }}
              className="absolute rounded-full shadow-[0_0_8px_currentColor]"
            />
          ))}
        </div>
      )}

      {/* 5. Desktop Cursor Radial Spotlight */}
      <div
        className="fixed inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(650px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(139,124,255,0.07), transparent 70%)`
        }}
      />

      {/* 6. Subtle Micro-noise Texture */}
      <div className="absolute inset-0 atmospheric-noise opacity-25" />
    </motion.div>
  );
};

export default AtmosphericBackground;
