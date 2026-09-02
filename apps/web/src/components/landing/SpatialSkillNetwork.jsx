import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ShieldCheck, Repeat, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NETWORK_MEMBERS = [
  { id: 'sarah', name: 'Sarah Jenkins', role: 'UI/UX Designer', teaches: 'Photoshop, Figma', wants: 'C++', match: 98, trust: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', x: -280, y: -140 },
  { id: 'alex', name: 'Alex Rivera', role: 'Data Scientist', teaches: 'Python, ML', wants: 'Guitar', match: 94, trust: 96, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', x: 280, y: -120 },
  { id: 'elena', name: 'Elena Rostova', role: 'Linguist & Translator', teaches: 'Spanish, Grammar', wants: 'React', match: 91, trust: 95, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', x: -240, y: 160 },
  { id: 'daniel', name: 'Daniel Kim', role: 'Audio Engineer', teaches: 'Guitar, Mixing', wants: 'C++', match: 89, trust: 94, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', x: 260, y: 170 }
];

const SpatialSkillNetwork = () => {
  const navigate = useNavigate();
  const [activeMember, setActiveMember] = useState(null);

  return (
    <section id="network" className="py-24 sm:py-32 relative overflow-hidden w-full max-w-full">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[900px] h-[500px] sm:h-[600px] bg-gradient-to-tr from-[#8B7CFF]/18 via-[#72C7FF]/15 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12 sm:space-y-16 relative z-10 text-center">
        
        {/* Header */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs sm:text-sm font-mono font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-[#8B7CFF]" /> Living Knowledge Web
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
            The SkillSwap <span className="accent-gradient-rare drop-shadow-[0_0_20px_rgba(214,179,106,0.4)]">Network</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A1ACBC] max-w-xl mx-auto leading-relaxed">
            Inspect mentor capabilities and reciprocal match compatibility in real time.
          </p>
        </div>

        {/* Mobile View: Responsive Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden text-left">
          {NETWORK_MEMBERS.map((m) => (
            <div key={m.id} className="p-6 rounded-3xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-2xl shadow-md space-y-4 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-2xl object-cover border border-white/20" />
                  <div>
                    <h4 className="font-black text-base text-white">{m.name}</h4>
                    <p className="text-xs text-[#A1ACBC]">{m.role}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-black border border-emerald-500/40">
                  {m.match}% MATCH
                </span>
              </div>
              <div className="text-xs sm:text-sm space-y-1.5 pt-3 border-t border-white/10">
                <div><span className="text-[#8B7CFF] font-bold">Teaches:</span> {m.teaches}</div>
                <div><span className="text-[#72C7FF] font-bold">Wants:</span> {m.wants}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Interactive Spatial Network Canvas */}
        <div className="hidden md:flex relative w-full max-w-5xl h-[680px] mx-auto items-center justify-center select-none rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
          
          {/* Connection Lines (SVG) with Flowing Pulse Animation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            {NETWORK_MEMBERS.map((m) => (
              <g key={m.id}>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${m.x}px)`}
                  y2={`calc(50% + ${m.y}px)`}
                  stroke={activeMember === m.id ? '#8B7CFF' : 'rgba(255,255,255,0.16)'}
                  strokeWidth={activeMember === m.id ? '3' : '2'}
                  strokeDasharray={activeMember === m.id ? 'none' : '6 6'}
                />
              </g>
            ))}
          </svg>

          {/* Central Node: YOU */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute z-30 w-32 h-32 rounded-full accent-gradient-bg p-1.5 shadow-glow flex flex-col items-center justify-center text-[#05070A] font-black text-base"
          >
            <Repeat className="w-8 h-8 stroke-[2.5]" />
            <span>YOU</span>
          </motion.div>

          {/* Member Nodes */}
          {NETWORK_MEMBERS.map((m) => {
            const isHovered = activeMember === m.id;
            return (
              <motion.div
                key={m.id}
                onMouseEnter={() => setActiveMember(m.id)}
                onMouseLeave={() => setActiveMember(null)}
                className="absolute z-20 cursor-pointer"
                style={{
                  left: `calc(50% + ${m.x}px - 36px)`,
                  top: `calc(50% + ${m.y}px - 36px)`
                }}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  y: [0, -6, 0]
                }}
                transition={{
                  scale: { type: 'spring', stiffness: 300, damping: 20 },
                  y: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }
                }}
              >
                <div className={`relative p-1.5 rounded-full border-2 transition-all backdrop-blur-md ${
                  isHovered ? 'border-[#8B7CFF] shadow-[0_0_25px_rgba(139,124,255,0.6)] bg-white/20' : 'border-white/30 bg-white/10 hover:border-white/60'
                }`}>
                  <img src={m.avatar} alt={m.name} className="w-16 h-16 rounded-full object-cover" />
                </div>

                {/* Spring Popover Card on Hover - Intelligently opens into canvas interior */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: m.y < 0 ? -10 : 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: m.y < 0 ? -10 : 10, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                      className={`absolute ${m.y < 0 ? 'top-full mt-4' : 'bottom-full mb-4'} left-1/2 -translate-x-1/2 w-80 p-5 rounded-3xl border border-[#8B7CFF]/60 bg-[#080C16]/98 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-left space-y-3 z-50 pointer-events-none`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-sm font-black text-white">{m.name}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-black border border-emerald-500/40">
                          {m.match}% Match
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#8B7CFF]">{m.role}</p>

                      <div className="pt-2.5 border-t border-white/10 text-xs space-y-1.5">
                        <div className="flex items-start gap-1.5">
                          <strong className="text-[#D6B36A] font-extrabold min-w-[62px]">Teaches:</strong>
                          <span className="text-white font-medium">{m.teaches}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <strong className="text-[#72C7FF] font-extrabold min-w-[62px]">Wants:</strong>
                          <span className="text-white font-medium">{m.wants}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

        </div>

        {/* CTA */}
        <div className="pt-8 flex justify-center">
          <motion.button
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 sm:px-14 py-5 sm:py-6 rounded-full accent-gradient-bg text-[#05070A] font-black text-base sm:text-lg shadow-glow transition-all flex items-center justify-center gap-3.5 cursor-pointer group"
          >
            <span>JOIN THE NETWORK</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#05070A] group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default SpatialSkillNetwork;
