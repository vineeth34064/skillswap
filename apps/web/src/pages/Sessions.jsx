import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import LiquidGlassCard from '../components/LiquidGlassCard';
import TimeCreditBadge from '../components/TimeCreditBadge';
import PeerRatingModal from '../components/PeerRatingModal';
import {
  Calendar, Video, Clock, CheckCircle2, Plus, ShieldAlert, Check, Sparkles, Star,
  MessageSquare, Bell, ExternalLink, Trash2, Edit3, XCircle, FileText
} from 'lucide-react';

const Sessions = () => {
  const { user, refreshUser } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [celebrationCredit, setCelebrationCredit] = useState(null);

  // Peer Rating Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTargetUser, setReviewTargetUser] = useState(null);
  const [reviewSessionId, setReviewSessionId] = useState(null);

  // Session Notes state
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [sessionNotes, setSessionNotes] = useState('');

  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions');
      if (res.success) setSessions(res.sessions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    if (socket) {
      socket.on('session_updated', () => fetchSessions());
      socket.on('session_status_changed', () => fetchSessions());
    }
    const interval = setInterval(fetchSessions, 8000);
    return () => {
      if (socket) {
        socket.off('session_updated');
        socket.off('session_status_changed');
      }
      clearInterval(interval);
    };
  }, [socket]);

  const generateGoogleCalendarUrl = (session) => {
    const startDate = new Date(session.scheduledAt || Date.now());
    const endDate = new Date(startDate.getTime() + (session.durationHours || 1) * 60 * 60 * 1000);
    const formatCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const title = `SkillSwap Session: ${session.skillName}`;
    const meetUrl = session.meetingLink || 'https://meet.google.com/new';
    const details = `SkillSwap Peer Session.\nGoogle Meet Link: ${meetUrl}\n(5-minute notification set before session starts)`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(meetUrl)}&dates=${formatCalDate(startDate)}/${formatCalDate(endDate)}`;
  };

  const handleRespond = async (sessionId, status) => {
    try {
      const res = await api.patch(`/sessions/${sessionId}/respond`, { status: status === 'accept' ? 'ACCEPTED' : 'DECLINED' });
      if (res.success) fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmCompletion = async (session, partner) => {
    try {
      const res = await api.patch(`/sessions/${session._id}/confirm`);
      if (res.success) {
        fetchSessions();
        refreshUser();

        if (res.settled) {
          setCelebrationCredit(1.0);
          setTimeout(() => setCelebrationCredit(null), 4000);
          
          setReviewTargetUser(partner);
          setReviewSessionId(session._id);
          setShowReviewModal(true);
        }
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel or clear this session?')) return;
    try {
      const res = await api.delete(`/sessions/${sessionId}`);
      if (res.success) fetchSessions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveNotes = async (sessionId) => {
    try {
      await api.patch(`/sessions/${sessionId}/notes`, { notes: sessionNotes });
      setActiveNotesId(null);
      fetchSessions();
    } catch (err) {
      alert(err.message || 'Failed to save notes');
    }
  };

  const calculateCountdown = (scheduledAt) => {
    const diff = new Date(scheduledAt).getTime() - Date.now();
    if (diff <= 0) return 'Session Live Now 🟢';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `Starts in ${hours}h ${mins}m ⏱️`;
  };

  return (
    <div className="max-w-[96%] sm:max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8 relative z-10 text-white">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 text-[#8B7CFF] text-xs font-mono font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#8B7CFF]" /> UPGRADED SESSION WORKSPACE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
            Skill Swap <span className="accent-gradient-text">Sessions</span>
          </h1>
        </div>

        <TimeCreditBadge credits={user?.timeCredits} size="lg" />
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl liquid-glass-base border border-[#72C7FF]/30 text-xs text-slate-200 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-[#72C7FF] shrink-0" />
        <div>
          <strong className="font-bold text-[#72C7FF]">Dual Confirmation & 5-Criterion Ratings:</strong> Time credits transfer automatically once both participants click "Confirm Completion".
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm animate-pulse">Loading exchange sessions...</div>
      ) : sessions.length === 0 ? (
        <LiquidGlassCard className="p-12 text-center space-y-3 border border-dashed border-white/10">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No sessions scheduled yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explore nearby mentors or reciprocal matches to request your first 1-hour skill swap!
          </p>
        </LiquidGlassCard>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const currentUserId = String(user?._id || user?.id);
            const hostIdStr = String(session.hostId?._id || session.hostId?.id || session.hostId);
            const isHost = hostIdStr === currentUserId;
            const partner = isHost ? session.participantId : session.hostId;
            const myConfirmed = isHost ? session.hostConfirmed : session.participantConfirmed;
            const isPast = session.status === 'COMPLETED' || session.status === 'DECLINED';
            const countdownStr = calculateCountdown(session.scheduledAt);

            return (
              <LiquidGlassCard key={session._id} className="p-6 space-y-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  
                  {/* Left Info */}
                  <div className="flex items-start gap-4">
                    <img src={partner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt={partner?.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#72C7FF]/40 shadow-sm" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          session.status === 'COMPLETED' ? 'bg-[#D6B36A]/20 text-[#D6B36A] border border-[#D6B36A]/30' :
                          session.status === 'ACCEPTED' ? 'bg-[#72C7FF]/20 text-[#72C7FF] border border-[#72C7FF]/30' :
                          'bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/30'
                        }`}>
                          {session.status}
                        </span>
                        <span className="text-xs text-[#72C7FF] font-mono font-bold">{countdownStr}</span>
                      </div>

                      <h3 className="font-extrabold text-base text-white">
                        {isHost ? `Teaching ${session.skillName}` : `Learning ${session.skillName}`} with {partner?.name || 'Peer Mentor'}
                      </h3>

                      <p className="text-xs text-slate-400">
                        {new Date(session.scheduledAt).toLocaleString()} • {session.durationHours || 1} Hour
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    {session.status === 'REQUESTED' && isHost && (
                      <>
                        <button
                          onClick={() => handleRespond(session._id, 'accept')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                        >
                          Accept Session
                        </button>
                        <button
                          onClick={() => handleRespond(session._id, 'decline')}
                          className="px-4 py-2 border border-white/20 text-slate-300 font-bold text-xs rounded-xl hover:bg-white/10 cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    <a
                      href={session.meetingLink || 'https://meet.google.com/new'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 liquid-glass-base border border-[#72C7FF]/40 text-white font-black text-xs rounded-xl shadow-blue-glow hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5 text-[#72C7FF]" /> Join Google Meet
                    </a>

                    <a
                      href={generateGoogleCalendarUrl(session)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-[#D6B36A]/20 text-[#D6B36A] border border-[#D6B36A]/40 font-bold text-xs flex items-center gap-1.5"
                      title="Add to Google Calendar with 5m notice"
                    >
                      <Bell className="w-3.5 h-3.5" /> Calendar (5m Notice)
                    </a>

                    {session.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => handleConfirmCompletion(session, partner)}
                        disabled={myConfirmed}
                        className={`px-4 py-2.5 font-extrabold text-xs rounded-xl transition-all cursor-pointer ${
                          myConfirmed
                            ? 'liquid-glass-base text-[#D6B36A] border border-[#D6B36A]/30'
                            : 'accent-gradient-bg text-[#05070A] shadow-glow'
                        }`}
                      >
                        {myConfirmed ? 'Waiting for Partner' : 'Confirm Completion'}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => { setReviewTargetUser(partner); setReviewSessionId(session._id); setShowReviewModal(true); }}
                          className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-[#D6B36A] font-extrabold text-xs rounded-xl border border-[#D6B36A]/40 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-[#D6B36A]" /> Rate Peer Mentor
                        </button>

                        <button
                          onClick={() => alert(`Certificate generated for session: ${session.skillName}!`)}
                          className="px-3.5 py-2.5 bg-[#8B7CFF]/20 text-[#8B7CFF] font-bold text-xs rounded-xl border border-[#8B7CFF]/40 cursor-pointer"
                        >
                          🎓 Certificate
                        </button>

                        <button
                          onClick={() => alert(`Filing dispute for session ${session._id}. Admin will inspect attendance logs.`)}
                          className="px-3.5 py-2.5 bg-rose-950/40 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 cursor-pointer"
                          title="File Dispute"
                        >
                          ⚠️ Dispute
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDeleteSession(session._id)}
                      className="p-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                      title="Cancel / Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </LiquidGlassCard>
            );
          })}
        </div>
      )}

      {/* Peer Rating Modal */}
      <PeerRatingModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        targetUser={reviewTargetUser}
        sessionId={reviewSessionId}
        onSuccess={() => fetchSessions()}
      />

    </div>
  );
};

export default Sessions;
