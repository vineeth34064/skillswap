import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import LiquidGlassCard from '../components/LiquidGlassCard';
import TimeCreditBadge from '../components/TimeCreditBadge';
import SwapRequestModal from '../components/SwapRequestModal';
import { Trophy, Star, ShieldCheck, Crown, Award, Zap, Clock, ArrowRight, User, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState({ topMentors: [], topSharers: [], creditChampions: [] });
  const [activeTab, setActiveTab] = useState('mentors');
  const [loading, setLoading] = useState(true);
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const [requestedUserIds, setRequestedUserIds] = useState(new Set());
  const [userSessionMap, setUserSessionMap] = useState({});

  // Swap Request Modal State
  const [selectedSwapPartner, setSelectedSwapPartner] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        if (res.success) {
          setData(res.leaderboard);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/sessions').then((res) => {
        if (res.success && res.sessions) {
          const map = {};
          res.sessions.forEach((s) => {
            const partnerId = s.partner?._id || s.mentorId?._id || s.learnerId?._id;
            if (partnerId) {
              if (s.status === 'ACCEPTED') map[partnerId] = 'Accepted';
              else if (s.status === 'REQUESTED' || s.status === 'PENDING') map[partnerId] = 'Requested';
              else if (s.status === 'COMPLETED') map[partnerId] = 'Completed';
            }
          });
          setUserSessionMap(map);
        }
      }).catch((err) => console.error(err));
    }
  }, [user]);

  const handleRequestSwap = (u) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedSwapPartner(u);
  };

  const getRankBadge = (index) => {
    if (index === 0) return <Crown className="w-6 h-6 text-[#D6B36A] drop-shadow-[0_0_15px_rgba(214,179,106,0.8)] animate-bounce" />;
    if (index === 1) return <Award className="w-5 h-5 text-[#72C7FF]" />;
    if (index === 2) return <Award className="w-5 h-5 text-[#8B7CFF]" />;
    return <span className="font-mono text-sm font-extrabold text-[#B0BAC9]">#{index + 1}</span>;
  };

  const renderRequestButton = (u) => {
    const sessionStatus = userSessionMap[u._id];
    const isRequestedLocally = requestedUserIds.has(u._id);

    if (sessionStatus === 'Accepted') {
      return (
        <span className="px-3.5 py-1.5 rounded-full bg-[#D6B36A]/20 text-[#D6B36A] border border-[#D6B36A]/40 text-xs font-mono font-extrabold flex items-center gap-1 shadow-gold-glow">
          <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" /> Request Accepted 🎉
        </span>
      );
    }

    if (sessionStatus === 'Requested' || isRequestedLocally) {
      return (
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-extrabold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Swap Requested ✓
        </span>
      );
    }

    return (
      <button
        onClick={() => handleRequestSwap(u)}
        className="px-3.5 py-1.5 rounded-full accent-gradient-bg text-[#101827] text-xs font-extrabold shadow-glow hover:scale-105 transition-all flex items-center gap-1 cursor-pointer"
      >
        <span>Request Swap</span>
        <ArrowRight className="w-3 h-3 text-[#101827]" />
      </button>
    );
  };

  const currentList =
    activeTab === 'mentors'
      ? data.topMentors
      : activeTab === 'sharers'
      ? data.topSharers
      : data.creditChampions;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white"
    >
      
      {/* Background Spatial Glows */}
      <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-[#D6B36A]/12 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-[#D6B36A] text-xs font-mono font-bold shadow-gold-glow">
            <Trophy className="w-3.5 h-3.5 text-[#D6B36A]" /> GLOBAL COMMUNITY RANKINGS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            SkillSwap <span className="text-[#D6B36A] drop-shadow-[0_0_25px_rgba(214,179,106,0.4)]">Leaderboard</span>
          </h1>
          <p className="text-sm text-[#B0BAC9]">
            Recognizing top mentors, time credit champions, and most active knowledge sharers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl liquid-glass-base border border-white/15 bg-[#0D1524]">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'mentors'
                ? 'accent-gradient-bg text-[#101827] shadow-glow'
                : 'text-[#B0BAC9] hover:text-white'
            }`}
          >
            ⭐ Top Mentors
          </button>
          <button
            onClick={() => setActiveTab('sharers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'sharers'
                ? 'accent-gradient-bg text-[#101827] shadow-glow'
                : 'text-[#B0BAC9] hover:text-white'
            }`}
          >
            ⏱️ Teaching Champions
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'credits'
                ? 'accent-gradient-bg text-[#101827] shadow-glow'
                : 'text-[#B0BAC9] hover:text-white'
            }`}
          >
            ⚡ Credit Leaders
          </button>
        </div>
      </motion.div>

      {/* Top 3 Podium Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {currentList.slice(0, 3).map((u, index) => (
          <motion.div
            key={u._id}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setHoveredUserId(u._id)}
            onMouseLeave={() => setHoveredUserId(null)}
            className="relative"
          >
            <LiquidGlassCard
              className={`p-6 space-y-5 bg-[#101827]/90 transition-all duration-300 ${
                index === 0
                  ? 'border-[#D6B36A] shadow-gold-glow'
                  : index === 1
                  ? 'border-[#72C7FF]'
                  : 'border-[#8B7CFF]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRankBadge(index)}
                  <span className="text-xs font-mono font-black text-[#B0BAC9] uppercase">RANK #{index + 1}</span>
                </div>
                <TimeCreditBadge credits={u.timeCredits || 2.0} size="sm" />
              </div>

              <div className="flex items-center gap-4">
                <img src={u.avatar} alt={u.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md" />
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                    {u.name}
                    {u.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </h3>
                  <div className="text-xs text-[#8B7CFF] font-mono font-extrabold">@{u.username}</div>
                  <div className="text-xs text-[#B0BAC9]">{u.city}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-extrabold">
                <span className="text-[#D6B36A] font-mono flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#D6B36A]" /> {u.rating || 5.0} Rating
                </span>
                <span className="text-[#72C7FF] font-mono">{u.teachingHours || 0} Hours Taught</span>
              </div>

              <div className="pt-2 flex justify-end">
                {renderRequestButton(u)}
              </div>
            </LiquidGlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Leaderboard Table List */}
      <motion.div variants={itemVariants} className="liquid-glass-premium p-6 rounded-3xl border border-white/20 shadow-glass-3d bg-[#101827]/90 space-y-4">
        <h3 className="text-xl font-extrabold text-white flex items-center gap-2 pb-2 border-b border-white/10">
          <Award className="w-5 h-5 text-[#8B7CFF]" /> Full Community Rankings
        </h3>

        <div className="space-y-3">
          {currentList.slice(3).map((u, idx) => (
            <motion.div
              key={u._id}
              whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.06)' }}
              className="p-4 rounded-2xl bg-[#101827]/60 border border-white/10 flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-extrabold text-[#B0BAC9] w-8 text-center">#{idx + 4}</span>
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                <div>
                  <div className="text-sm font-extrabold text-white">{u.name}</div>
                  <div className="text-xs text-[#B0BAC9]">@{u.username} • {u.city}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end text-xs">
                  <span className="text-[#D6B36A] font-mono font-extrabold">⭐ {u.rating || 5.0}</span>
                  <span className="text-[#B0BAC9]">{u.teachingHours || 0} Hours Taught</span>
                </div>
                {renderRequestButton(u)}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Swap Request Modal */}
      <SwapRequestModal
        isOpen={!!selectedSwapPartner}
        onClose={() => setSelectedSwapPartner(null)}
        targetUser={selectedSwapPartner}
        onSuccess={(session) => {
          if (selectedSwapPartner) {
            setRequestedUserIds((prev) => new Set(prev).add(selectedSwapPartner._id));
          }
        }}
      />

    </motion.div>
  );
};

export default Leaderboard;
