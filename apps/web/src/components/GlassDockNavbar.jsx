import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Trophy, Repeat, Calendar, MessageSquare, Shield, LogOut, Command, Sparkles, HelpCircle, Zap, Inbox } from 'lucide-react';
import TimeCreditBadge from './TimeCreditBadge';
import { useAuth } from '../context/AuthContext';

const GlassDockNavbar = ({ onOpenCmdK }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoHovered, setLogoHovered] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-2 sm:px-4 w-full max-w-[96%] sm:max-w-[98%] mx-auto pointer-events-none">
      <div className="pointer-events-auto rounded-full px-6 sm:px-8 py-3.5 border border-white/25 shadow-[0_15px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(139,124,255,0.2)] flex items-center justify-between transition-all duration-300 hover:border-white/40 backdrop-blur-2xl bg-[#0D1524]/60 relative overflow-hidden">
        
        {/* Glass Specular Top Highlight */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* Brand Logo */}
        <Link
          to="/"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          className="flex items-center gap-3 group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl accent-gradient-bg flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
            <Repeat className={`w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#101827] transition-transform duration-500 ${logoHovered ? 'rotate-180' : ''}`} />
          </div>
          <span className="font-sans font-black text-base sm:text-lg tracking-tight text-white flex items-center">
            Skill<span className="accent-gradient-text drop-shadow-[0_0_20px_rgba(139,124,255,0.4)]">Swap</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        {user ? (
          <nav className="hidden lg:flex items-center gap-2 text-sm font-extrabold text-[#B0BAC9] mx-4 flex-1 justify-center">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
              Dashboard
            </Link>
            <Link
              to="/discover"
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                isActive('/discover')
                  ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-4 h-4 text-[#8B7CFF]" />
              Discover
            </Link>
            <Link
              to="/matches"
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                isActive('/matches')
                  ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              <Repeat className="w-4 h-4 text-[#8B7CFF]" />
              Matches
            </Link>
            <Link
              to="/requests"
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                isActive('/requests')
                  ? 'bg-[#8B7CFF]/30 text-white font-black border border-[#8B7CFF]/50 shadow-glow backdrop-blur-md'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              <Inbox className="w-4 h-4 text-[#8B7CFF]" />
              Requests
            </Link>
            <Link
              to="/leaderboard"
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                isActive('/leaderboard')
                  ? 'bg-[#D6B36A]/25 text-[#D6B36A] font-black border border-[#D6B36A]/50 shadow-gold-glow backdrop-blur-md'
                  : 'hover:text-[#D6B36A] hover:bg-white/10'
              }`}
            >
              <Trophy className="w-4 h-4 text-[#D6B36A]" />
              Leaderboard
            </Link>
            <Link
              to="/sessions"
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                isActive('/sessions')
                  ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#72C7FF]" />
              Sessions
            </Link>
            <Link
              to="/chat"
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                isActive('/chat')
                  ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                  : 'hover:text-white hover:bg-white/10'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#72C7FF]" />
              Messages
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 text-[#D6B36A] font-black ${
                  isActive('/admin') ? 'bg-white/20 border border-[#D6B36A]/50' : 'hover:bg-white/10'
                }`}
              >
                <Shield className="w-4 h-4 text-[#D6B36A]" />
                Admin
              </Link>
            )}
          </nav>
        ) : (
          <nav className="flex items-center justify-evenly flex-1 px-8 text-sm font-extrabold text-[#B0BAC9]">
            <a
              href="#how-it-works"
              onClick={(e) => handleSectionClick(e, 'how-it-works')}
              className="hover:text-white transition-colors text-sm font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#8B7CFF]" />
              How it works
            </a>
            <Link to="/leaderboard" className="hover:text-[#D6B36A] transition-colors flex items-center gap-1.5 text-sm font-extrabold">
              <Trophy className="w-4.5 h-4.5 text-[#D6B36A]" /> Leaderboard
            </Link>
            <a
              href="#time-credits"
              onClick={(e) => handleSectionClick(e, 'time-credits')}
              className="hover:text-[#D6B36A] transition-colors text-sm font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#D6B36A]" />
              Time Credits
            </a>
          </nav>
        )}

        <div className="h-6 w-px bg-white/20 hidden lg:block shrink-0" />

        {/* Right Actions */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCmdK}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-white border border-white/20 flex items-center gap-1.5 transition-colors font-bold shadow-sm cursor-pointer"
            title="Command Palette (Cmd+K)"
          >
            <Command className="w-3.5 h-3.5 text-[#8B7CFF]" /> K
          </button>

          {user ? (
            <>
              <TimeCreditBadge credits={user.timeCredits} size="md" />
              <Link to={`/profile/${user.username}`}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white/30 hover:border-[#8B7CFF] transition-colors shadow-md"
                />
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="p-1.5 text-[#B0BAC9] hover:text-rose-400 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-extrabold text-white hover:text-[#8B7CFF] px-4 py-2 rounded-full transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm sm:text-base font-black accent-gradient-bg px-5 py-2.5 rounded-full shadow-glow hover:scale-105 transition-all text-[#101827] flex items-center gap-1.5"
              >
                Join SkillSwap
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default GlassDockNavbar;
