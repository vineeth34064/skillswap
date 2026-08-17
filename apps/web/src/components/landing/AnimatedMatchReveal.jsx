import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Repeat, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnimatedMatchReveal = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [matchScore, setMatchScore] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center']
  });

  const leftX = useTransform(scrollYProgress, [0, 1], [-180, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], [180, 0]);
  const connectionOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 1]);
  const beamScale = useTransform(scrollYProgress, [0.4, 1], [0.1, 1]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const targetScore = Math.min(97, Math.floor(v * 97));
      setMatchScore(targetScore);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section ref={containerRef} className="py-28 relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#8B7CFF]/15 via-[#72C7FF]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12 text-center relative z-10">
        
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-base border border-[#72C7FF]/40 text-[#72C7FF] text-xs font-bold shadow-blue-glow">
            <Sparkles className="w-3.5 h-3.5" /> Reciprocal Match Engine
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How Two Minds <span className="accent-gradient-rare">Connect</span>
          </h2>
          <p className="text-sm text-[#A1ACBC] max-w-xl mx-auto">
            Scroll down to watch how SkillSwap detects mutual interest and pairs members for 1-to-1 exchanges.
          </p>
        </div>

        {/* Dynamic Converging Match Canvas */}
        <div className="py-8 relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          
          {/* Left Person Node: YOU */}
          <motion.div
            style={{ x: leftX }}
            className="w-full max-w-xs p-6 rounded-3xl liquid-glass-base border border-[#8B7CFF]/40 shadow-glass-3d text-left space-y-4 bg-[#0D1118]/90"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl accent-gradient-bg flex items-center justify-center font-extrabold text-[#05070A] text-lg shadow-glow">
                YOU
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Your Profile</h4>
                <p className="text-xs text-[#A1ACBC]">Full-Stack Developer</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[#8B7CFF] font-bold">Teaches:</span>
                <span className="font-extrabold text-white">React, C++</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#72C7FF] font-bold">Wants:</span>
                <span className="font-extrabold text-white">UI/UX Design</span>
              </div>
            </div>
          </motion.div>

          {/* Central Connecting Beam & Animated % Counter */}
          <motion.div
            style={{ opacity: connectionOpacity, scale: beamScale }}
            className="flex flex-col items-center justify-center space-y-3 z-20"
          >
            <div className="w-16 h-16 rounded-full accent-gradient-bg flex items-center justify-center shadow-glow animate-pulse">
              <Repeat className="w-8 h-8 text-[#05070A] stroke-[2.5]" />
            </div>

            <div className="text-3xl sm:text-4xl font-black font-mono tracking-wider accent-gradient-rare">
              {matchScore}% MATCH
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-400 text-[11px] font-extrabold border border-emerald-400/40">
              PERFECT RECIPROCAL EXCHANGE
            </span>
          </motion.div>

          {/* Right Person Node: SARAH */}
          <motion.div
            style={{ x: rightX }}
            className="w-full max-w-xs p-6 rounded-3xl liquid-glass-base border border-[#72C7FF]/40 shadow-glass-3d text-left space-y-4 bg-[#0D1118]/90"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                alt="Sarah"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#72C7FF]"
              />
              <div>
                <h4 className="font-extrabold text-sm text-white">Sarah Jenkins</h4>
                <p className="text-xs text-[#A1ACBC]">Senior Product Designer</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[#8B7CFF] font-bold">Teaches:</span>
                <span className="font-extrabold text-white">UI/UX Design</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#72C7FF] font-bold">Wants:</span>
                <span className="font-extrabold text-white">React, C++</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* CTA Banner */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 rounded-full accent-gradient-bg text-[#05070A] font-extrabold text-sm shadow-glow hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Start Matching with Mentors Now</span>
            <ArrowRight className="w-4 h-4 text-[#05070A]" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default AnimatedMatchReveal;
