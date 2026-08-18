import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Repeat, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnimatedMatchReveal = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [matchScore, setMatchScore] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24
  });

  // Nodes move toward center as user scrolls
  const leftX = useTransform(smoothProgress, [0, 1], [-220, 0]);
  const rightX = useTransform(smoothProgress, [0, 1], [220, 0]);
  const connectionOpacity = useTransform(smoothProgress, [0.35, 1], [0, 1]);
  const beamScale = useTransform(smoothProgress, [0.4, 1], [0.1, 1]);
  const cardRotateX = useTransform(smoothProgress, [0, 1], [8, 0]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (v) => {
      const targetScore = Math.min(97, Math.floor(v * 97));
      setMatchScore(targetScore);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  return (
    <section id="matching" ref={containerRef} className="py-28 sm:py-36 relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-r from-[#8B7CFF]/18 via-[#72C7FF]/18 to-transparent rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12 text-center relative z-10">
        
        {/* Title */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-[#72C7FF]/40 text-[#72C7FF] text-xs sm:text-sm font-mono font-bold shadow-blue-glow">
            <Sparkles className="w-4 h-4" /> Reciprocal Match Engine
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white tracking-tight leading-[0.98]">
            How Two Minds <span className="accent-gradient-rare drop-shadow-[0_0_35px_rgba(214,179,106,0.45)]">Connect</span>
          </h2>
          <p className="text-base sm:text-xl text-[#A1ACBC] max-w-2xl mx-auto leading-relaxed">
            Scroll down to watch how SkillSwap detects mutual interest and pairs members for 1-to-1 exchanges.
          </p>
        </div>

        {/* Dynamic Converging Match Canvas */}
        <div className="py-12 relative flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          
          {/* Left Person Node: YOU */}
          <motion.div
            style={{ x: leftX, rotateX: cardRotateX }}
            className="w-full max-w-sm sm:max-w-md p-7 sm:p-8 rounded-3xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.5),0_0_30px_rgba(139,124,255,0.12)] text-left space-y-5 bg-white/[0.05] hover:bg-white/[0.09] backdrop-blur-3xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl accent-gradient-bg flex items-center justify-center font-black text-[#05070A] text-xl shadow-glow">
                YOU
              </div>
              <div>
                <h4 className="font-black text-base sm:text-lg text-white">Your Profile</h4>
                <p className="text-xs sm:text-sm text-[#A1ACBC]">Full-Stack Developer</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[#8B7CFF] font-bold">Teaches:</span>
                <span className="font-black text-white">React, C++</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#72C7FF] font-bold">Wants:</span>
                <span className="font-black text-white">UI/UX Design</span>
              </div>
            </div>
          </motion.div>

          {/* Central Connecting Beam & Animated % Counter */}
          <motion.div
            style={{ opacity: connectionOpacity, scale: beamScale }}
            className="flex flex-col items-center justify-center space-y-4 z-20 shrink-0"
          >
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full accent-gradient-bg flex items-center justify-center shadow-glow animate-pulse">
              <Repeat className="w-9 h-9 sm:w-10 sm:h-10 text-[#05070A] stroke-[2.5]" />
            </div>

            <div className="text-4xl sm:text-6xl font-black font-mono tracking-wider accent-gradient-rare drop-shadow-[0_0_25px_rgba(214,179,106,0.4)]">
              {matchScore}% MATCH
            </div>

            <span className="px-4 py-1.5 rounded-full bg-emerald-400/20 text-emerald-400 text-xs sm:text-sm font-black border border-emerald-400/40">
              PERFECT RECIPROCAL EXCHANGE
            </span>
          </motion.div>

          {/* Right Person Node: SARAH */}
          <motion.div
            style={{ x: rightX, rotateX: cardRotateX }}
            className="w-full max-w-sm sm:max-w-md p-7 sm:p-8 rounded-3xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.5),0_0_30px_rgba(139,124,255,0.12)] text-left space-y-5 bg-white/[0.05] hover:bg-white/[0.09] backdrop-blur-3xl transition-all"
          >
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
                alt="Sarah"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#72C7FF]"
              />
              <div>
                <h4 className="font-black text-base sm:text-lg text-white">Sarah Jenkins</h4>
                <p className="text-xs sm:text-sm text-[#A1ACBC]">Senior Product Designer</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm border-t border-white/10 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[#8B7CFF] font-bold">Teaches:</span>
                <span className="font-black text-white">UI/UX Design</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#72C7FF] font-bold">Wants:</span>
                <span className="font-black text-white">React, C++</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* CTA Banner */}
        <div className="pt-6 flex justify-center">
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4.5 rounded-full accent-gradient-bg text-[#05070A] font-black text-sm sm:text-base shadow-glow hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
          >
            <span>Start Matching with Mentors Now</span>
            <ArrowRight className="w-5 h-5 text-[#05070A]" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default AnimatedMatchReveal;
