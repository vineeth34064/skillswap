import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SKILL_WORDS = [
  'C++', 'Python', 'React', 'Figma', 'Excel', 'Guitar', 'Cooking', 'Photography',
  'Marketing', 'Spanish', 'Linux', 'Mathematics', 'Video Editing', 'Public Speaking',
  'Quantum Physics', 'Pottery', 'Rust', 'SEO', 'Data Science', 'Machine Learning'
];

const ParallaxTypography = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const xRight = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const opacityCenter = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.3, 1, 0.3]);

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#8B7CFF]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center relative z-10">
        
        {/* Parallax Typography Split Lines */}
        <div className="space-y-2 select-none overflow-hidden">
          <motion.div
            style={{ x: xLeft }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white/90 font-mono"
          >
            EVERYONE
          </motion.div>

          <motion.div
            style={{ x: xRight }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter accent-gradient-rare"
          >
            KNOWS
          </motion.div>

          <motion.div
            style={{ opacity: opacityCenter }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white"
          >
            SOMETHING.
          </motion.div>
        </div>

        {/* Sub-statement */}
        <p className="text-base sm:text-xl text-[#A1ACBC] max-w-2xl mx-auto font-sans leading-relaxed">
          The skill you practice every day — whether coding C++, cooking, or playing guitar — could be the exact knowledge someone else has wanted to master for years.
        </p>

        {/* Interactive Skill Particle Cloud */}
        <div className="pt-8 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {SKILL_WORDS.map((word, index) => (
            <motion.span
              key={index}
              data-cursor="skill"
              whileHover={{ scale: 1.12, backgroundColor: 'rgba(139, 124, 255, 0.25)', borderColor: '#8B7CFF' }}
              className="px-4 py-2 rounded-full liquid-glass-base border border-white/10 text-xs sm:text-sm font-extrabold text-slate-300 transition-all cursor-pointer shadow-sm hover:text-white"
            >
              {word}
            </motion.span>
          ))}
        </div>

      </div>

    </section>
  );
};

export default ParallaxTypography;
