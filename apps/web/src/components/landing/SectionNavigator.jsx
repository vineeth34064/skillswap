import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';

const SECTIONS = [
  { id: 'hero', label: '01', title: 'Hero' },
  { id: 'everyone-knows', label: '02', title: 'Philosophy' },
  { id: 'how-it-works', label: '03', title: 'Simulator' },
  { id: 'matching', label: '04', title: 'Matching' },
  { id: 'time-credits', label: '05', title: 'Economy' },
  { id: 'discover-skills', label: '06', title: 'Skills' },
  { id: 'network', label: '07', title: 'Network' },
  { id: 'sessions', label: '08', title: 'Sessions' },
  { id: 'trust', label: '09', title: 'Trust' },
  { id: 'invitation', label: '10', title: 'Join' }
];

const SectionNavigator = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside
      aria-label="Section Indicator"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 select-none pointer-events-auto"
    >
      <div className="p-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className="group relative flex items-center justify-center p-1 cursor-pointer"
              title={s.title}
            >
              {/* Tooltip on Hover */}
              <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg border border-white/15 bg-[#080E24]/90 backdrop-blur-md text-[11px] font-mono font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                {s.label} — {s.title}
              </span>

              {/* Indicator Dot / Pill */}
              <div
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'w-7 h-7 bg-gradient-to-br from-[#8B7CFF] to-[#72C7FF] text-[#05070A] font-mono text-[10px] font-black shadow-[0_0_15px_rgba(139,124,255,0.7)] scale-110'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/60 hover:scale-150'
                }`}
              >
                {isActive && s.label}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default SectionNavigator;
