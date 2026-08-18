import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, Calendar, Clock, Video, MapPin, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, X, ExternalLink, Bell } from 'lucide-react';
import api from '../api/client';
import TimeCreditBadge from './TimeCreditBadge';
import { useNavigate } from 'react-router-dom';

const SwapRequestModal = ({ isOpen, onClose, targetUser, onSuccess }) => {
  const navigate = useNavigate();
  const [skillId, setSkillId] = useState('');
  const [durationHours, setDurationHours] = useState(1.0);
  const [scheduledAt, setScheduledAt] = useState('');
  const [mode, setMode] = useState('Online');
  const [customMeetUrl, setCustomMeetUrl] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [createdSession, setCreatedSession] = useState(null);

  useEffect(() => {
    if (targetUser) {
      if (targetUser.teachSkills && targetUser.teachSkills.length > 0) {
        const first = targetUser.teachSkills[0].skillId?._id || targetUser.teachSkills[0].skillId;
        setSkillId(first || '');
      } else {
        setSkillId('');
      }
      
      // Default to tomorrow 14:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0);
      setScheduledAt(tomorrow.toISOString().slice(0, 16));
    }
  }, [targetUser]);

  if (!isOpen || !targetUser) return null;

  const generateGoogleCalendarUrl = (sessionDate, partnerName, roomUrl) => {
    const startDate = new Date(sessionDate || Date.now());
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const formatCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const title = `SkillSwap Session with ${partnerName}`;
    const details = `SkillSwap Peer Session.\nVideo Room Link: ${roomUrl}\n(Set 5-minute notification before session starts)`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(roomUrl)}&dates=${formatCalDate(startDate)}/${formatCalDate(endDate)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        partnerId: targetUser._id,
        skillId: skillId || undefined,
        durationHours: Number(durationHours),
        scheduledAt: new Date(scheduledAt).toISOString(),
        mode,
        meetingLink: customMeetUrl.trim() ? customMeetUrl.trim() : undefined,
        notes
      };

      const res = await api.post('/sessions/request', payload);

      if (res.success) {
        setCreatedSession(res.session);
        setSuccessMsg('Skill Swap Request Sent Successfully! 🎉');
        if (onSuccess) onSuccess(res.session);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send swap request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05070A]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg liquid-glass-premium rounded-3xl border border-white/20 shadow-glass-3d p-6 sm:p-8 bg-[#101827]/95 space-y-6 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#B0BAC9] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-mono font-bold">
              <Repeat className="w-3.5 h-3.5 text-[#8B7CFF]" /> INITIATE RECIPROCAL SWAP
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Request Swap with <span className="accent-gradient-text">{targetUser.name}</span>
            </h3>
          </div>

          {/* User Partner Banner */}
          <div className="p-4 rounded-2xl liquid-glass-base border border-white/15 flex items-center justify-between bg-white/[0.04]">
            <div className="flex items-center gap-3">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                className="w-12 h-12 rounded-2xl object-cover border border-white/20"
              />
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  {targetUser.name}
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </h4>
                <p className="text-xs text-[#B0BAC9]">@{targetUser.username} • {targetUser.city}</p>
              </div>
            </div>
            <TimeCreditBadge credits={1.0} size="sm" />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {createdSession ? (
            <div className="space-y-5 p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-white animate-in fade-in">
              <div className="flex items-center gap-3 text-emerald-400 font-extrabold text-base">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>Skill Swap Request Sent Successfully! 🎉</span>
              </div>

              <p className="text-xs text-[#B0BAC9]">
                Your session is scheduled. Join using your official Google Meet link below.
              </p>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#72C7FF] font-mono font-bold flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#72C7FF]" /> Google Meet Link:
                  </span>
                  <a
                    href={createdSession.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    Open Google Meet <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-xs font-mono text-white bg-white/5 p-2 rounded-lg break-all">
                  {createdSession.meetingLink}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={generateGoogleCalendarUrl(createdSession.scheduledAt, targetUser.name, createdSession.meetingLink)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#D6B36A]/20 hover:bg-[#D6B36A]/30 text-[#D6B36A] border border-[#D6B36A]/40 font-extrabold text-xs flex items-center justify-center gap-2 shadow-gold-glow cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-[#D6B36A]" />
                  <span>Add to Google Calendar (5-Min Reminder)</span>
                </a>
                <button
                  onClick={() => { onClose(); navigate('/sessions'); }}
                  className="py-3 px-5 rounded-xl accent-gradient-bg text-[#101827] font-black text-xs cursor-pointer"
                >
                  Go to My Sessions →
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Skill Selector */}
              <div>
                <label className="block text-xs font-extrabold text-[#B0BAC9] mb-1.5">
                  Skill You Want to Learn from {targetUser.name}
                </label>
                <select
                  value={skillId}
                  onChange={(e) => setSkillId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl liquid-glass-base border border-white/20 bg-[#0D1524] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
                >
                  {targetUser.teachSkills && targetUser.teachSkills.length > 0 ? (
                    targetUser.teachSkills.map((s) => {
                      const id = s.skillId?._id || s.skillId;
                      const name = s.skillId?.name || s.name || 'Skill';
                      return <option key={id} value={id}>{name} ({s.level || 'Intermediate'})</option>;
                    })
                  ) : (
                    <option value="">General Skill Swap Session</option>
                  )}
                </select>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#B0BAC9] mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#72C7FF]" /> Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-2xl liquid-glass-base border border-white/20 bg-[#0D1524] text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#B0BAC9] mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D6B36A]" /> Duration
                  </label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-2xl liquid-glass-base border border-white/20 bg-[#0D1524] text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
                  >
                    <option value={1.0}>1.0 Hour (1 Credit)</option>
                    <option value={1.5}>1.5 Hours (1.5 Credits)</option>
                    <option value={2.0}>2.0 Hours (2 Credits)</option>
                  </select>
                </div>
              </div>

              {/* Session Format */}
              <div>
                <label className="block text-xs font-extrabold text-[#B0BAC9] mb-1.5">Session Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('Online')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-extrabold border flex items-center justify-center gap-2 cursor-pointer ${
                      mode === 'Online'
                        ? 'bg-[#8B7CFF]/20 border-[#8B7CFF] text-white shadow-glow'
                        : 'bg-white/5 border-white/15 text-[#B0BAC9]'
                    }`}
                  >
                    <Video className="w-4 h-4 text-[#8B7CFF]" /> Online Google Meet
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('In-Person')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-extrabold border flex items-center justify-center gap-2 cursor-pointer ${
                      mode === 'In-Person'
                        ? 'bg-[#D6B36A]/20 border-[#D6B36A] text-[#D6B36A] shadow-gold-glow'
                        : 'bg-white/5 border-white/15 text-[#B0BAC9]'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#D6B36A]" /> In-Person Meeting
                  </button>
                </div>
              </div>

              {/* Custom Google Meet URL Field */}
              {mode === 'Online' && (
                <div>
                  <label className="block text-xs font-extrabold text-[#B0BAC9] mb-1.5 flex items-center justify-between">
                    <span>Google Meet URL (Optional)</span>
                    <span className="text-[10px] text-[#72C7FF]">Default: Instant Meet Room</span>
                  </label>
                  <input
                    type="url"
                    value={customMeetUrl}
                    onChange={(e) => setCustomMeetUrl(e.target.value)}
                    placeholder="https://meet.google.com/your-meeting-link (or leave blank)"
                    className="w-full px-4 py-3 rounded-2xl liquid-glass-base border border-white/20 bg-[#0D1524] text-white text-xs sm:text-sm placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
                  />
                </div>
              )}

              {/* Note / Message */}
              <div>
                <label className="block text-xs font-extrabold text-[#B0BAC9] mb-1.5">Note to {targetUser.name} (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Hi! I'd love to swap skills with you. Let me know what time works best!"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl liquid-glass-base border border-white/20 bg-[#0D1524] text-white text-xs sm:text-sm placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 accent-gradient-bg text-[#101827] font-black rounded-2xl shadow-glow hover:scale-[1.02] transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="animate-pulse">Setting Google Meet & Sending Request...</span>
                ) : (
                  <>Send Skill Swap Request <Sparkles className="w-4 h-4 text-[#101827]" /></>
                )}
              </button>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SwapRequestModal;
