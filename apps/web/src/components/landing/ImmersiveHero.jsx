import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, Repeat, Code, Layout, Video, ShieldCheck, Globe, Star, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SKILL_NODES = [
  { id: 1, name: 'C++ Systems', category: 'Technology', x: -440, y: -110, color: '#8B7CFF' },
  { id: 2, name: 'UI/UX Design', category: 'Design', x: 420, y: -130, color: '#8B7CFF' },
  { id: 3, name: 'React & Next.js', category: 'Frontend', x: 450, y: 70, color: '#72C7FF' },
  { id: 4, name: 'Python AI', category: 'Data & AI', x: -460, y: 80, color: '#72C7FF' },
  { id: 5, name: 'Photoshop Pro', category: 'Design', x: -240, y: 220, color: '#D6B36A' },
  { id: 6, name: 'Spanish Fluency', category: 'Languages', x: 250, y: 220, color: '#D6B36A' },
  { id: 7, name: 'Acoustic Guitar', category: 'Music', x: 0, y: 230, color: '#8B7CFF' }
];

const ImmersiveHero = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState(null);

  // Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 22, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax layers
  const bgX = useTransform(smoothMouseX, [-500, 500], [-10, 10]);
  const bgY = useTransform(smoothMouseY, [-500, 500], [-10, 10]);

  const networkX = useTransform(smoothMouseX, [-500, 500], [-22, 22]);
  const networkY = useTransform(smoothMouseY, [-500, 500], [-22, 22]);

  const cardX = useTransform(smoothMouseX, [-500, 500], [16, -16]);
  const cardY = useTransform(smoothMouseY, [-500, 500], [16, -16]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const words = [
    { text: 'YOUR', delay: 0 },
    { text: 'KNOWLEDGE', delay: 0.08 },
    { text: 'HAS', delay: 0.16 },
    { text: 'VALUE.', delay: 0.24, highlight: true }
  ];

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[85vh] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-12 pt-4 pb-12 overflow-hidden selection:bg-[#8B7CFF] selection:text-white w-full max-w-full"
    >
      {/* Ambient Radial Lights */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[600px] sm:h-[850px] bg-gradient-to-br from-[#8B7CFF]/18 via-[#72C7FF]/12 to-transparent rounded-full blur-[140px] pointer-events-none"
      />
      
      {/* Left Far Edge Spatial Badge */}
      <div className="hidden xl:flex absolute left-8 top-1/3 -translate-y-1/2 z-20 flex-col gap-3 pointer-events-auto">
        <div className="p-3.5 rounded-2xl liquid-glass-premium border border-white/20 shadow-glass-3d bg-[#101827]/90 space-y-1 max-w-[200px]">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#D6B36A]">
            <Zap className="w-4 h-4 fill-[#D6B36A]" /> 2,480 Swaps Today
          </div>
          <p className="text-[10px] text-[#B0BAC9]">Active peer sessions happening worldwide right now.</p>
        </div>
      </div>

      {/* Right Far Edge Spatial Badge */}
      <div className="hidden xl:flex absolute right-8 top-1/3 -translate-y-1/2 z-20 flex-col gap-3 pointer-events-auto">
        <div className="p-3.5 rounded-2xl liquid-glass-premium border border-white/20 shadow-glass-3d bg-[#101827]/90 space-y-1 max-w-[200px]">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Escrow Protected
          </div>
          <p className="text-[10px] text-[#B0BAC9]">Time credits locked safely until session completion.</p>
        </div>
      </div>

      {/* Floating Background Network Nodes on Large Screens Only */}
      <motion.div
        style={{ x: networkX, y: networkY }}
        className="hidden lg:flex absolute inset-0 pointer-events-none items-center justify-center z-0 overflow-hidden"
      >
        <div className="relative w-full max-w-7xl h-[450px]">
          {SKILL_NODES.map((node) => {
            const isHovered = activeNode === node.id;
            return (
              <motion.div
                key={node.id}
                data-cursor="skill"
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                className="absolute pointer-events-auto cursor-pointer group"
                style={{
                  left: `calc(50% + ${node.x}px)`,
                  top: `calc(50% + ${node.y}px)`
                }}
                animate={{
                  y: [0, -8, 0],
                  scale: isHovered ? 1.15 : 1
                }}
                transition={{
                  y: { duration: 4 + (node.id % 3), repeat: Infinity, ease: 'easeInOut' },
                  scale: { type: 'spring', stiffness: 300, damping: 20 }
                }}
              >
                <div className={`px-4 py-2 rounded-full liquid-glass-premium border transition-all duration-300 flex items-center gap-2 shadow-lg ${
                  isHovered
                    ? 'bg-[#172235] border-[#8B7CFF] text-white shadow-glow scale-105'
                    : 'bg-white/[0.10] border-white/20 text-[#B0BAC9] hover:border-white/35'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: node.color }} />
                  <span className="text-xs font-extrabold font-mono tracking-wide">{node.name}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Hero Center Content Card */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mt-2 sm:mt-4 space-y-4 sm:space-y-6">
        
        {/* Subtle Live Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-white/20 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B7CFF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B7CFF]"></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
            Peer Knowledge Exchange Economy
          </span>
        </motion.div>

        {/* Cinematic Headline */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] flex flex-wrap justify-center gap-x-3 sm:gap-x-5 gap-y-1">
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: word.delay, ease: 'easeOut' }}
                className={word.highlight ? 'accent-gradient-rare drop-shadow-[0_0_30px_rgba(214,179,106,0.45)]' : 'text-white'}
              >
                {word.text}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-base sm:text-xl font-medium text-[#B0BAC9] max-w-2xl mx-auto pt-2 sm:pt-4 px-2"
          >
            Teach what you know. Learn what you desire. 
            <span className="text-white font-semibold block sm:inline sm:ml-1">Every hour taught earns 1 Time Credit. Zero currency needed.</span>
          </motion.p>
        </div>

        {/* Primary Interactive CTA Cluster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2"
        >
          <button
            onClick={() => onOpenAuth ? onOpenAuth('register') : navigate('/register')}
            className="w-full sm:w-auto px-8 py-4 rounded-full accent-gradient-bg text-[#101827] font-black text-sm sm:text-base shadow-glow hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Start Free Skill Swap</span>
            <ArrowRight className="w-4 h-4 text-[#101827] group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-6 py-4 rounded-full liquid-glass-base border border-white/20 text-white font-extrabold text-sm sm:text-base hover:bg-white/10 hover:border-white/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>How Time Banking Works</span>
          </a>
        </motion.div>

      </div>

      {/* Bottom Floating Stats Strip */}
      <motion.div
        style={{ x: cardX, y: cardY }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-8 sm:mt-12"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-5 rounded-3xl liquid-glass-premium border border-white/20 shadow-glass-3d bg-[#101827]/75 backdrop-blur-2xl">
          
          <div className="p-3 text-center sm:border-r border-white/10 space-y-1">
            <div className="text-xl sm:text-3xl font-black text-white font-mono flex items-center justify-center gap-1">
              1,250<span className="text-[#8B7CFF]">+</span>
            </div>
            <div className="text-[11px] sm:text-xs text-[#B0BAC9] font-medium">Active Mentors</div>
          </div>

          <div className="p-3 text-center sm:border-r border-white/10 space-y-1">
            <div className="text-xl sm:text-3xl font-black text-white font-mono flex items-center justify-center gap-1">
              450<span className="text-[#72C7FF]">+</span>
            </div>
            <div className="text-[11px] sm:text-xs text-[#B0BAC9] font-medium">Distinct Skills</div>
          </div>

          <div className="p-3 text-center sm:border-r border-white/10 space-y-1">
            <div className="text-xl sm:text-3xl font-black text-white font-mono flex items-center justify-center gap-1">
              98.4<span className="text-emerald-400">%</span>
            </div>
            <div className="text-[11px] sm:text-xs text-[#B0BAC9] font-medium">Satisfaction Rate</div>
          </div>

          <div className="p-3 text-center space-y-1">
            <div className="text-xl sm:text-3xl font-black text-[#D6B36A] font-mono flex items-center justify-center gap-1">
              $0.00
            </div>
            <div className="text-[11px] sm:text-xs text-[#B0BAC9] font-medium">Pure Skill Barter</div>
          </div>

        </div>
      </motion.div>

    </section>
  );
};

export default ImmersiveHero;
