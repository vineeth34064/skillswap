import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import LiquidGlassCard from '../components/LiquidGlassCard';
import TimeCreditBadge from '../components/TimeCreditBadge';
import SwapRequestModal from '../components/SwapRequestModal';
import { Sparkles, ArrowRight, Zap, Repeat, Award, Compass, MessageSquare, ShieldCheck, CheckCircle2, Star, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ onOpenOnboarding }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [topMentors, setTopMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Swap Request Modal State
  const [selectedSwapPartner, setSelectedSwapPartner] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchRes, sessRes, mentorRes] = await Promise.all([
          api.get('/matches'),
          api.get('/sessions'),
          api.get('/leaderboard/top')
        ]);

        if (matchRes.success) setMatches(matchRes.matches || []);
        if (sessRes.success) setSessions(sessRes.sessions || []);
        if (mentorRes.success) setTopMentors(mentorRes.topMentors || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: 'easeOut'
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[96%] sm:max-w-[98%] mx-auto px-4 sm:px-8 py-10 space-y-10 relative z-10"
    >
      
      {/* Background Spatial Glows */}
      <div className="absolute top-10 left-1/3 w-[550px] h-[550px] bg-[#8B7CFF]/12 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-white/5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B7CFF]/15 border border-[#8B7CFF]/30 text-[#8B7CFF] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" /> ACTIVE USER DASHBOARD
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Welcome back, <span className="accent-gradient-text">{user?.name}</span> 👋
          </h1>
          <p className="text-sm text-[#B0BAC9]">
            {user?.city} • Member Trust Score: <strong className="text-emerald-400 font-mono">{user?.trustScore || 90}%</strong>
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-3.5 shrink-0">
          <TimeCreditBadge credits={user?.timeCredits} size="lg" />
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenOnboarding}
            className="px-5 py-3 rounded-full bg-[#D6B36A]/20 hover:bg-[#D6B36A]/30 text-[#D6B36A] border border-[#D6B36A]/40 font-extrabold text-xs sm:text-sm shadow-gold-glow flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#D6B36A]" />
            <span>Teach & Learn Skills Setup</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/discover')}
            className="px-6 py-3 rounded-full accent-gradient-bg text-[#101827] font-black text-xs sm:text-sm shadow-glow flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Find Skill Swap</span>
            <ArrowRight className="w-4 h-4 text-[#101827]" />
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Quick Bar */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
          <LiquidGlassCard className="p-5 flex items-center gap-4 bg-[#101827]/80">
            <div className="w-12 h-12 rounded-2xl bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/30 flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">{user?.timeCredits || 2.0}</div>
              <div className="text-xs text-[#B0BAC9] font-semibold">Time Credits Available</div>
            </div>
          </LiquidGlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
          <LiquidGlassCard className="p-5 flex items-center gap-4 bg-[#101827]/80">
            <div className="w-12 h-12 rounded-2xl bg-[#72C7FF]/20 text-[#72C7FF] border border-[#72C7FF]/30 flex items-center justify-center font-bold text-xl">
              ⏱️
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">{user?.teachingHours || 0} Hours</div>
              <div className="text-xs text-[#B0BAC9] font-semibold">Spent Teaching Peers</div>
            </div>
          </LiquidGlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
          <LiquidGlassCard className="p-5 flex items-center gap-4 bg-[#101827]/80">
            <div className="w-12 h-12 rounded-2xl bg-[#D6B36A]/20 text-[#D6B36A] border border-[#D6B36A]/30 flex items-center justify-center font-bold text-xl">
              🛡️
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">{user?.trustScore || 90} / 100</div>
              <div className="text-xs text-[#B0BAC9] font-semibold">Trust Score Rating</div>
            </div>
          </LiquidGlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
          <LiquidGlassCard className="p-5 flex items-center gap-4 bg-[#101827]/80">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
              🤝
            </div>
            <div>
              <div className="text-2xl font-black text-white font-mono">{user?.completedSessions || 0} Swaps</div>
              <div className="text-xs text-[#B0BAC9] font-semibold">Completed Exchanges</div>
            </div>
          </LiquidGlassCard>
        </motion.div>
      </motion.div>

      {/* Grid: Matches & Sessions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Reciprocal Match Radar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#8B7CFF]/20 flex items-center justify-center text-[#8B7CFF]">
                <Repeat className="w-4 h-4 text-[#8B7CFF]" />
              </div>
              <h2 className="text-xl font-extrabold text-white">Reciprocal Match Radar</h2>
            </div>
            <Link to="/matches" className="text-xs font-bold text-[#8B7CFF] hover:underline flex items-center gap-1">
              View All Matches <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[#718096] text-sm animate-pulse">Scanning peer network...</div>
          ) : matches.length === 0 ? (
            <LiquidGlassCard className="p-8 text-center space-y-3 bg-[#101827]/80">
              <Compass className="w-10 h-10 text-[#718096] mx-auto opacity-50" />
              <h3 className="text-sm font-bold text-[#B0BAC9]">No 100% Reciprocal Matches yet</h3>
              <p className="text-xs text-[#718096] max-w-md mx-auto">
                Set up the skills you want to teach & learn to let the Smart Matching Engine find your perfect trade partners!
              </p>
              <button
                onClick={onOpenOnboarding}
                className="mt-2 px-4 py-2 accent-gradient-bg text-[#101827] rounded-xl text-xs font-extrabold cursor-pointer"
              >
                Setup My Skills Now
              </button>
            </LiquidGlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.slice(0, 4).map((match) => (
                <LiquidGlassCard key={match.user?._id || match.user?.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-white/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={match.user?.avatar} alt={match.user?.name} className="w-12 h-12 rounded-2xl object-cover border border-white/20" />
                      <div>
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-1">
                          {match.user?.name}
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </h4>
                        <p className="text-xs text-[#B0BAC9]">@{match.user?.username} • {match.user?.city}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {match.score}% MATCH
                    </span>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#B0BAC9]">Teaches you:</span>
                      <span className="font-bold text-[#8B7CFF]">{match.skillsTheyTeach?.[0]?.name || 'Skill'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#B0BAC9]">Wants to learn:</span>
                      <span className="font-bold text-[#72C7FF]">{match.skillsYouTeach?.[0]?.name || 'Skill'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSwapPartner(match.user)}
                    className="w-full py-2.5 rounded-xl accent-gradient-bg text-[#101827] font-black text-xs shadow-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Repeat className="w-3.5 h-3.5 text-[#101827]" />
                    <span>Request Skill Swap</span>
                  </button>
                </LiquidGlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Top Mentors */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D6B36A]/20 flex items-center justify-center text-[#D6B36A]">
                <Award className="w-4 h-4 text-[#D6B36A]" />
              </div>
              <h2 className="text-xl font-extrabold text-white">Top Rated Mentors</h2>
            </div>
            <Link to="/leaderboard" className="text-xs font-bold text-[#D6B36A] hover:underline">
              Leaderboard →
            </Link>
          </div>

          <div className="space-y-3">
            {topMentors.slice(0, 4).map((mentor, i) => (
              <LiquidGlassCard key={mentor._id} className="p-4 flex items-center justify-between hover:border-white/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="font-mono font-black text-xs text-[#718096] w-4">
                    #{i + 1}
                  </div>
                  <img src={mentor.avatar} alt={mentor.name} className="w-10 h-10 rounded-2xl object-cover border border-white/20" />
                  <div>
                    <h4 className="font-extrabold text-xs text-white">{mentor.name}</h4>
                    <p className="text-[11px] text-[#B0BAC9]">Score: {mentor.trustScore}% • {mentor.teachingHours || 0}h taught</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSwapPartner(mentor)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#8B7CFF] border border-[#8B7CFF]/30 text-xs font-extrabold cursor-pointer"
                >
                  Swap
                </button>
              </LiquidGlassCard>
            ))}
          </div>
        </div>

      </motion.div>

      {/* Interactive Swap Request Modal */}
      <SwapRequestModal
        isOpen={!!selectedSwapPartner}
        onClose={() => setSelectedSwapPartner(null)}
        targetUser={selectedSwapPartner}
      />

    </motion.div>
  );
};

export default Dashboard;
