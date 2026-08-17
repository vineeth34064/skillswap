import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TimeCreditBadge from './TimeCreditBadge';
import {
  Compass,
  Repeat,
  MessageSquare,
  Calendar,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const Navbar = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled
        ? 'glass-elevated border-b border-white/10 shadow-soft py-0'
        : 'bg-transparent border-b border-transparent py-1'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl gradient-signature-bg flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Repeat className="w-5 h-5 text-[#07090D] stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white font-sans">
              Skill<span className="gradient-signature-text">Swap</span>
            </span>
            <span className="block text-[9px] text-[#94A3B8] font-semibold tracking-wider uppercase -mt-1">
              Exchange Skills, Not Money
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {user ? (
          <nav className="hidden md:flex items-center gap-1 font-medium text-xs">
            <Link
              to="/dashboard"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'glass-premium text-[#8B7CFF] border border-[#8B7CFF]/40 font-bold shadow-glow'
                  : 'text-slate-300 hover:text-[#8B7CFF] hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" />
              Dashboard
            </Link>
            <Link
              to="/discover"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/discover')
                  ? 'glass-premium text-[#8B7CFF] border border-[#8B7CFF]/40 font-bold shadow-glow'
                  : 'text-slate-300 hover:text-[#8B7CFF] hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#8B7CFF]" />
              Discover
            </Link>
            <Link
              to="/matches"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/matches')
                  ? 'glass-premium text-[#8B7CFF] border border-[#8B7CFF]/40 font-bold shadow-glow'
                  : 'text-slate-300 hover:text-[#8B7CFF] hover:bg-white/5'
              }`}
            >
              <Repeat className="w-3.5 h-3.5 text-[#8B7CFF]" />
              Matches
            </Link>

            <Link
              to="/sessions"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/sessions')
                  ? 'glass-premium text-[#72C7FF] border border-[#72C7FF]/40 font-bold shadow-blue-glow'
                  : 'text-slate-300 hover:text-[#72C7FF] hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#72C7FF]" />
              Sessions
            </Link>
            <Link
              to="/chat"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                isActive('/chat')
                  ? 'glass-premium text-[#72C7FF] border border-[#72C7FF]/40 font-bold shadow-blue-glow'
                  : 'text-slate-300 hover:text-[#72C7FF] hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#72C7FF]" />
              Messages
            </Link>
            {user.isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 text-[#D6B36A] font-bold ${
                  isActive('/admin') ? 'glass-premium border border-[#D6B36A]/40 shadow-gold-glow' : 'hover:bg-white/5'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#D6B36A]" />
                Admin
              </Link>
            )}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-[#8B7CFF] transition-colors">How it works</a>
            <a href="#time-credits" className="hover:text-[#D6B36A] transition-colors">Time Credits</a>
            <a href="#trust" className="hover:text-[#72C7FF] transition-colors">Trust & Verification</a>
          </nav>
        )}

        {/* User Right Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <TimeCreditBadge credits={user.timeCredits} />
              
              <Link to={`/profile/${user.username}`} className="flex items-center gap-2 group">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#8B7CFF]/40 group-hover:border-[#8B7CFF] transition-colors"
                />
                <span className="text-xs font-semibold text-slate-200 group-hover:text-[#8B7CFF]">
                  {user.name.split(' ')[0]}
                </span>
              </Link>

              <button
                onClick={() => { logout(); navigate('/'); }}
                className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-bold text-slate-200 hover:text-white px-3 py-2 rounded-xl transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="text-xs font-extrabold gradient-signature-bg px-4 py-2 rounded-xl shadow-glow hover:scale-105 transition-all"
              >
                Join SkillSwap
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {user && <TimeCreditBadge credits={user.timeCredits} size="sm" />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-premium border-t border-white/10 px-4 pt-3 pb-6 space-y-3 bg-[#07090D]/95">
          {user ? (
            <>
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-white text-sm">{user.name}</div>
                  <div className="text-xs text-slate-400">@{user.username}</div>
                </div>
              </div>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-xs">Dashboard</Link>
              <Link to="/discover" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-xs">Discover Skills</Link>
              <Link to="/matches" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-xs">Your Matches</Link>
              <Link to="/sessions" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-xs">Sessions</Link>
              <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-xs">Messages</Link>
              <Link to={`/profile/${user.username}`} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-200 font-medium text-xs">Profile</Link>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                className="w-full text-left py-2 text-red-400 font-medium text-xs flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <button
                onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 font-bold text-slate-200 border border-white/10 rounded-xl text-xs"
              >
                Log In
              </button>
              <button
                onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 font-extrabold gradient-signature-bg rounded-xl text-xs shadow-glow"
              >
                Join SkillSwap
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
