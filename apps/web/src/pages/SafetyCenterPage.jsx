import React from 'react';
import LiquidGlassCard from '../components/LiquidGlassCard';
import { ShieldCheck, AlertTriangle, Lock, UserCheck, MessageSquare, Flag } from 'lucide-react';

const SafetyCenterPage = () => {
  return (
    <div className="max-w-[96%] sm:max-w-[90%] xl:max-w-[1000px] mx-auto px-4 py-6 space-y-8 relative z-10 text-white">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> TRUST & SAFETY CENTER
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Community <span className="accent-gradient-text">Safety Guidelines</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          SkillSwap is built on mutual respect, trust, and real-time moderation. Here is how we protect our members.
        </p>
      </div>

      {/* Safety Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LiquidGlassCard className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8B7CFF]/20 flex items-center justify-center text-[#8B7CFF]">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-white">Real Verification Badges</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Look for Verified badges (Phone, Email, College, LinkedIn) on peer profiles. Verified mentors maintain higher response rates and verified identity records.
          </p>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
            <Flag className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-white">1-Click Reporting & Blocking</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Report any inappropriate behavior, spam, or harassment directly from chat or profile pages. Reports are reviewed by human moderators within 24 hours.
          </p>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#72C7FF]/20 flex items-center justify-center text-[#72C7FF]">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-white">Encrypted & Safe Meeting Rooms</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All video calls run via official Google Meet room links. Never share financial passwords, bank accounts, or sensitive personal credentials.
          </p>
        </LiquidGlassCard>

        <LiquidGlassCard className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D6B36A]/20 flex items-center justify-center text-[#D6B36A]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-white">5-Criterion Ratings</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Peers rate each other on Explanation, Methodology, Communication, Respect, and Punctuality. This keeps community trust scores 100% transparent.
          </p>
        </LiquidGlassCard>
      </div>

    </div>
  );
};

export default SafetyCenterPage;
