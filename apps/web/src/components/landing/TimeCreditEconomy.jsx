import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Zap, Clock, ShieldCheck, ArrowRight, ArrowDownRight } from 'lucide-react';
import TimeCreditBadge from '../TimeCreditBadge';
import ScrollReveal from './ScrollReveal';

const TIME_STORIES = [
  { hours: '1 HOUR', result: 'Learned Figma Prototyping', category: 'Design', icon: '🎨' },
  { hours: '1 HOUR', result: 'Fixed C++ Memory Leak', category: 'Engineering', icon: '💻' },
  { hours: '1 HOUR', result: 'Mastered Python Async/Await', category: 'Backend', icon: '⚡' },
  { hours: '1 HOUR', result: 'Improved Tech Interview Pitch', category: 'Career', icon: '🚀' }
];

const TimeCreditEconomy = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24
  });

  // Wallet 3D entry animation
  const walletY = useTransform(smoothProgress, [0, 1], [60, 0]);
  const walletRotateX = useTransform(smoothProgress, [0, 1], [8, 0]);
  const walletOpacity = useTransform(smoothProgress, [0, 0.8], [0, 1]);

  return (
    <section id="time-credits" ref={containerRef} className="py-28 sm:py-36 relative overflow-hidden">
      
      {/* Warm Champagne Gold Ambient Field */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-[#D6B36A]/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-16 relative z-10">
        
        {/* Title Header */}
        <ScrollReveal direction="up" className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-[#D6B36A]/40 text-[#D6B36A] text-xs sm:text-sm font-mono font-bold shadow-gold-glow">
            <Zap className="w-4 h-4 text-[#D6B36A]" /> The Time Credit System
          </div>

          <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black text-white tracking-tight leading-[0.98]">
            TIME IS THE <span className="text-[#D6B36A] drop-shadow-[0_0_35px_rgba(214,179,106,0.45)]">CURRENCY.</span>
          </h2>

          <p className="text-base sm:text-xl text-[#A1ACBC] max-w-2xl mx-auto leading-relaxed">
            You don't need a direct skill partner. Teach 1 hour to any member to earn 1 Time Credit, then spend it learning whatever you want from anyone else!
          </p>
        </ScrollReveal>

        {/* Dynamic Credit Flow Economy Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: 3D Escrow Wallet */}
          <motion.div
            style={{ y: walletY, rotateX: walletRotateX, opacity: walletOpacity }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="p-8 sm:p-10 rounded-3xl border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.6),0_0_35px_rgba(214,179,106,0.15)] bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-3xl space-y-8 transition-all">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <span className="text-xs sm:text-sm font-mono font-black uppercase text-[#D6B36A] tracking-wider">TIME CREDIT ESCROW ENGINE</span>
                <TimeCreditBadge credits={1.0} size="md" />
              </div>

              <p className="text-base sm:text-lg text-[#B0BAC9] leading-relaxed">
                When you initiate a session, 1.0 Time Credit is locked safely in SkillSwap Smart Escrow. Upon session confirmation from both peers, the credit is transferred instantly.
              </p>

              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/15 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Clock className="w-6 h-6 text-[#D6B36A]" />
                  <div>
                    <div className="text-sm sm:text-base font-black text-white">Equal Value Rule</div>
                    <div className="text-xs sm:text-sm text-[#B0BAC9]">1 Hour = 1 Credit, regardless of topic</div>
                  </div>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </motion.div>

          {/* Right: Exchange Stories */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs sm:text-sm font-mono font-black uppercase text-[#8B7CFF] tracking-wider block">
              WHAT YOU CAN EXCHANGE WITH 1 TIME CREDIT:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {TIME_STORIES.map((story, i) => (
                <motion.div
                  key={story.result}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="p-6 sm:p-7 rounded-3xl border border-white/20 space-y-4 bg-white/[0.05] hover:bg-white/[0.09] backdrop-blur-2xl shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl">{story.icon}</span>
                    <span className="px-3 py-1 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] text-xs font-mono font-black border border-[#D6B36A]/40">
                      {story.hours}
                    </span>
                  </div>
                  <h4 className="font-black text-base sm:text-lg text-white">{story.result}</h4>
                  <span className="text-xs sm:text-sm text-[#B0BAC9]">{story.category}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TimeCreditEconomy;
