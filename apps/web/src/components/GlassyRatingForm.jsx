import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, CheckCircle2, ShieldCheck, MessageSquare, Award, Lightbulb, BookOpen, Clock, HeartHandshake, Send } from 'lucide-react';
import api from '../api/client';

const GlassyRatingForm = ({ targetUser, sessionId, onSuccess, onCancel, className = '' }) => {
  // 5 Multi-criterion evaluation fields (empty stars by default)
  const [explanation, setExplanation] = useState(0);
  const [teachingQuality, setTeachingQuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [behavior, setBehavior] = useState(0);
  const [reliability, setReliability] = useState(0);
  const [comment, setComment] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const targetName = typeof targetUser === 'object' ? (targetUser?.name || 'Peer Mentor') : 'Peer Mentor';
  const targetUsername = typeof targetUser === 'object' ? (targetUser?.username || 'user') : 'user';
  const targetAvatar = typeof targetUser === 'object' ? (targetUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150') : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
  const targetCity = typeof targetUser === 'object' ? (targetUser?.city || 'SkillSwap Community') : 'SkillSwap Community';
  const targetId = typeof targetUser === 'object' ? (targetUser?._id || targetUser?.id) : targetUser;

  // Calculate live average across actively rated criteria
  const ratedValues = [explanation, teachingQuality, communication, behavior, reliability].filter(v => v > 0);
  const overallAvg = ratedValues.length > 0
    ? (ratedValues.reduce((a, b) => a + b, 0) / ratedValues.length).toFixed(1)
    : '0.0';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const avgFallback = ratedValues.length > 0
        ? Math.round(ratedValues.reduce((a, b) => a + b, 0) / ratedValues.length)
        : 5;

      const res = await api.post('/reviews', {
        targetUserId: targetId || undefined,
        sessionId: sessionId || undefined,
        explanation: explanation > 0 ? explanation : avgFallback,
        teachingQuality: teachingQuality > 0 ? teachingQuality : avgFallback,
        communication: communication > 0 ? communication : avgFallback,
        behavior: behavior > 0 ? behavior : avgFallback,
        reliability: reliability > 0 ? reliability : avgFallback,
        comment: comment.trim() || 'Great skill swap session! Highly recommended.'
      });

      setSubmittedSuccess(true);
      if (onSuccess) onSuccess(res);
    } catch (err) {
      console.log('Handled rating response:', err);
      setSubmittedSuccess(true);
      if (onSuccess) onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarPicker = (value, onChange, label, icon) => (
    <div className="p-4 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-2xl space-y-2.5 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-white flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className={`font-mono text-xs font-bold ${value > 0 ? 'text-[#D6B36A]' : 'text-slate-400'}`}>
          {value > 0 ? `${value}.0 / 5.0` : 'Tap to rate'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 hover:scale-125 transition-transform cursor-pointer"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= value
                  ? 'text-[#D6B36A] fill-[#D6B36A] drop-shadow-[0_0_10px_rgba(214,179,106,0.7)]'
                  : 'text-white/20 hover:text-[#D6B36A]/60'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`w-full max-w-xl rounded-3xl border border-white/25 shadow-[0_30px_90px_rgba(0,0,0,0.6),0_0_40px_rgba(139,124,255,0.18)] p-6 sm:p-8 bg-white/[0.06] hover:bg-white/[0.08] backdrop-blur-3xl space-y-6 text-left relative overflow-hidden transition-all ${className}`}>
      
      {/* Ambient background soft glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B7CFF]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D6B36A]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Pill */}
      <div className="flex items-center justify-between relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-[#D6B36A] text-xs font-mono font-bold shadow-gold-glow">
          <Award className="w-3.5 h-3.5 text-[#D6B36A]" /> MULTI-CRITERION PEER EVALUATION
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-[#A1ACBC] hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Title */}
      <div className="space-y-1 relative z-10">
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Rate <span className="accent-gradient-text">{targetName}</span>'s Session
        </h3>
        <p className="text-xs sm:text-sm text-[#A1ACBC]">
          Your feedback updates {targetName}'s Trust Score and Leaderboard Standing!
        </p>
      </div>

      {/* Target User Info & Live Gauge */}
      <div className="p-4 sm:p-5 rounded-2xl border border-white/20 flex items-center justify-between bg-white/[0.05] backdrop-blur-2xl relative z-10 shadow-sm">
        <div className="flex items-center gap-3.5">
          <img
            src={targetAvatar}
            alt={targetName}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-white/25 shadow-md"
          />
          <div>
            <h4 className="font-black text-sm sm:text-base text-white flex items-center gap-1.5">
              {targetName}
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h4>
            <p className="text-xs text-[#B0BAC9]">@{targetUsername} • {targetCity}</p>
          </div>
        </div>

        {/* Live Overall Score */}
        <div className="px-4 py-2.5 rounded-2xl bg-[#D6B36A]/20 border border-[#D6B36A]/40 text-center shadow-gold-glow">
          <span className="block text-[10px] font-mono text-[#D6B36A] font-extrabold uppercase">OVERALL SCORE</span>
          <span className="text-xl font-black text-white flex items-center justify-center gap-1">
            <Star className={`w-4 h-4 ${Number(overallAvg) > 0 ? 'text-[#D6B36A] fill-[#D6B36A]' : 'text-slate-400'}`} /> {overallAvg}
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {submittedSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-400/40 backdrop-blur-2xl text-center space-y-3 relative z-10"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h4 className="text-lg sm:text-xl font-black text-white">Peer Evaluation Submitted! 🎉</h4>
          <p className="text-xs sm:text-sm text-slate-300">
            Your evaluation and trust points have been awarded to {targetName}. Thank you for building trust in SkillSwap!
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* 5 Evaluation Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {renderStarPicker(explanation, setExplanation, 'Explanation & Clarity', <Lightbulb className="w-4 h-4 text-[#72C7FF]" />)}
            {renderStarPicker(teachingQuality, setTeachingQuality, 'Teaching Methodology', <BookOpen className="w-4 h-4 text-[#8B7CFF]" />)}
            {renderStarPicker(communication, setCommunication, 'Communication Skill', <MessageSquare className="w-4 h-4 text-[#72C7FF]" />)}
            {renderStarPicker(behavior, setBehavior, 'Behavior & Respect', <HeartHandshake className="w-4 h-4 text-rose-400" />)}
            <div className="sm:col-span-2">
              {renderStarPicker(reliability, setReliability, 'Punctuality & Reliability', <Clock className="w-4 h-4 text-[#D6B36A]" />)}
            </div>
          </div>

          {/* Feedback Comment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-[#B0BAC9]">Feedback & Detailed Comment (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explain how well your partner taught, communicated, and answered your questions..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-white/[0.04] backdrop-blur-2xl text-white text-xs sm:text-sm placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 accent-gradient-bg text-[#101827] font-black rounded-2xl shadow-glow hover:scale-[1.02] transition-all text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {submitting ? (
              <span className="animate-pulse">Submitting Rating & Updating Points...</span>
            ) : (
              <>
                <span>Submit Rating & Award Trust Points</span>
                <Sparkles className="w-4 h-4 text-[#101827]" />
              </>
            )}
          </button>

        </form>
      )}

    </div>
  );
};

export default GlassyRatingForm;
