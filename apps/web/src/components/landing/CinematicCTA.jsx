import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

const CinematicCTA = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="invitation" className="py-32 relative overflow-hidden border-t border-white/10">
      
      {/* Subtle Single Champagne Light Beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-[#D6B36A]/10 via-[#8B7CFF]/15 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12 text-center relative z-10">
        
        {/* Minimalist Statements */}
        <ScrollReveal direction="zoom" className="space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-[#D6B36A]/40 text-[#D6B36A] text-xs sm:text-sm font-mono font-bold shadow-gold-glow">
            <Sparkles className="w-4 h-4 text-[#D6B36A]" /> The Invitation
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-snug font-sans">
            EXCHANGE SKILLS. <br />
            <span className="accent-gradient-rare drop-shadow-[0_0_25px_rgba(214,179,106,0.4)]">NOT MONEY.</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#A1ACBC] max-w-xl mx-auto font-sans leading-relaxed">
            Your knowledge has value. Share what you know, learn what you need, and connect with peers worldwide.
          </p>
        </ScrollReveal>

        {/* Magnetic CTA Button */}
        <ScrollReveal direction="up" delay={0.2} className="pt-8 flex flex-col items-center gap-5">
          <motion.button
            onClick={() => navigate('/register')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            data-cursor="time"
            className="px-12 sm:px-14 py-5 sm:py-6 rounded-full accent-gradient-bg text-[#05070A] font-black text-base sm:text-lg shadow-glow transition-all flex items-center gap-3.5 relative overflow-hidden group cursor-pointer"
          >
            <motion.div
              animate={{ x: isHovered ? ['-100%', '200%'] : '-100%' }}
              transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0 }}
              className="absolute inset-0 w-1/2 bg-white/30 skew-x-12 blur-sm pointer-events-none"
            />

            <span>{isHovered ? 'ENTER THE NETWORK →' : 'START SKILLSWAP'}</span>
            <ArrowRight className="w-6 h-6 text-[#05070A] group-hover:translate-x-2 transition-transform" />
          </motion.button>

          <span className="text-xs sm:text-sm text-[#A1ACBC] font-mono">
            Instant Signup • 2.0 Free Time Credits Included
          </span>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default CinematicCTA;
