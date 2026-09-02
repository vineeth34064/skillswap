import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import LiquidGlassCard from '../components/LiquidGlassCard';
import TimeCreditBadge from '../components/TimeCreditBadge';
import SwapRequestModal from '../components/SwapRequestModal';
import {
  Sparkles, ArrowRight, Zap, Repeat, Award, Compass, MessageSquare, ShieldCheck,
  CheckCircle2, Star, Settings, Film, Map, Wallet, Clock, Flame, LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ onOpenOnboarding }) => {
  const { user, logout } = useAuth();
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

  const upcomingSessions = sessions.filter(s => s.status === 'ACCEPTED');

  return (
    <div className="max-w-[96%] sm:max-w-[98%] xl:max-w-[1400px] mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-8 relative z-10 text-white">
      
      {/* Welcome Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#8B7CFF]" /> PRODUCTION V3 HOME DASHBOARD
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Good day, <span className="accent-gradient-text">{user?.name}</span> 👋
          </h1>
          <p className="text-sm text-slate-300 flex items-center gap-3">
            <span>{user?.city}</span> • 
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> {user?.trustScore || 90}% Trust Score
            </span> •
            <span className="text-[#D6B36A] font-extrabold flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" /> 5 Day Streak
            </span>
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <TimeCreditBadge credits={user?.timeCredits} size="lg" />
          
          <button
            onClick={() => navigate('/wallet')}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-[#8B7CFF]" /> Wallet Log
          </button>

          <button
            onClick={() => navigate('/reels')}
            className="px-4 py-3 rounded-2xl bg-[#EC4899]/20 hover:bg-[#EC4899]/30 text-[#EC4899] border border-[#EC4899]/40 font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <Film className="w-4 h-4" /> Watch Reels
          </button>

          <button
            onClick={() => navigate('/discover')}
            className="px-5 py-3 rounded-2xl accent-gradient-bg text-[#05070A] font-black text-xs shadow-glow hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Find Skill Swap</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="px-4 py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            title="Logout of current session"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Today's Live Sessions Banner */}
      {upcomingSessions.length > 0 && (
        <LiquidGlassCard className="p-6 border border-[#8B7CFF]/40 bg-[#101827]/90 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8B7CFF] animate-pulse" /> Upcoming Scheduled Sessions ({upcomingSessions.length})
            </h3>
            <Link to="/sessions" className="text-xs font-bold text-[#8B7CFF] hover:underline">
              Manage Sessions →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.slice(0, 2).map(s => (
              <div key={s._id} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-sm text-white">{s.skillName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Scheduled for: {new Date(s.scheduledAt).toLocaleString()}</p>
                </div>
                <a
                  href={s.meetingLink || 'https://meet.google.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold shrink-0 hover:bg-emerald-500/30"
                >
                  Join Google Meet
                </a>
              </div>
            ))}
          </div>
        </LiquidGlassCard>
      )}

      {/* Marketplace Liquidity Engine: Available in the next 2 hours */}
      <LiquidGlassCard className="p-6 space-y-4 border border-[#72C7FF]/40 bg-[#080E24]/90">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Mentors Online Now (Available in next 2 hours)
            </div>
            <h3 className="text-xl font-black text-white mt-1">Instant Swap Liquidity Radar ⚡</h3>
          </div>

          <button
            onClick={() => navigate('/discover')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
          >
            Explore All Mentors
          </button>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {matches.slice(0, 3).map((match, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={match.user?.avatar} alt={match.user?.name} className="w-10 h-10 rounded-xl object-cover border border-[#72C7FF]/40" />
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{match.user?.name}</h4>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">⚡ Responds in &lt; 1 hour</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300">Teaches: <strong className="text-[#72C7FF]">{match.user?.teachSkills?.[0]?.name || 'Web Dev'}</strong></p>
                <button
                  onClick={() => setSelectedSwapPartner(match.user)}
                  className="w-full py-2 rounded-xl accent-gradient-bg text-[#05070A] font-extrabold text-xs"
                >
                  Request Instant Swap
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/15 text-center space-y-3">
            <p className="text-xs text-slate-400">No mentors currently listed for your exact time slot.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => alert('Notification alert subscribed!')} className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold">
                🔔 Notify me when someone joins
              </button>
              <button onClick={() => navigate('/referrals')} className="px-4 py-2 rounded-xl bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/40 text-xs font-bold">
                ✉️ Invite a mentor (+0.5 credit)
              </button>
            </div>
          </div>
        )}
      </LiquidGlassCard>

      {/* Stats Quick Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <LiquidGlassCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/30 flex items-center justify-center font-bold text-xl">
            ⚡
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{user?.timeCredits || 2.0}</div>
            <div className="text-xs text-slate-400 font-bold">Time Credits</div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#72C7FF]/20 text-[#72C7FF] border border-[#72C7FF]/30 flex items-center justify-center font-bold text-xl">
            ⏱️
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{user?.teachingHours || 0} Hours</div>
            <div className="text-xs text-slate-400 font-bold">Hours Taught</div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D6B36A]/20 text-[#D6B36A] border border-[#D6B36A]/30 flex items-center justify-center font-bold text-xl">
            🛡️
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{user?.trustScore || 90} / 100</div>
            <div className="text-xs text-slate-400 font-bold">Trust Score</div>
          </div>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xl">
            🤝
          </div>
          <div>
            <div className="text-2xl font-black text-white font-mono">{user?.completedSessions || 0} Swaps</div>
            <div className="text-xs text-slate-400 font-bold">Completed Swaps</div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* Main Grid: Matches & Mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
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
            <div className="py-12 text-center text-slate-400 text-sm animate-pulse">Scanning peer network...</div>
          ) : matches.length === 0 ? (
            <LiquidGlassCard className="p-8 text-center space-y-3">
              <Compass className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No 100% Reciprocal Matches yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Set up the skills you want to teach & learn to let the Smart Matching Engine find your perfect trade partners!
              </p>
              <button
                onClick={onOpenOnboarding}
                className="mt-2 px-4 py-2 accent-gradient-bg text-[#05070A] rounded-xl text-xs font-black cursor-pointer"
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
                        <p className="text-xs text-slate-400">@{match.user?.username} • {match.user?.city}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {match.score}% MATCH
                    </span>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Teaches you:</span>
                      <span className="font-bold text-[#8B7CFF]">{match.skillsTheyTeach?.[0]?.name || 'Skill'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Wants to learn:</span>
                      <span className="font-bold text-[#72C7FF]">{match.skillsYouTeach?.[0]?.name || 'Skill'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSwapPartner(match.user)}
                    className="w-full py-2.5 rounded-xl accent-gradient-bg text-[#05070A] font-black text-xs shadow-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Repeat className="w-3.5 h-3.5 text-[#05070A]" />
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
                  <div className="font-mono font-black text-xs text-slate-500 w-4">
                    #{i + 1}
                  </div>
                  <img src={mentor.avatar} alt={mentor.name} className="w-10 h-10 rounded-2xl object-cover border border-white/20" />
                  <div>
                    <h4 className="font-extrabold text-xs text-white">{mentor.name}</h4>
                    <p className="text-[11px] text-slate-400">Score: {mentor.trustScore}% • {mentor.teachingHours || 0}h taught</p>
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

      </div>

      {/* Interactive Swap Request Modal */}
      <SwapRequestModal
        isOpen={!!selectedSwapPartner}
        onClose={() => setSelectedSwapPartner(null)}
        targetUser={selectedSwapPartner}
      />

    </div>
  );
};

export default Dashboard;
