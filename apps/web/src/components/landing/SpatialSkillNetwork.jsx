import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ShieldCheck, Repeat, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NETWORK_MEMBERS = [
  { id: 'sarah', name: 'Sarah Jenkins', role: 'UI/UX Designer', teaches: 'Photoshop, Figma', wants: 'C++', match: 98, trust: 98, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', x: -220, y: -110 },
  { id: 'alex', name: 'Alex Rivera', role: 'Data Scientist', teaches: 'Python, ML', wants: 'Guitar', match: 94, trust: 96, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', x: 220, y: -90 },
  { id: 'elena', name: 'Elena Rostova', role: 'Linguist & Translator', teaches: 'Spanish, Grammar', wants: 'React', match: 91, trust: 95, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', x: -180, y: 120 },
  { id: 'daniel', name: 'Daniel Kim', role: 'Audio Engineer', teaches: 'Guitar, Mixing', wants: 'C++', match: 89, trust: 94, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', x: 200, y: 130 }
];

const SpatialSkillNetwork = () => {
  const navigate = useNavigate();
  const [activeMember, setActiveMember] = useState(null);

  return (
    <section className="py-28 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#8B7CFF]/15 via-[#72C7FF]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12 relative z-10 text-center">
        
        {/* Header */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full liquid-glass-base border border-[#8B7CFF]/30 text-[#8B7CFF] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Living Knowledge Web
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The SkillSwap <span className="accent-gradient-rare">Network</span>
          </h2>
          <p className="text-sm text-[#A1ACBC]">
            Hover over any node to inspect mentor capabilities and match compatibility in real time.
          </p>
        </div>

        {/* Spatial Network Canvas */}
        <div className="relative w-full max-w-4xl h-[500px] mx-auto flex items-center justify-center select-none">
          
          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {NETWORK_MEMBERS.map((m) => (
              <line
                key={m.id}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${m.x}px)`}
                y2={`calc(50% + ${m.y}px)`}
                stroke={activeMember === m.id ? '#8B7CFF' : 'rgba(255,255,255,0.12)'}
                strokeWidth={activeMember === m.id ? '2.5' : '1.5'}
                strokeDasharray={activeMember === m.id ? 'none' : '4 4'}
              />
            ))}
          </svg>

          {/* Central Node: YOU */}
          <div className="absolute z-30 w-24 h-24 rounded-full accent-gradient-bg p-1 shadow-glow flex flex-col items-center justify-center text-[#05070A] font-black text-sm">
            <Repeat className="w-6 h-6 stroke-[2.5]" />
            <span>YOU</span>
          </div>

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
                  left: `calc(50% + ${m.x}px - 28px)`,
                  top: `calc(50% + ${m.y}px - 28px)`
                }}
                animate={{
                  scale: isHovered ? 1.15 : 1
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className={`relative p-1 rounded-full border-2 transition-all ${
                  isHovered ? 'border-[#8B7CFF] shadow-glow' : 'border-white/20'
                }`}>
                  <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
                </div>

                {/* Spring Popover Card on Hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 p-4 rounded-2xl liquid-glass-base border border-[#8B7CFF]/50 bg-[#070A0F]/95 backdrop-blur-2xl shadow-glass-3d text-left space-y-2 pointer-events-none"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white">{m.name}</span>
                        <span className="text-[10px] font-mono font-extrabold text-[#D6B36A]">{m.match}% Match</span>
                      </div>
                      <p className="text-[10px] text-[#A1ACBC]">{m.role}</p>

                      <div className="pt-2 border-t border-white/10 text-[10px] space-y-1">
                        <div><strong className="text-[#8B7CFF]">Teaches:</strong> {m.teaches}</div>
                        <div><strong className="text-[#72C7FF]">Wants:</strong> {m.wants}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

        </div>

        {/* CTA */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 rounded-full accent-gradient-bg text-[#05070A] font-extrabold text-sm shadow-glow hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>Join the SkillSwap Network</span>
            <ArrowRight className="w-4 h-4 text-[#05070A]" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default SpatialSkillNetwork;
