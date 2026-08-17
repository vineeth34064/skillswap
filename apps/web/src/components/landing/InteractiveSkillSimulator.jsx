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
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-base border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-bold shadow-glow">
            <Sparkles className="w-4 h-4 text-[#8B7CFF]" /> Live Skill Graph Explorer
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            SEE HOW SKILLSWAP <span className="accent-gradient-rare drop-shadow-[0_0_25px_rgba(214,179,106,0.4)]">MATCHES YOU.</span>
          </h2>

          <p className="text-base text-[#A1ACBC] max-w-xl mx-auto">
            Select what you know or want to learn. Our real-time engine maps sub-skills and matches you instantly with verified peer mentors.
          </p>
        </ScrollReveal>

        {/* Interactive Search Card */}
        <ScrollReveal direction="up" delay={0.2} className="max-w-4xl mx-auto">
          <div className="liquid-glass-premium p-6 sm:p-8 rounded-3xl border border-white/20 shadow-glass-3d space-y-8 bg-[#101827]/90 backdrop-blur-2xl">
            
            {/* Tab Controls & Input */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* Mode Toggle */}
              <div className="flex items-center p-1 rounded-2xl liquid-glass-base border border-white/15 bg-[#0D1524] w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('KNOW')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    activeTab === 'KNOW'
                      ? 'accent-gradient-bg text-[#101827] shadow-glow'
                      : 'text-[#B0BAC9] hover:text-white'
                  }`}
                >
                  WHAT I KNOW
                </button>
                <button
                  onClick={() => setActiveTab('WANT')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    activeTab === 'WANT'
                      ? 'accent-gradient-bg text-[#101827] shadow-glow'
                      : 'text-[#B0BAC9] hover:text-white'
                  }`}
                >
                  WHAT I WANT TO LEARN
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {Object.keys(SKILL_DATABASE).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setQuery(skill)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border transition-all cursor-pointer ${
                      query === skill
                        ? 'bg-[#8B7CFF]/20 border-[#8B7CFF] text-white shadow-glow'
                        : 'bg-white/5 border-white/15 text-[#B0BAC9] hover:border-white/30'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

            </div>

            {/* Dynamic Graph Branching Display */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-black uppercase tracking-widest text-[#8B7CFF] block">
                AUTOMATIC SUB-SKILL GRAPH MAP ({query}):
              </span>
              
              <div className="flex flex-wrap gap-2.5">
                <AnimatePresence mode="popLayout">
                  {selectedSkill.branches.map((branch, i) => (
                    <motion.div
                      key={branch}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="px-4 py-2 rounded-2xl liquid-glass-base border border-white/15 text-xs sm:text-sm font-extrabold text-white flex items-center gap-2 shadow-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#72C7FF]" />
                      <span>{branch}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Matches Preview */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <span className="text-xs font-mono font-black uppercase tracking-widest text-[#D6B36A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D6B36A]" /> MATCHED VERIFIED MENTORS READY TO SWAP:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSkill.mentors.map((mentor) => (
                  <div key={mentor.name} className="p-4 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={mentor.avatar} alt={mentor.name} className="w-11 h-11 rounded-2xl object-cover border border-white/20" />
                      <div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          {mentor.name}
                          <span className="text-xs text-[#D6B36A] font-mono flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-[#D6B36A]" /> {mentor.rating}
                          </span>
                        </div>
                        <div className="text-xs text-[#B0BAC9]">{mentor.role}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/login')}
                      className="px-3.5 py-1.5 rounded-full accent-gradient-bg text-[#101827] text-xs font-extrabold shadow-glow hover:scale-105 transition-all cursor-pointer"
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
