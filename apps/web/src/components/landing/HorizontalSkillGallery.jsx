import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Code, Layout, Music, Camera, Terminal, Palette, Globe, Cpu, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURED_SKILLS = [
  { name: 'C++ Systems', category: 'Technology', mentors: 24, icon: Code, color: '#8B7CFF' },
  { name: 'UI/UX Design', category: 'Design', mentors: 38, icon: Layout, color: '#8B7CFF' },
  { name: 'Acoustic Guitar', category: 'Music', mentors: 14, icon: Music, color: '#72C7FF' },
  { name: 'Photography', category: 'Arts', mentors: 19, icon: Camera, color: '#D6B36A' },
  { name: 'Python & AI', category: 'Data Science', mentors: 42, icon: Terminal, color: '#72C7FF' },
  { name: 'Figma Systems', category: 'Design', mentors: 31, icon: Palette, color: '#8B7CFF' },
  { name: 'Spanish Fluency', category: 'Languages', mentors: 27, icon: Globe, color: '#D6B36A' },
  { name: 'Quantum Basics', category: 'Physics', mentors: 8, icon: Cpu, color: '#8B7CFF' }
];

const HorizontalSkillGallery = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="discover-skills" className="py-20 relative border-y border-white/5 overflow-hidden">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#8B7CFF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-[#8B7CFF]/30 text-[#8B7CFF] text-xs sm:text-sm font-mono font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-[#8B7CFF]" /> Curated Knowledge Exchanges
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white tracking-tight leading-[0.98]">
              Explore Popular <span className="accent-gradient-rare drop-shadow-[0_0_35px_rgba(214,179,106,0.45)]">Skills</span>
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs sm:text-sm text-[#A1ACBC] font-mono hidden md:inline">
              Swipe or use arrows to navigate
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="p-3 rounded-full liquid-glass-base border border-white/20 text-white hover:bg-white/15 transition-all cursor-pointer shadow-sm"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="p-3 rounded-full liquid-glass-base border border-white/20 text-white hover:bg-white/15 transition-all cursor-pointer shadow-sm"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Smooth Touch & Mouse Scrollable Cards Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-7 overflow-x-auto scrollbar-none py-6 px-1 scroll-smooth snap-x snap-mandatory"
        >
          {FEATURED_SKILLS.map((skill, index) => {
            const IconComp = skill.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.03 }}
                className="w-80 sm:w-96 p-7 sm:p-8 rounded-3xl border border-white/20 space-y-6 flex flex-col justify-between bg-white/[0.05] hover:bg-white/[0.09] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] group cursor-pointer shrink-0 snap-start transition-all"
                onClick={() => navigate('/discover')}
              >
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/20 flex items-center justify-center group-hover:border-[#8B7CFF] backdrop-blur-md transition-colors">
                    <IconComp className="w-7 h-7" style={{ color: skill.color }} />
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-mono font-bold">
                    {skill.mentors} Mentors
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white group-hover:text-[#8B7CFF] transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-[#A1ACBC] mt-1.5">{skill.category}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm text-[#D6B36A] font-bold">
                  <span>1:1 Video Sessions</span>
                  <span>Free Exchange →</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
};

export default HorizontalSkillGallery;
