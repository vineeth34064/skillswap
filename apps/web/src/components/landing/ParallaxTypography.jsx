import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 26
  });

  const xLeft = useTransform(smoothProgress, [0, 0.5, 1], [-80, 0, 80]);
  const xRight = useTransform(smoothProgress, [0, 0.5, 1], [80, 0, -80]);
  const scaleCenter = useTransform(smoothProgress, [0.1, 0.5, 0.9], [0.9, 1, 0.9]);
  const opacityCenter = useTransform(smoothProgress, [0.15, 0.5, 0.85], [0.3, 1, 0.3]);

  return (
    <section id="everyone-knows" ref={containerRef} className="py-24 sm:py-36 relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#8B7CFF]/12 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 text-center relative z-10">
        
        {/* Parallax Typography Split Lines with Dynamic Directions */}
        <div className="space-y-2.5 sm:space-y-4 select-none overflow-hidden py-4">
          <motion.div
            style={{ x: xLeft }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white/90 font-mono leading-tight"
          >
            EVERYONE
          </motion.div>

          <motion.div
            style={{ x: xRight }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight accent-gradient-rare leading-tight"
          >
            KNOWS
          </motion.div>

          <motion.div
            style={{ scale: scaleCenter, opacity: opacityCenter }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight"
          >
            SOMETHING.
          </motion.div>
        </div>

        {/* Sub-statement with Masked Fade */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-sm sm:text-base text-[#A1ACBC] max-w-2xl mx-auto font-sans leading-relaxed"
        >
          The skill you practice every day — whether coding C++, cooking, or playing guitar — could be the exact knowledge someone else has wanted to master for years.
        </motion.p>

        {/* Interactive Skill Particle Cloud with Staggered Convergence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="pt-10 flex flex-wrap justify-center gap-3.5 sm:gap-4 max-w-5xl mx-auto"
        >
          {SKILL_WORDS.map((word, index) => (
            <motion.span
              key={index}
              data-cursor="skill"
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.12] hover:border-[#8B7CFF] backdrop-blur-md text-sm sm:text-base font-extrabold text-slate-200 transition-colors cursor-pointer shadow-sm hover:text-white"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

      </div>

    </section>
  );
};

export default ParallaxTypography;
