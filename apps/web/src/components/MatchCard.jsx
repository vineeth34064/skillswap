import React, { useState } from 'react';
import LiquidGlassCard from './LiquidGlassCard';
import MatchScoreRing from './MatchScoreRing';
import { Star, MapPin, Repeat, ShieldCheck, CheckCircle, Info, MessageSquare, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

const MatchCard = ({ match, onRequestSwap, onMessage }) => {
  const [showReasonsModal, setShowReasonsModal] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const { user, matchScore, isDirectSwap, reasons, distanceKm, teachesSkills, wantsSkills } = match;

  const handleRequestClick = () => {
    setIsRequested(true);
    if (onRequestSwap) onRequestSwap(match);
  };

  return (
    <LiquidGlassCard className="p-5 flex flex-col justify-between group">
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#8B7CFF]/40 group-hover:border-[#8B7CFF] transition-colors shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-base text-white group-hover:text-[#8B7CFF] transition-colors">
                {user.name}
              </h4>
              <ShieldCheck className="w-4 h-4 text-[#8B7CFF]" title={`Trust Score: ${user.trustScore}`} />
            </div>
            <p className="text-xs text-[#A1ACBC] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#667085]" />
              <span>{user.city} ({distanceKm} km away)</span>
            </p>
          </div>
        </div>

        {/* Animated Score Ring */}
        <div className="flex flex-col items-end">
          <MatchScoreRing score={matchScore} size={48} />
          {isDirectSwap && (
            <span className="text-[10px] font-extrabold text-[#D6B36A] mt-1 flex items-center gap-0.5 tracking-tight">
              <Repeat className="w-3 h-3" /> Direct Swap
            </span>
          )}
        </div>
      </div>

      {/* Bio snippet */}
      <p className="text-xs text-[#A1ACBC] line-clamp-2 mb-4 leading-relaxed italic">
        "{user.bio || 'Passionate about skill exchange and peer learning.'}"
      </p>

      {/* Reciprocal Skills Comparison */}
      <div className="p-3.5 rounded-2xl liquid-glass-base border border-white/5 mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#A1ACBC] mb-1">YOU GET</span>
            <div className="flex flex-wrap gap-1">
              {teachesSkills && teachesSkills.slice(0, 2).map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-lg bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30 text-[11px] font-semibold">
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          <div className="p-1.5 rounded-full bg-white/5 border border-white/10 text-[#D6B36A] animate-pulse">
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </div>

          <div className="text-right">
            <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#A1ACBC] mb-1">YOU TEACH</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {wantsSkills && wantsSkills.slice(0, 2).map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-lg bg-[#72C7FF]/15 text-[#72C7FF] border border-[#72C7FF]/30 text-[11px] font-semibold">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-[#A1ACBC] mb-4 px-1">
        <div className="flex items-center gap-1 text-[#D6B36A] font-bold">
          <Star className="w-3.5 h-3.5 fill-[#D6B36A]" />
          <span>{user.rating || '5.0'}</span>
          <span className="text-[#667085] font-normal">({user.completedSessions || 0} sessions)</span>
        </div>

        <button
          onClick={() => setShowReasonsModal(true)}
          className="text-[#8B7CFF] font-semibold hover:underline flex items-center gap-1 text-xs"
        >
          <Info className="w-3.5 h-3.5" /> Why matched?
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <button
          onClick={handleRequestClick}
          disabled={isRequested}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            isRequested
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm cursor-default'
              : 'accent-gradient-bg text-[#101827] shadow-glow hover:scale-[1.02]'
          }`}
        >
          {isRequested ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Swap Requested</span>
            </>
          ) : (
            <span>Request Skill Swap</span>
          )}
        </button>
        <button
          onClick={() => onMessage(user._id)}
          className="p-2.5 rounded-xl btn-neomorphic border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
          title="Send Message"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Why Matched Modal */}
      {showReasonsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/80 backdrop-blur-md">
          <div className="w-full max-w-sm liquid-glass-base rounded-3xl p-6 border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-white flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[#8B7CFF]" /> Match Rationale
              </h4>
              <button onClick={() => setShowReasonsModal(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <div className="p-3 rounded-2xl liquid-glass-base border border-[#8B7CFF]/30 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Overall Match Score</span>
              <span className="text-base font-extrabold text-[#D6B36A] font-mono">{matchScore}%</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="text-[#8B7CFF] font-bold">✓</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowReasonsModal(false)}
              className="w-full py-2 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </LiquidGlassCard>
  );
};

export default MatchCard;
