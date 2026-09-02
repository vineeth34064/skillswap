import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import LiquidGlassCard from '../components/LiquidGlassCard';
import SkeletonCard from '../components/SkeletonCard';
import { BarChart3, TrendingUp, Clock, Flame, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/user')
      .then(res => {
        if (res.success) setData(res.analytics);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-mono font-bold">
          <BarChart3 className="w-3.5 h-3.5 text-[#8B7CFF]" /> PERSONAL LEARNING METRICS
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
          Personal <span className="accent-gradient-text">Analytics</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Track your skill swap completion rates, weekly streak, and lifetime learning performance.
        </p>
      </div>

      {loading ? (
        <SkeletonCard count={3} />
      ) : (
        <div className="space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <LiquidGlassCard className="p-5 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Hours Taught</span>
              <div className="text-3xl font-black text-[#8B7CFF] font-mono">{data?.teachingHours || 0} hrs</div>
              <p className="text-[11px] text-slate-400">+1.0 Credit per hour</p>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-5 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Hours Learned</span>
              <div className="text-3xl font-black text-[#72C7FF] font-mono">{data?.learningHours || 0} hrs</div>
              <p className="text-[11px] text-slate-400">Knowledge gained</p>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-5 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Weekly Streak</span>
              <div className="text-3xl font-black text-[#D6B36A] font-mono flex items-center gap-1.5">
                <Flame className="w-6 h-6 text-amber-400" /> {data?.weeklyStreak || 5} Days
              </div>
              <p className="text-[11px] text-slate-400">Active learning streak</p>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-5 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Swap Completion</span>
              <div className="text-3xl font-black text-emerald-400 font-mono">{data?.completionRate || 100}%</div>
              <p className="text-[11px] text-slate-400">Punctuality rating</p>
            </LiquidGlassCard>
          </div>

          {/* Monthly Progress Bar Chart Simulation */}
          <LiquidGlassCard className="p-6 space-y-4 border border-white/15">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Monthly Growth Trend
            </h3>

            <div className="h-40 flex items-end justify-between gap-4 pt-6 px-4 border-b border-white/10">
              {['May', 'Jun', 'Jul', 'Aug', 'Sep'].map((m, i) => {
                const val = (data?.monthlyProgress || [12, 18, 25, 34, 42])[i];
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#8B7CFF]">{val}h</span>
                    <div className="w-full max-w-[40px] accent-gradient-bg rounded-t-xl transition-all duration-500" style={{ height: `${val * 2}px` }} />
                    <span className="text-xs text-slate-400">{m}</span>
                  </div>
                );
              })}
            </div>
          </LiquidGlassCard>

        </div>
      )}

    </div>
  );
};

export default AnalyticsPage;
