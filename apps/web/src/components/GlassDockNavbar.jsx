import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Trophy, Repeat, Calendar, MessageSquare, Shield, LogOut, Command, Sparkles, HelpCircle, Zap, Inbox, Menu, X, User, Film, Map, Wallet, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import TimeCreditBadge from './TimeCreditBadge';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const GlassDockNavbar = ({ onOpenCmdK }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoHovered, setLogoHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const navRef = useRef(null);

  const scrollNav = (direction) => {
    if (navRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      navRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleWheelNav = (e) => {
    if (navRef.current && e.deltaY !== 0) {
      navRef.current.scrollLeft += e.deltaY;
    }
  };

  const isActive = (path) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch pending requests badge for logged-in user
  useEffect(() => {
    if (user) {
      api.get('/sessions')
        .then(res => {
          if (res.success && res.sessions) {
            const incoming = res.sessions.filter(
              s => s.status === 'REQUESTED' && s.hostId && (s.hostId._id || s.hostId).toString() === (user._id || user.id).toString()
            );
            setPendingRequestsCount(incoming.length);
          }
        })
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogoClick = (e) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSectionClick = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-2 sm:px-4 w-full max-w-[98%] sm:max-w-[96%] mx-auto pointer-events-none">
        <div className="pointer-events-auto rounded-2xl sm:rounded-full px-4 sm:px-6 lg:px-8 py-3 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),0_0_20px_rgba(139,124,255,0.12)] flex items-center justify-between transition-all duration-300 hover:border-white/35 backdrop-blur-2xl bg-white/[0.05] hover:bg-white/[0.08] relative overflow-hidden">
          
          {/* Glass Specular Top Highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

          {/* Brand Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl accent-gradient-bg flex items-center justify-center shadow-glow transition-transform duration-300 group-hover:scale-110">
              <Repeat className={`w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-[#101827] transition-transform duration-500 ${logoHovered ? 'rotate-180' : ''}`} />
            </div>
            <span className="font-sans font-black text-base sm:text-lg tracking-tight text-white flex items-center">
              Skill<span className="accent-gradient-text drop-shadow-[0_0_20px_rgba(139,124,255,0.4)]">Swap</span>
            </span>
          </Link>

          {/* Desktop Center Nav Links */}
          {user ? (
            <div className="hidden lg:flex items-center gap-1 mx-2 flex-1 max-w-[58vw] xl:max-w-[65vw] relative group/nav">
              <button
                type="button"
                onClick={() => scrollNav('left')}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 shrink-0 transition-all cursor-pointer shadow-sm"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4 text-[#8B7CFF]" />
              </button>

              <nav
                ref={navRef}
                onWheel={handleWheelNav}
                className="flex items-center gap-1.5 xl:gap-2 text-sm font-extrabold text-[#B0BAC9] overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap py-1 px-1 flex-1"
              >
                <Link
                  to="/dashboard"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
                  className={`relative px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/requests')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Inbox className="w-4 h-4 text-[#8B7CFF]" />
                  Requests
                  {pendingRequestsCount > 0 && (
                    <span className="w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/leaderboard"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/leaderboard')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-[#D6B36A]" />
                  Leaderboard
                </Link>
                <Link
                  to="/sessions"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/sessions')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-[#8B7CFF]" />
                  Sessions
                </Link>
                <Link
                  to="/wallet"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/wallet')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-[#8B7CFF]" />
                  Wallet
                </Link>
                <Link
                  to="/reels"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/reels')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Film className="w-4 h-4 text-[#EC4899]" />
                  Reels
                </Link>
                <Link
                  to="/roadmaps"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/roadmaps')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Map className="w-4 h-4 text-[#72C7FF]" />
                  Roadmaps
                </Link>
                <Link
                  to="/chat"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/chat')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#8B7CFF]" />
                  Chat
                </Link>
                <Link
                  to="/community"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/community')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#72C7FF]" />
                  Community
                </Link>
                <Link
                  to="/analytics"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/analytics')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#8B7CFF]" />
                  Analytics
                </Link>
                <Link
                  to="/referrals"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/referrals')
                      ? 'bg-[#D6B36A]/20 text-[#D6B36A] font-black border border-[#D6B36A]/30 shadow-md backdrop-blur-md'
                      : 'hover:text-[#D6B36A] hover:bg-white/10'
                  }`}
                >
                  <Zap className="w-4 h-4 text-[#D6B36A]" />
                  Referrals
                </Link>
                <Link
                  to="/settings"
                  className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive('/settings')
                      ? 'bg-white/20 text-white font-black border border-white/30 shadow-md backdrop-blur-md'
                      : 'hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </Link>
                {(user.isAdmin || user.role === 'ADMIN') && (
                  <Link
                    to="/admin"
                    className={`px-3 xl:px-4 py-2 rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      isActive('/admin')
                        ? 'bg-rose-500/30 text-rose-300 font-black border border-rose-500/40 shadow-md backdrop-blur-md'
                        : 'hover:text-rose-400 hover:bg-rose-500/10'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-rose-400" />
                    Admin
                  </Link>
                )}
              </nav>

              <button
                type="button"
                onClick={() => scrollNav('right')}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 shrink-0 transition-all cursor-pointer shadow-sm"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4 text-[#8B7CFF]" />
              </button>
            </div>
          ) : (
            <nav className="hidden md:flex items-center justify-evenly flex-1 px-4 lg:px-8 text-sm font-extrabold text-[#B0BAC9]">
              <a
                href="#how-it-works"
                onClick={(e) => handleSectionClick(e, 'how-it-works')}
                className="hover:text-white transition-colors text-xs lg:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-[#8B7CFF]" />
                How it works
              </a>
              <Link to="/leaderboard" className="hover:text-[#D6B36A] transition-colors flex items-center gap-1.5 text-xs lg:text-sm font-extrabold">
                <Trophy className="w-4.5 h-4.5 text-[#D6B36A]" /> Leaderboard
              </Link>
              <a
                href="#time-credits"
                onClick={(e) => handleSectionClick(e, 'time-credits')}
                className="hover:text-[#D6B36A] transition-colors text-xs lg:text-sm font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#D6B36A]" />
                Time Credits
              </a>
            </nav>
          )}

          <div className="h-6 w-px bg-white/20 hidden lg:block shrink-0" />

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCmdK}
              className="hidden sm:flex px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-white border border-white/20 items-center gap-1.5 transition-colors font-bold shadow-sm cursor-pointer"
              title="Command Palette (Cmd+K)"
            >
              <Command className="w-3.5 h-3.5 text-[#8B7CFF]" /> K
            </button>

            {user ? (
              <>
                <div className="hidden sm:block">
                  <TimeCreditBadge credits={user.timeCredits} size="sm" />
                </div>
                <Link to={`/profile/${user.username}`}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white/30 hover:border-[#8B7CFF] transition-colors shadow-md"
                  />
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="hidden sm:flex px-3.5 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
                  title="Logout of current session"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-extrabold text-white hover:text-[#8B7CFF] px-3 sm:px-4 py-2 rounded-full transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-black accent-gradient-bg px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-glow hover:scale-105 transition-all text-[#101827] flex items-center gap-1.5"
                >
                  Join SkillSwap
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/15"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer / Fullscreen Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-2 top-20 z-40 lg:hidden p-5 rounded-3xl liquid-glass-premium border border-white/20 bg-[#0D1524]/75 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-3xl space-y-4 max-h-[82vh] overflow-y-auto custom-scrollbar"
          >
            {user ? (
              <div className="space-y-4">
                {/* Mobile User Profile Header */}
                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-2xl object-cover border border-white/20" />
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{user.name}</h4>
                      <p className="text-xs text-[#B0BAC9]">@{user.username}</p>
                    </div>
                  </div>
                  <TimeCreditBadge credits={user.timeCredits} size="sm" />
                </div>

                {/* Mobile Nav Links Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-black">
                  <Link
                    to="/dashboard"
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                      isActive('/dashboard') ? 'bg-[#8B7CFF]/20 border-[#8B7CFF]/50 text-white shadow-glow' : 'bg-white/[0.03] border-white/10 text-slate-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#8B7CFF]" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/discover"
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                      isActive('/discover') ? 'bg-[#8B7CFF]/20 border-[#8B7CFF]/50 text-white shadow-glow' : 'bg-white/[0.03] border-white/10 text-slate-300'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-[#8B7CFF]" />
                    <span>Discover</span>
                  </Link>

                  <Link
                    to="/matches"
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                      isActive('/matches') ? 'bg-[#8B7CFF]/20 border-[#8B7CFF]/50 text-white shadow-glow' : 'bg-white/[0.03] border-white/10 text-slate-300'
                    }`}
                  >
                    <Repeat className="w-4 h-4 text-[#8B7CFF]" />
                    <span>Matches</span>
                  </Link>

                  <Link
                    to="/requests"
                    className={`relative p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                      isActive('/requests') ? 'bg-[#8B7CFF]/20 border-[#8B7CFF]/50 text-white shadow-glow' : 'bg-white/[0.03] border-white/10 text-slate-300'
                    }`}
                  >
                    <Inbox className="w-4 h-4 text-[#8B7CFF]" />
                    <span>Requests</span>
                    {pendingRequestsCount > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/leaderboard"
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                      isActive('/leaderboard') ? 'bg-[#D6B36A]/20 border-[#D6B36A]/50 text-white shadow-gold-glow' : 'bg-white/[0.03] border-white/10 text-slate-300'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-[#D6B36A]" />
                    <span>Leaderboard</span>
                  </Link>

                  <Link
                    to="/sessions"
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                      isActive('/sessions') ? 'bg-[#8B7CFF]/20 border-[#8B7CFF]/50 text-white shadow-glow' : 'bg-white/[0.03] border-white/10 text-slate-300'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-[#8B7CFF]" />
                    <span>Sessions</span>
                  </Link>

                  <Link
                    to="/chat"
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                      isActive('/chat') ? 'bg-[#8B7CFF]/20 border-[#8B7CFF]/50 text-white shadow-glow' : 'bg-white/[0.03] border-white/10 text-slate-300'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-[#8B7CFF]" />
                    <span>Chat</span>
                  </Link>

                  <Link
                    to={`/profile/${user.username}`}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-2.5 ${
                      isActive(`/profile/${user.username}`) ? 'bg-[#8B7CFF]/20 border-[#8B7CFF]/50 text-white shadow-glow' : 'bg-white/[0.03] border-white/10 text-slate-300'
                    }`}
                  >
                    <User className="w-4 h-4 text-[#8B7CFF]" />
                    <span>Profile</span>
                  </Link>
                </div>

                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="w-full p-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 font-extrabold text-xs flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-rose-400" />
                    <span>Admin Control Dashboard</span>
                  </Link>
                )}

                {/* Mobile Search & Logout */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenCmdK(); }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/15"
                  >
                    <Command className="w-3.5 h-3.5 text-[#8B7CFF]" /> Quick Search
                  </button>

                  <button
                    onClick={() => { setMobileMenuOpen(false); logout(); navigate('/'); }}
                    className="py-2.5 px-4 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <a
                  href="#how-it-works"
                  onClick={(e) => handleSectionClick(e, 'how-it-works')}
                  className="block p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm font-extrabold"
                >
                  💡 How it works
                </a>
                <Link
                  to="/leaderboard"
                  className="block p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm font-extrabold"
                >
                  🏆 Top Mentors Leaderboard
                </Link>
                <a
                  href="#time-credits"
                  onClick={(e) => handleSectionClick(e, 'time-credits')}
                  className="block p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm font-extrabold"
                >
                  ⚡ Time Credits Economy
                </a>
                <div className="pt-3 flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="w-full py-3 rounded-2xl bg-white/10 text-white font-bold text-center text-sm border border-white/20"
                  >
                    Log In to Account
                  </Link>
                  <Link
                    to="/register"
                    className="w-full py-3 rounded-2xl accent-gradient-bg text-[#101827] font-black text-center text-sm shadow-glow"
                  >
                    Join SkillSwap Free
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlassDockNavbar;
