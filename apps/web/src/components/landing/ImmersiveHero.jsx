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
      className="relative min-h-[85vh] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-12 pt-4 pb-12 overflow-hidden selection:bg-[#8B7CFF] selection:text-white"
    >
      {/* Ambient Radial Lights */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-to-br from-[#8B7CFF]/18 via-[#72C7FF]/12 to-transparent rounded-full blur-[160px] pointer-events-none"
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

      {/* Asymmetrical Floating Background Network Nodes across Full Widescreen */}
      <motion.div
        style={{ x: networkX, y: networkY }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center z-0"
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

      {/* Main Ultra-Widescreen Hero Composition */}
      <div className="relative z-30 max-w-7xl mx-auto w-full pt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Typography */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-premium border border-[#8B7CFF]/50 text-[#8B7CFF] text-xs font-extrabold shadow-glow bg-[#101827]/90 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
            <span>Peer-to-Peer Knowledge Exchange Network</span>
          </div>

          {/* Guaranteed Visible Hero Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white font-sans leading-[1.05] flex flex-wrap gap-x-4 gap-y-2">
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: word.delay }}
                className={word.highlight ? 'accent-gradient-rare drop-shadow-[0_0_30px_rgba(214,179,106,0.45)]' : 'text-white'}
              >
                {word.text}
              </motion.span>
            ))}
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[#B0BAC9] max-w-xl leading-relaxed font-normal">
            Exchange your time and skills directly with peers around the world. Teach what you know, learn what you need — without money.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              data-cursor="skill"
              className="px-8 py-4 rounded-full accent-gradient-bg text-[#101827] font-extrabold text-sm shadow-glow hover:scale-105 transition-all flex items-center gap-2.5 group cursor-pointer"
            >
              <span>ENTER SKILLSWAP</span>
              <ArrowRight className="w-4 h-4 text-[#101827] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('discover-skills');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/discover');
              }}
              data-cursor="hover"
              className="px-7 py-4 rounded-full liquid-glass-premium border border-white/20 text-white font-bold text-sm hover:bg-white/15 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Explore 500+ Skills</span>
            </button>
          </div>

        </div>

        {/* Right Side: Interactive Hero Teaser Card */}
        <motion.div
          style={{ x: cardX, y: cardY }}
          initial={{ opacity: 1, scale: 1, y: 0 }}
          className="lg:col-span-5"
        >
          <div className="liquid-glass-premium p-7 rounded-3xl border border-white/25 shadow-glass-3d space-y-5 relative overflow-hidden bg-[#101827]/95 backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#8B7CFF] flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-[#8B7CFF]" /> Live Exchange Preview
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Reciprocal Exchange Nodes */}
            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-white">Alice Knows: C++ Systems</div>
                  <div className="text-[10px] text-[#B0BAC9]">Wants: Photoshop Pro</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF] text-[10px] font-mono font-bold border border-[#8B7CFF]/30">
                  1 HOUR
                </span>
              </div>

              <div className="flex justify-center my-1">
                <div className="w-9 h-9 rounded-full accent-gradient-bg flex items-center justify-center shadow-glow animate-bounce">
                  <Repeat className="w-4.5 h-4.5 text-[#101827]" />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-white">Bob Knows: Photoshop Pro</div>
                  <div className="text-[10px] text-[#B0BAC9]">Wants: C++ Systems</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#72C7FF]/20 text-[#72C7FF] text-[10px] font-mono font-bold border border-[#72C7FF]/30">
                  1 HOUR
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-[#D6B36A] font-bold border-t border-white/10">
              <span>98% Reciprocal Match</span>
              <span>0.00 Cost</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <div
        className="relative z-30 pt-6 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => {
          window.scrollBy({ top: 500, behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#B0BAC9] group-hover:text-white transition-colors">
          DISCOVER WHAT YOU CAN EXCHANGE
        </span>
        <div className="w-4 h-7 rounded-full border border-white/20 p-1 flex justify-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full bg-[#8B7CFF]"
          />
        </div>
      </div>
    </section>
  );
};

export default ImmersiveHero;
