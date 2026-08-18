import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none bg-black/20">
      <motion.div
        className="h-full w-full bg-gradient-to-r from-[#D6B36A] via-[#8B7CFF] to-[#72C7FF] shadow-[0_0_12px_rgba(139,124,255,0.7)]"
        style={{
          scaleX,
          transformOrigin: '0%'
        }}
      />
    </div>
  );
};

export default ScrollProgressBar;
