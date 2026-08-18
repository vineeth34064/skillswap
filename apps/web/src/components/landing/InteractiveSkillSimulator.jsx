import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, User, ArrowRight, Star, ShieldCheck, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

const SKILL_DATABASE = {
  'C++': {
    branches: ['Algorithms', 'Data Structures', 'Competitive Programming', 'Memory Management', 'Game Engines'],
    mentors: [
      { name: 'Sarah Jenkins', role: 'Senior C++ & UI Specialist', rating: 5.0, reviews: 16, city: 'San Francisco', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
      { name: 'Vineet Kumar', role: 'Full-Stack C++ / Systems', rating: 4.9, reviews: 12, city: 'Seattle', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
    ]
  },
  'UI/UX Design': {
    branches: ['Figma Mastery', 'Wireframing', 'Design Systems', 'User Research', 'Prototyping'],
    mentors: [
      { name: 'Elena Rostova', role: 'Lead Product Designer', rating: 5.0, reviews: 22, city: 'London', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      { name: 'Alex Rivera', role: 'UX Researcher & Architect', rating: 4.8, reviews: 9, city: 'Austin', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
    ]
  },
  'Python': {
    branches: ['Data Science', 'Machine Learning', 'Automation', 'FastAPI', 'Pandas & NumPy'],
    mentors: [
      { name: 'Alex Rivera', role: 'Data Scientist & ML Engineer', rating: 4.9, reviews: 18, city: 'Austin', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }
    ]
  },
  'React': {
    branches: ['Next.js App Router', 'State Management', 'Tailwind CSS', 'Performance Tuning'],
    mentors: [
      { name: 'Vineet Kumar', role: 'Senior React Developer', rating: 4.9, reviews: 14, city: 'Seattle', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }
    ]
  }
};

const InteractiveSkillSimulator = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('KNOW');
  const [query, setQuery] = useState('C++');

  const selectedSkill = SKILL_DATABASE[query] || SKILL_DATABASE['C++'];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#8B7CFF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12 relative z-10">
        
        {/* Title Header */}
        <ScrollReveal direction="up" className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs sm:text-sm font-mono font-bold shadow-glow">
            <Sparkles className="w-4 h-4 text-[#8B7CFF]" /> Live Skill Graph Explorer
          </div>

          <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black text-white tracking-tight leading-[0.98]">
            SEE HOW SKILLSWAP <span className="accent-gradient-rare drop-shadow-[0_0_35px_rgba(214,179,106,0.45)]">MATCHES YOU.</span>
          </h2>

          <p className="text-base sm:text-xl text-[#A1ACBC] max-w-2xl mx-auto leading-relaxed">
            Select what you know or want to learn. Our real-time engine maps sub-skills and matches you instantly with verified peer mentors.
          </p>
        </ScrollReveal>

        {/* Interactive Search Card */}
        <ScrollReveal direction="up" delay={0.2} className="max-w-5xl xl:max-w-6xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.6),0_0_35px_rgba(139,124,255,0.18)] space-y-10 bg-white/[0.05] hover:bg-white/[0.08] backdrop-blur-3xl transition-all">
            
            {/* Tab Controls & Input */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              
              {/* Mode Toggle */}
              <div className="flex items-center p-1.5 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('KNOW')}
                  className={`px-6 sm:px-8 py-3.5 rounded-xl text-xs sm:text-base font-black transition-all cursor-pointer ${
                    activeTab === 'KNOW'
                      ? 'accent-gradient-bg text-[#101827] shadow-glow'
                      : 'text-[#B0BAC9] hover:text-white'
                  }`}
                >
                  WHAT I KNOW
                </button>
                <button
                  onClick={() => setActiveTab('WANT')}
                  className={`px-6 sm:px-8 py-3.5 rounded-xl text-xs sm:text-base font-black transition-all cursor-pointer ${
                    activeTab === 'WANT'
                      ? 'accent-gradient-bg text-[#101827] shadow-glow'
                      : 'text-[#B0BAC9] hover:text-white'
                  }`}
                >
                  WHAT I WANT TO LEARN
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
                {Object.keys(SKILL_DATABASE).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setQuery(skill)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-mono font-bold border transition-all cursor-pointer ${
                      query === skill
                        ? 'bg-[#8B7CFF]/25 border-[#8B7CFF] text-white shadow-glow'
                        : 'bg-white/5 border-white/15 text-[#B0BAC9] hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

            </div>

            {/* Dynamic Graph Branching Display */}
            <div className="space-y-5">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-[#8B7CFF] block">
                AUTOMATIC SUB-SKILL GRAPH MAP ({query}):
              </span>
              
              <div className="flex flex-wrap gap-3 sm:gap-3.5">
                <AnimatePresence mode="popLayout">
                  {selectedSkill.branches.map((branch, i) => (
                    <motion.div
                      key={branch}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="px-5 py-2.5 rounded-2xl border border-white/20 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-sm sm:text-base font-extrabold text-white flex items-center gap-2.5 shadow-sm transition-all"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#72C7FF]" />
                      <span>{branch}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Matches Preview */}
            <div className="space-y-5 pt-6 border-t border-white/10">
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-[#D6B36A] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D6B36A]" /> MATCHED VERIFIED MENTORS READY TO SWAP:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {selectedSkill.mentors.map((mentor) => (
                  <div key={mentor.name} className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 backdrop-blur-md flex items-center justify-between gap-4 transition-all">
                    <div className="flex items-center gap-4">
                      <img src={mentor.avatar} alt={mentor.name} className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border border-white/20" />
                      <div>
                        <div className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          {mentor.name}
                          <span className="text-xs sm:text-sm text-[#D6B36A] font-mono flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-[#D6B36A]" /> {mentor.rating}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-[#B0BAC9]">{mentor.role}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/login')}
                      className="px-5 py-2.5 rounded-full accent-gradient-bg text-[#101827] text-xs sm:text-sm font-black shadow-glow hover:scale-105 transition-all cursor-pointer shrink-0"
                    >
                      Swap
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </ScrollReveal>

      </div>

    </section>
  );
};

export default InteractiveSkillSimulator;
