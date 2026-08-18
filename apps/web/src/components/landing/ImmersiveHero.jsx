import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, Repeat, Mouse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FLOATING_NODES = [
  { name: 'Python', color: '#72C7FF', duration: 7.5, delay: 0 },
  { name: 'Spanish', color: '#D6B36A', duration: 9.5, delay: 0.5 },
  { name: 'Photoshop', color: '#D6B36A', duration: 8.0, delay: 1.0 },
  { name: 'Guitar', color: '#8B7CFF', duration: 10.5, delay: 0.2 },
  { name: 'React', color: '#72C7FF', duration: 8.8, delay: 0.8 }
];

const ImmersiveHero = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Scroll parallax depth tracking within the hero viewport
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24
  });

  // Layered 4-Depth Parallax Transforms
  const layer1BgY = useTransform(smoothProgress, [0, 1], [0, -25]);
  const layer2AmbientY = useTransform(smoothProgress, [0, 1], [0, -55]);
  const layer3CardY = useTransform(smoothProgress, [0, 1], [0, -100]);
  const layer4TypoY = useTransform(smoothProgress, [0, 1], [0, -160]);
  const layer4TypoOpacity = useTransform(smoothProgress, [0, 0.75], [1, 0]);
  const layer4TypoBlur = useTransform(smoothProgress, [0, 0.75], ['blur(0px)', 'blur(8px)']);
  const ctaY = useTransform(smoothProgress, [0, 1], [0, -75]);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[90vh] lg:min-h-[95vh] flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-4 pb-12 w-full max-w-[1550px] mx-auto selection:bg-[#8B7CFF] selection:text-white"
    >
      {/* Layer 1: Background & Layer 2: Ambient Glows */}
      <motion.div style={{ y: layer2AmbientY }} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#8B7CFF]/18 via-[#72C7FF]/12 to-transparent rounded-full blur-[170px]" />
        <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-[#D6B36A]/12 rounded-full blur-[170px]" />
      </motion.div>

      {/* Main 2-Column Hero Grid with Layered Parallax */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center z-10 w-full mt-4 sm:mt-8">
        
        {/* Left Column: Layer 4 Depth Typography */}
        <motion.div
          style={{
            y: layer4TypoY,
            opacity: layer4TypoOpacity,
            filter: layer4TypoBlur
          }}
          className="lg:col-span-7 space-y-7 sm:space-y-8 text-left"
        >
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full liquid-glass-base border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs sm:text-sm font-mono font-bold shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
            <span>Peer-to-Peer Knowledge Exchange Network</span>
          </motion.div>

          {/* Masked Headline - Large and Imposing */}
          <div className="space-y-1 sm:space-y-2 overflow-hidden">
            <motion.h1
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.65rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.2rem] font-black tracking-tight leading-[1.0] text-white"
            >
              YOUR KNOWLEDGE
            </motion.h1>
            <motion.h1
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.65rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.2rem] font-black tracking-tight leading-[1.0] text-white flex items-center gap-3 sm:gap-6"
            >
              <span>HAS</span>
              <span className="accent-gradient-text drop-shadow-[0_0_40px_rgba(139,124,255,0.5)]">VALUE.</span>
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-base sm:text-lg lg:text-xl text-[#B0BAC9] max-w-2xl font-medium leading-relaxed"
          >
            Exchange your time and skills directly with peers around the world.
            <br className="hidden sm:inline" />
            <span className="text-white font-semibold ml-1">Teach what you know, learn what you need — without money.</span>
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            style={{ y: ctaY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 sm:gap-5 pt-3"
          >
            <button
              onClick={() => onOpenAuth ? onOpenAuth('register') : navigate('/register')}
              className="px-8 sm:px-10 py-4 sm:py-4.5 rounded-full accent-gradient-bg text-[#101827] font-black text-sm sm:text-base shadow-glow hover:scale-105 transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
            >
              <span>ENTER SKILLSWAP</span>
              <ArrowRight className="w-5 h-5 text-[#101827]" />
            </button>

            <a
              href="#how-it-works"
              className="px-7 sm:px-8 py-4 sm:py-4.5 rounded-full liquid-glass-base border border-white/20 text-white font-extrabold text-sm sm:text-base hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore 500+ Skills</span>
            </a>
          </motion.div>

        </motion.div>

        {/* Right Column: Layer 3 Depth Live Exchange Preview Glass Card */}
        <motion.div
          style={{ y: layer3CardY }}
          initial={{ opacity: 0, scale: 0.92, rotateX: 6 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 w-full max-w-lg xl:max-w-xl mx-auto lg:ml-auto"
        >
          <div className="p-7 sm:p-9 rounded-3xl border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.6),0_0_35px_rgba(139,124,255,0.18)] bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-3xl space-y-6 relative transition-all">
            
            {/* Card Header with Active Signal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono font-extrabold tracking-wider text-[#8B7CFF] uppercase">
                <Repeat className="w-4 h-4 text-[#8B7CFF]" />
                <span>LIVE EXCHANGE PREVIEW</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34D399]" />
            </div>

            {/* Alice Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/15 backdrop-blur-md flex items-center justify-between transition-all">
              <div>
                <h4 className="text-sm sm:text-base font-black text-white">Alice Knows: C++</h4>
                <p className="text-xs sm:text-sm text-[#A1ACBC] mt-1">Wants: Photoshop</p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF] font-mono text-xs font-black border border-[#8B7CFF]/35">
                1 HOUR
              </span>
            </div>

            {/* Swap Animated Divider Circle */}
            <div className="flex justify-center -my-3 relative z-10">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 rounded-full accent-gradient-bg flex items-center justify-center text-[#101827] shadow-glow cursor-pointer"
              >
                <Repeat className="w-5 h-5 text-[#101827]" />
              </motion.div>
            </div>

            {/* Bob Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/15 backdrop-blur-md flex items-center justify-between transition-all">
              <div>
                <h4 className="text-sm sm:text-base font-black text-white">Bob Knows: Photoshop</h4>
                <p className="text-xs sm:text-sm text-[#A1ACBC] mt-1">Wants: C++</p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#72C7FF]/20 text-[#72C7FF] font-mono text-xs font-black border border-[#72C7FF]/35">
                1 HOUR
              </span>
            </div>

            {/* Card Footer: Match & Cost */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm font-bold">
              <span className="text-[#D6B36A] font-mono">98% Reciprocal Match</span>
              <span className="text-white font-mono">0.00 Cost</span>
            </div>

          </div>
        </motion.div>

      </div>

      {/* Layer 3: Floating Skill Node Physics & SVG Connections */}
      <div className="relative z-10 w-full pt-14 sm:pt-20">
        
        {/* Floating Non-Synchronized Skill Bubbles */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-mono font-bold text-slate-300">
          {FLOATING_NODES.map((node) => (
            <motion.div
              key={node.name}
              animate={{
                y: [-8, 8, -8]
              }}
              transition={{
                duration: node.duration,
                repeat: Infinity,
                delay: node.delay,
                ease: 'easeInOut'
              }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/15 hover:border-[#8B7CFF] hover:bg-white/[0.08] backdrop-blur-md transition-colors cursor-pointer shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: node.color }} />
              <span>{node.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Discover What You Can Exchange Hint */}
        <div className="text-center pt-8 space-y-2">
          <p className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-[#718096]">
            DISCOVER WHAT YOU CAN EXCHANGE
          </p>
          <Mouse className="w-5 h-5 text-[#718096] mx-auto animate-bounce opacity-75" />
        </div>

      </div>

    </section>
  );
};

export default ImmersiveHero;
