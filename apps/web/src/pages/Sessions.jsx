import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import LiquidGlassCard from '../components/LiquidGlassCard';
import TimeCreditBadge from '../components/TimeCreditBadge';
import PeerRatingModal from '../components/PeerRatingModal';
import { Calendar, Video, Clock, CheckCircle2, Plus, ShieldAlert, Check, Sparkles, Star, MessageSquare, Bell, ExternalLink, Trash2 } from 'lucide-react';

const Sessions = () => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [celebrationCredit, setCelebrationCredit] = useState(null);

  // Peer Rating Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTargetUser, setReviewTargetUser] = useState(null);
  const [reviewSessionId, setReviewSessionId] = useState(null);

  // New session modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [targetPartner, setTargetPartner] = useState(location.state?.targetUser || null);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [userSkills, setUserSkills] = useState([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationHours, setDurationHours] = useState(1.0);
  const [mode, setMode] = useState('Online');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');
  const [notes, setNotes] = useState('');
  const [formMsg, setFormMsg] = useState('');

  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions');
      if (res.success) setSessions(res.sessions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    api.get('/skills').then(res => {
      if (res.success) setUserSkills(res.skills);
    }).catch(console.error);

    if (location.state?.targetUser) {
      setShowNewModal(true);
      setTargetPartner(location.state.targetUser);
    }
  }, [location.state]);

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
          
          // Open 5-Criterion Rating Modal automatically after completion
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
    if (!window.confirm('Are you sure you want to clear this session history?')) return;
    try {
      const res = await api.delete(`/sessions/${sessionId}`);
      if (res.success) fetchSessions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClearPastSessions = async () => {
    if (!window.confirm('Clear all completed and declined past meetings from history?')) return;
    try {
      const res = await api.delete('/sessions/clear-past');
      if (res.success) fetchSessions();
    } catch (err) {
      alert(err.message);
    }
  };

  const openReviewModal = (partner, sessionId) => {
    setReviewTargetUser(partner);
    setReviewSessionId(sessionId);
    setShowReviewModal(true);
  };

  const hasPastSessions = sessions.some(s => s.status === 'COMPLETED' || s.status === 'DECLINED');

  return (
    <div className="max-w-[96%] sm:max-w-[98%] mx-auto px-4 sm:px-8 py-4 sm:py-6 space-y-6 relative z-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F7F9FC] flex items-center gap-2 tracking-tight">
            <Calendar className="w-7 h-7 text-[#72C7FF]" /> Skill Swap Workspace Sessions
          </h1>
          <p className="text-sm text-[#A1ACBC] mt-1">
            Manage active sessions, confirm completion to release Time Credits, and rate your peer mentors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasPastSessions && (
            <button
              onClick={handleClearPastSessions}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-400" /> Clear Past Meetings
            </button>
          )}
        </div>
      </div>

      {/* Anti-Fraud Banner */}
      <div className="p-4 rounded-2xl liquid-glass-base border border-[#72C7FF]/30 text-xs text-slate-200 flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-[#72C7FF] shrink-0" />
        <div>
          <strong className="font-bold text-[#72C7FF]">Dual Confirmation & Peer Rating System:</strong> Time Credits (+1.0 to Teacher, -1.0 from Learner) are transferred when BOTH participants confirm completion. Leave a multi-criterion rating afterwards to elevate their Leaderboard rank!
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm animate-pulse">Loading exchange sessions...</div>
      ) : sessions.length === 0 ? (
        <LiquidGlassCard className="p-12 text-center space-y-3 border border-dashed border-white/10">
          <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No sessions scheduled yet</h3>
          <p className="text-xs text-[#667085] max-w-sm mx-auto">
            Explore nearby mentors or reciprocal matches to request your first 1-hour skill swap!
          </p>
        </LiquidGlassCard>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const currentUserId = String(user?._id || user?.id);
            const hostIdStr = String(session.hostId?._id || session.hostId?.id || session.hostId);
            const isHost = hostIdStr === currentUserId; // Teacher
            const partner = isHost ? session.participantId : session.hostId;
            const myConfirmed = isHost ? session.hostConfirmed : session.participantConfirmed;
            const isPast = session.status === 'COMPLETED' || session.status === 'DECLINED';

            return (
              <LiquidGlassCard key={session._id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <img src={partner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'} alt={partner?.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#72C7FF]/40 shadow-sm" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        session.status === 'COMPLETED' ? 'bg-[#D6B36A]/20 text-[#D6B36A] border border-[#D6B36A]/30' :
                        session.status === 'ACCEPTED' ? 'bg-[#72C7FF]/20 text-[#72C7FF] border border-[#72C7FF]/30' :
                        'bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/30'
                      }`}>
                        {session.status}
                      </span>
                      <span className="text-xs text-[#A1ACBC] font-bold">• {session.durationHours || 1} Hour Session</span>
                    </div>

                    <h3 className="font-extrabold text-base text-white">
                      {isHost ? `Teaching ${session.skillName}` : `Learning ${session.skillName}`} with {partner?.name || 'Peer Mentor'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#A1ACBC] pt-1">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(session.scheduledAt).toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5 text-[#72C7FF]" /> {session.mode}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
                  
                  {session.status === 'REQUESTED' && isHost && (
                    <>
                      <button
                        onClick={() => handleRespond(session._id, 'accept')}
                        className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleRespond(session._id, 'decline')}
                        className="px-4 py-2 border border-white/10 text-slate-300 font-bold text-xs rounded-xl hover:bg-white/10 cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {(session.status === 'ACCEPTED' || session.status === 'REQUESTED' || session.status === 'SCHEDULED' || session.status === 'IN_PROGRESS' || session.status === 'COMPLETED') && (
                    <>
                      <a
                        href={session.meetingLink || 'https://meet.google.com/new'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 liquid-glass-base border border-[#72C7FF]/40 text-white font-extrabold text-xs rounded-xl shadow-blue-glow hover:scale-105 transition-all text-center flex items-center justify-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5 text-[#72C7FF]" /> Join Google Meet
                      </a>

                      <a
                        href={generateGoogleCalendarUrl(session)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2.5 rounded-xl bg-[#D6B36A]/20 hover:bg-[#D6B36A]/30 text-[#D6B36A] border border-[#D6B36A]/40 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-gold-glow transition-all"
                        title="Add to Google Calendar with 5-minute reminder"
                      >
                        <Bell className="w-3.5 h-3.5 text-[#D6B36A]" /> Calendar (5m Notice)
                      </a>

                      {session.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleConfirmCompletion(session, partner)}
                          disabled={myConfirmed}
                          className={`px-4 py-2.5 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            myConfirmed
                              ? 'liquid-glass-base text-[#D6B36A] border border-[#D6B36A]/30 cursor-default'
                              : 'accent-gradient-bg text-[#05070A] shadow-glow hover:scale-105'
                          }`}
                        >
                          {myConfirmed ? (
                            <> <Check className="w-3.5 h-3.5" /> Waiting for Partner </>
                          ) : (
                            'Confirm Session Completion'
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => openReviewModal(partner, session._id)}
                          className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-[#D6B36A] font-extrabold text-xs rounded-xl border border-[#D6B36A]/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-[#D6B36A]" /> Rate Peer Mentor
                        </button>
                      )}
                    </>
                  )}

                  {/* Individual Delete / Clear Button for Past Sessions */}
                  {isPast && (
                    <button
                      onClick={() => handleDeleteSession(session._id)}
                      className="p-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Clear past meeting history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                </div>

              </LiquidGlassCard>
            );
          })}
        </div>
      )}

      {/* Multi-Criterion Peer Rating Modal */}
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
