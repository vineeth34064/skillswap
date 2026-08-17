import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const AtmosphericBackground = () => {
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });

  // Scroll-driven background color interpolation across sections
  const { scrollYProgress } = useScroll();

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.32, 0.48, 0.65, 0.82, 1],
    [
      '#101827', // Hero: Midnight Navy
      '#141D32', // Skills: Indigo Navy
      '#101C2D', // Match: Violet Navy
      '#1B1C29', // Time: Warm Midnight
      '#101C2D', // Session: Blue Midnight
      '#111B30', // Network: Indigo Blue
      '#0B1220'  // Final CTA: Deep Midnight
    ]
  );

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
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000"
    >
      {/* 1. Violet Breathing Orb (Slow Horizontal Motion - 25s) */}
      <motion.div
        animate={{
          x: ['-10%', '25%', '-10%'],
          y: ['0%', '15%', '0%'],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[900px] h-[900px] rounded-full bg-gradient-to-br from-[#8B7CFF]/20 via-[#8B7CFF]/10 to-transparent blur-[160px]"
      />

      {/* 2. Champagne Gold Breathing Orb (Slow Vertical Motion - 30s) */}
      <motion.div
        animate={{
          y: ['-15%', '30%', '-15%'],
          x: ['10%', '-15%', '10%'],
          scale: [1.1, 0.9, 1.1]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -right-32 w-[850px] h-[850px] rounded-full bg-gradient-to-bl from-[#D6B36A]/15 via-[#D6B36A]/08 to-transparent blur-[170px]"
      />

      {/* 3. Ice Blue Breathing Orb (Slow Diagonal Motion - 35s) */}
      <motion.div
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['20%', '-20%', '20%'],
          scale: [0.95, 1.2, 0.95]
        }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-40 left-1/3 w-[950px] h-[950px] rounded-full bg-gradient-to-tr from-[#72C7FF]/18 via-[#72C7FF]/08 to-transparent blur-[180px]"
      />

      {/* 4. Ambient Cursor Light Illumination */}
      <div
        className="fixed inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(139,124,255,0.06), transparent 70%)`
        }}
      />

      {/* 5. Subtle Technical Noise Matrix Overlay (Opacity 0.02) */}
      <div className="absolute inset-0 atmospheric-noise opacity-30" />
    </motion.div>
  );
};

export default AtmosphericBackground;
