import React, { useState } from 'react';
import { Sparkles, Repeat, Zap, ShieldCheck } from 'lucide-react';

const PersonalSkillNetwork = ({ user }) => {
  const [activeNode, setActiveNode] = useState(null);

  const skills = [
    { name: 'C++', type: 'teach', hours: 14, matches: 5, angle: 0, color: '#8B7CFF' },
    { name: 'React', type: 'teach', hours: 22, matches: 8, angle: 72, color: '#8B7CFF' },
    { name: 'Photoshop', type: 'learn', hours: 6, matches: 4, angle: 144, color: '#72C7FF' },
    { name: 'UI/UX Design', type: 'learn', hours: 10, matches: 6, angle: 216, color: '#72C7FF' },
    { name: 'Spanish', type: 'learn', hours: 4, matches: 3, angle: 288, color: '#D6B36A' },
  ];

  return (
    <div className="relative w-full h-[320px] flex items-center justify-center overflow-hidden rounded-3xl liquid-glass-base p-6 border border-white/10">
      
      {/* Background Subtle Radar Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* SVG Connecting Arc Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {skills.map((skill, idx) => {
          const radius = 110;
          const rad = (skill.angle * Math.PI) / 180;
          const x = 50 + (radius / 3.5) * Math.cos(rad);
          const y = 50 + (radius / 2.5) * Math.sin(rad);

          return (
            <g key={idx}>
              <line
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke={skill.color}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-40 animate-pulse"
              />
            </g>
          );
        })}
      </svg>

      {/* Central "YOU" Node */}
      <div className="relative z-20 w-20 h-20 rounded-full liquid-glass-base border-2 border-white/30 flex flex-col items-center justify-center text-center shadow-liquid bg-[#05070A]/80">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
          alt="You"
          className="w-10 h-10 rounded-full object-cover border border-white/40"
        />
        <span className="text-[10px] font-extrabold text-white mt-1 uppercase tracking-wider">YOU</span>
      </div>

      {/* Orbiting Skill Nodes */}
      {skills.map((skill, idx) => {
        const radius = 110;
        const rad = (skill.angle * Math.PI) / 180;
        const x = 50 + (radius / 3.5) * Math.cos(rad);
        const y = 50 + (radius / 2.5) * Math.sin(rad);

        return (
          <div
            key={idx}
            onMouseEnter={() => setActiveNode(skill)}
            onMouseLeave={() => setActiveNode(null)}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
          >
            <div
              className="px-3 py-1.5 rounded-2xl liquid-glass-base border text-xs font-bold shadow-md flex items-center gap-1.5 whitespace-nowrap"
              style={{ borderColor: `${skill.color}60`, color: skill.color }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: skill.color }} />
              {skill.name}
            </div>
          </div>
        );
      })}

      {/* Hover Info Overlay */}
      {activeNode && (
        <div className="absolute bottom-4 inset-x-6 z-40 p-3 rounded-2xl liquid-glass-base border border-white/15 text-xs text-slate-200 flex items-center justify-between animate-in fade-in duration-150">
          <div>
            <strong className="font-extrabold text-white">{activeNode.name}</strong> ({activeNode.type === 'teach' ? 'Teaches' : 'Wants to Learn'})
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-[#8B7CFF]">{activeNode.matches} Active Matches</span>
            <span className="text-[#D6B36A]">{activeNode.hours} hrs Exchanged</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default PersonalSkillNetwork;
