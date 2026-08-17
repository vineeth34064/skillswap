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
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass-base border border-[#8B7CFF]/30 text-[#8B7CFF] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Curated Knowledge Exchanges
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Explore Popular <span className="accent-gradient-rare">Skills</span>
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#A1ACBC] font-mono hidden md:inline">
              Swipe or use arrows to navigate
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="p-2.5 rounded-full liquid-glass-base border border-white/15 text-white hover:bg-white/10 transition-colors"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="p-2.5 rounded-full liquid-glass-base border border-white/15 text-white hover:bg-white/10 transition-colors"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Smooth Touch & Mouse Scrollable Cards Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none py-4 px-1 scroll-smooth snap-x snap-mandatory"
        >
          {FEATURED_SKILLS.map((skill, index) => {
            const IconComp = skill.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -6, scale: 1.02 }}
                className="w-72 sm:w-80 p-6 rounded-3xl liquid-glass-base border border-white/15 space-y-5 flex flex-col justify-between bg-[#0D1118]/90 shadow-glass-3d group cursor-pointer shrink-0 snap-start"
                onClick={() => navigate('/discover')}
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl liquid-glass-base border border-white/20 flex items-center justify-center group-hover:border-[#8B7CFF] transition-colors">
                    <IconComp className="w-6 h-6" style={{ color: skill.color }} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold">
                    {skill.mentors} Mentors
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-[#8B7CFF] transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-[#A1ACBC] mt-1">{skill.category}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#D6B36A] font-bold">
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
