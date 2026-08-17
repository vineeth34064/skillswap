import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, Repeat, Calendar, MessageSquare, User, Zap, Shield, Trophy, ArrowRight } from 'lucide-react';

const CmdKModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { label: 'Global Leaderboard & Rankings', icon: Trophy, route: '/leaderboard', cat: 'Navigation' },
    { label: 'Discover Skills & Mentors', icon: Compass, route: '/discover', cat: 'Navigation' },
    { label: 'View Skill Matches', icon: Repeat, route: '/matches', cat: 'Navigation' },
    { label: 'Workspace Sessions', icon: Calendar, route: '/sessions', cat: 'Navigation' },
    { label: 'Messages & Chat', icon: MessageSquare, route: '/chat', cat: 'Navigation' },
    { label: 'Time Credit Ledger', icon: Zap, route: '/dashboard', cat: 'Wallet' },
    { label: 'Platform Moderation', icon: Shield, route: '/admin', cat: 'Admin' },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (route) => {
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-[#05070A]/80 backdrop-blur-xl">
      <div className="w-full max-w-xl liquid-glass-base rounded-3xl border border-white/15 shadow-liquid overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8B7CFF]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search skills (e.g. C++, React, Leaderboard)..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-[#667085]"
          />
          <button onClick={onClose} className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-400">ESC</button>
        </div>

        {/* Command Results */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-1">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#667085] px-3 py-1">Quick Commands</div>
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No command results matching "{query}"</div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(cmd.route)}
                  className="w-full p-3 rounded-2xl hover:bg-white/10 text-left flex items-center justify-between text-xs font-semibold text-white transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#8B7CFF] group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{cmd.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-white transition-colors" />
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-white/10 bg-white/[0.02] text-[11px] text-[#667085] flex items-center justify-between px-4">
          <span>Navigate with arrow keys</span>
          <span>SkillSwap Command Palette</span>
        </div>

      </div>
    </div>
  );
};

export default CmdKModal;
