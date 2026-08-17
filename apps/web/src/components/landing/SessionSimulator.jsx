import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Calendar, CheckCircle2, MessageSquare, Mic, MicOff, ScreenShare, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const SESSION_STEPS = [
  { label: 'REQUESTED', desc: 'Swap request sent from Alice to Bob for C++ ↔ Photoshop', color: '#8B7CFF' },
  { label: 'ACCEPTED', desc: 'Bob accepted request! 1 Time Credit escrow held safely', color: '#D6B36A' },
  { label: 'SCHEDULED', desc: 'Confirmed for Saturday @ 2:00 PM EST', color: '#72C7FF' },
  { label: 'LIVE SESSION', desc: '1-to-1 HD Video Call active with live screen share & notes', color: '#10B981' },
  { label: 'COMPLETED', desc: 'Session complete! Time credit transferred + 5.0 rating awarded', color: '#8B7CFF' }
];

const SessionSimulator = () => {
  const [currentStep, setCurrentStep] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % SESSION_STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeInfo = SESSION_STEPS[currentStep];

  return (
    <section className="py-24 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#72C7FF]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-10 relative z-10 text-center">
        
        {/* Title */}
        <ScrollReveal direction="up" className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-base border border-[#72C7FF]/30 text-[#72C7FF] text-xs font-bold shadow-blue-glow">
            <Video className="w-3.5 h-3.5" /> 1-to-1 Live Video Environment
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How a Session <span className="text-[#72C7FF]">Feels</span>
          </h2>
          <p className="text-sm text-[#A1ACBC]">
            Integrated HD video calls, shared code editors, notes, and instant session feedback.
          </p>
        </ScrollReveal>

        {/* Step Indicator Pills */}
        <ScrollReveal direction="zoom" delay={0.15} className="flex flex-wrap items-center justify-center gap-2">
          {SESSION_STEPS.map((s, i) => (
            <motion.button
              key={s.label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCurrentStep(i)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-extrabold transition-all border ${
                currentStep === i
                  ? 'bg-white text-[#05070A] border-white shadow-glow'
                  : 'liquid-glass-base text-[#A1ACBC] border-white/10 hover:text-white'
              }`}
            >
              {s.label}
            </motion.button>
          ))}
        </ScrollReveal>

        {/* Live Session Video Window Preview Mockup */}
        <ScrollReveal direction="up" delay={0.25} className="max-w-3xl mx-auto rounded-3xl liquid-glass-base border border-white/20 shadow-glass-3d overflow-hidden bg-[#070A0F]/90 text-left">
          
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-extrabold font-mono text-white ml-2">C++ ↔ UI/UX Exchange</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-extrabold border border-rose-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" /> LIVE • 42:15
              </span>
            </div>
          </div>

          {/* Video Grid */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 h-64 sm:h-72">
            
            {/* Participant 1: Sarah */}
            <motion.div whileHover={{ scale: 1.02 }} className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600"
                alt="Sarah"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-[#05070A]/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                Sarah (UI/UX Mentor)
              </div>
            </motion.div>

            {/* Participant 2: Vineet */}
            <motion.div whileHover={{ scale: 1.02 }} className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"
                alt="Vineet"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-[#05070A]/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                Vineet (C++ Student)
              </div>
            </motion.div>

          </div>

          {/* Bottom Call Controls & Live Step Description */}
          <div className="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02]">
            <div className="text-xs text-[#A1ACBC]">
              <strong className="text-white font-mono uppercase mr-2">{activeInfo.label}:</strong>
              {activeInfo.desc}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                <Mic className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-xl bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/40">
                <ScreenShare className="w-4 h-4" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

        </ScrollReveal>

      </div>
    </section>
  );
};

export default SessionSimulator;
