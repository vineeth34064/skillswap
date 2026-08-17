import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import TimeCreditBadge from '../TimeCreditBadge';
import ScrollReveal from './ScrollReveal';

const TIME_STORIES = [
  { hours: '1 HOUR', result: 'Learned Figma Prototyping', category: 'Design', icon: '🎨' },
  { hours: '1 HOUR', result: 'Fixed C++ Memory Leak', category: 'Engineering', icon: '💻' },
  { hours: '1 HOUR', result: 'Mastered Python Async/Await', category: 'Backend', icon: '⚡' },
  { hours: '1 HOUR', result: 'Improved Tech Interview Pitch', category: 'Career', icon: '🚀' }
];

const TimeCreditEconomy = () => {
  return (
    <section id="time-credits" className="py-28 relative overflow-hidden">
      
      {/* Warm Champagne Gold Ambient Field */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[#D6B36A]/12 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-16 relative z-10">
        
        {/* Title Header */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-[#D6B36A]/40 text-[#D6B36A] text-xs font-bold shadow-gold-glow">
            <Zap className="w-4 h-4 text-[#D6B36A]" /> The Time Credit System
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            TIME IS THE <span className="text-[#D6B36A] drop-shadow-[0_0_25px_rgba(214,179,106,0.4)]">CURRENCY.</span>
          </h2>

          <p className="text-base text-[#A1ACBC] max-w-xl mx-auto">
            You don't need a direct skill partner. Teach 1 hour to any member to earn 1 Time Credit, then spend it learning whatever you want from anyone else!
          </p>
        </ScrollReveal>

        {/* Dynamic Credit Flow Economy Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <ScrollReveal direction="left" className="md:col-span-6 space-y-6">
            <div className="liquid-glass-premium p-7 rounded-3xl border border-white/20 shadow-glass-3d bg-[#101827]/90 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono font-black uppercase text-[#D6B36A] tracking-wider">TIME CREDIT ESCROW ENGINE</span>
                <TimeCreditBadge credits={1.0} size="md" />
              </div>

              <p className="text-sm text-[#B0BAC9] leading-relaxed">
                When you initiate a session, 1.0 Time Credit is locked safely in SkillSwap Smart Escrow. Upon session confirmation from both peers, the credit is transferred instantly.
              </p>

              <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#D6B36A]" />
                  <div>
                    <div className="text-xs font-extrabold text-white">Equal Value Rule</div>
                    <div className="text-[11px] text-[#B0BAC9]">1 Hour = 1 Credit, regardless of topic</div>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="md:col-span-6 space-y-4">
            <span className="text-xs font-mono font-black uppercase text-[#8B7CFF] tracking-wider block">
              WHAT YOU CAN EXCHANGE WITH 1 TIME CREDIT:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TIME_STORIES.map((story, i) => (
                <motion.div
                  key={story.result}
                  whileHover={{ scale: 1.03 }}
                  className="p-5 rounded-2xl liquid-glass-base border border-white/15 space-y-3 bg-[#101827]/80"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{story.icon}</span>
                    <span className="px-2.5 py-1 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] text-[10px] font-mono font-extrabold border border-[#D6B36A]/40">
                      {story.hours}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{story.result}</h4>
                  <span className="text-[11px] text-[#B0BAC9]">{story.category}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};

export default TimeCreditEconomy;
