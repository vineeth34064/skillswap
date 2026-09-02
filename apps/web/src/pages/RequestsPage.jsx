import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import LiquidGlassCard from '../components/LiquidGlassCard';
import TimeCreditBadge from '../components/TimeCreditBadge';
import PeerRatingModal from '../components/PeerRatingModal';
import { Inbox, Send, CheckCircle2, XCircle, Clock, Video, Calendar, ShieldCheck, Sparkles, Bell, ArrowRight, UserCheck, Trash2, Star, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RequestsPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'outgoing' | 'accepted'

  // Rating Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTargetUser, setReviewTargetUser] = useState(null);
  const [reviewSessionId, setReviewSessionId] = useState(null);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions');
      if (res.success) {
        setSessions(res.sessions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    if (socket) {
      socket.on('session_updated', () => {
        fetchSessions();
      });
      socket.on('session_status_changed', () => {
        fetchSessions();
      });
    }

    // Auto-refresh fallback every 8 seconds
    const interval = setInterval(fetchSessions, 8000);

    return () => {
      if (socket) {
        socket.off('session_updated');
        socket.off('session_status_changed');
      }
      clearInterval(interval);
    };
  }, [socket]);

  const handleRespond = async (sessionId, status) => {
    try {
      const res = await api.patch(`/sessions/${sessionId}/respond`, {
        status: status === 'accept' ? 'ACCEPTED' : 'DECLINED'
      });
      if (res.success) {
        fetchSessions();
      }
    } catch (err) {
      alert(err.message || 'Failed to respond to swap request.');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to clear this request from your history?')) return;
    try {
      const res = await api.delete(`/sessions/${sessionId}`);
      if (res.success) fetchSessions();
    } catch (err) {
      alert(err.message || 'Failed to delete request');
    }
  };

  const handleClearPastSessions = async () => {
    if (!window.confirm('Clear all completed, declined, or cancelled past meeting requests?')) return;
    try {
      const res = await api.delete('/sessions/clear-past');
      if (res.success) fetchSessions();
    } catch (err) {
      alert(err.message || 'Failed to clear past sessions');
    }
  };

  const openRatingModal = (partner, sessionId) => {
    setReviewTargetUser(partner);
    setReviewSessionId(sessionId);
    setShowReviewModal(true);
  };

  const generateGoogleCalendarUrl = (session) => {
    const startDate = new Date(session.scheduledAt || Date.now());
    const endDate = new Date(startDate.getTime() + (session.durationHours || 1) * 60 * 60 * 1000);
    const formatCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const title = `SkillSwap Session: ${session.skillName}`;
    const meetUrl = session.meetingLink || 'https://meet.google.com/new';
    const details = `SkillSwap Peer Session.\nGoogle Meet Link: ${meetUrl}\n(5-minute notification set before start time)`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(meetUrl)}&dates=${formatCalDate(startDate)}/${formatCalDate(endDate)}`;
  };

  const currentUserId = String(user?._id || user?.id || '');

  // Filter requests with safe String ID comparison
  const incomingRequests = sessions.filter((s) => {
    const hostIdStr = String(s.hostId?._id || s.hostId?.id || s.hostId);
    return hostIdStr === currentUserId && s.status === 'REQUESTED';
  });

  const outgoingRequests = sessions.filter((s) => {
    const partIdStr = String(s.participantId?._id || s.participantId?.id || s.participantId);
    return partIdStr === currentUserId && s.status === 'REQUESTED';
  });

  const acceptedSessions = sessions.filter(
    (s) => s.status === 'ACCEPTED' || s.status === 'IN_PROGRESS' || s.status === 'COMPLETED'
  );

  const hasPastSessions = sessions.some(s => s.status === 'COMPLETED' || s.status === 'DECLINED' || s.status === 'CANCELLED');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.08 }
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
      {/* Background Glow */}
      <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-[#8B7CFF]/12 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B7CFF]/15 border border-[#8B7CFF]/30 text-[#8B7CFF] text-xs font-mono font-bold">
            <Inbox className="w-3.5 h-3.5 text-[#8B7CFF]" /> SWAP REQUESTS WORKSPACE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Manage <span className="accent-gradient-text">Skill Swap Requests</span>
          </h1>
          <p className="text-sm text-[#B0BAC9]">
            Accept or reject incoming swap requests from peers, and track your sent requests in real time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {hasPastSessions && (
            <button
              onClick={handleClearPastSessions}
              className="px-4 py-3 rounded-full bg-white/10 hover:bg-rose-950/40 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-400" /> Clear Past Meetings
            </button>
          )}

          <button
            onClick={() => navigate('/discover')}
            className="px-5 py-3 accent-gradient-bg text-[#101827] rounded-full font-black text-sm shadow-glow hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Find Peers to Request</span>
            <ArrowRight className="w-4 h-4 text-[#101827]" />
          </button>
        </div>
      </motion.div>

      {/* Tab Switcher */}
      <motion.div variants={itemVariants} className="flex items-center p-1.5 rounded-2xl liquid-glass-base border border-white/15 bg-[#0D1524] max-w-2xl">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'incoming'
              ? 'accent-gradient-bg text-[#101827] shadow-glow'
              : 'text-[#B0BAC9] hover:text-white'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Incoming Requests ({incomingRequests.length})</span>
          {incomingRequests.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {incomingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'outgoing'
              ? 'accent-gradient-bg text-[#101827] shadow-glow'
              : 'text-[#B0BAC9] hover:text-white'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Requests ({outgoingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accepted')}
          className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'accepted'
              ? 'accent-gradient-bg text-[#101827] shadow-glow'
              : 'text-[#B0BAC9] hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Accepted Swaps ({acceptedSessions.length})</span>
        </button>
      </motion.div>

      {/* Main Tab Content */}
      <motion.div variants={itemVariants}>
        
        {/* Tab 1: INCOMING REQUESTS */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            {incomingRequests.length === 0 ? (
              <LiquidGlassCard className="p-12 text-center space-y-4 border border-dashed border-white/10 bg-[#101827]/80">
                <Inbox className="w-12 h-12 text-[#B0BAC9] mx-auto opacity-50" />
                <h3 className="text-lg font-extrabold text-white">No incoming swap requests right now</h3>
                <p className="text-xs text-[#B0BAC9] max-w-md mx-auto">
                  When other peers request to learn your skills, their request will appear here for you to accept or decline!
                </p>
              </LiquidGlassCard>
            ) : (
              incomingRequests.map((session) => (
                <LiquidGlassCard
                  key={session._id}
                  className="p-6 border-white/20 bg-[#101827]/90 space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={session.participantId?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                        alt={session.participantId?.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#8B7CFF]/40 shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-lg text-white">
                            {session.participantId?.name || 'Peer User'}
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-xs text-[#B0BAC9]">
                          @{session.participantId?.username} • {session.participantId?.city}
                        </p>
                      </div>
                    </div>

                    <TimeCreditBadge credits={session.durationHours || 1.0} size="md" />
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-mono text-[#D6B36A] font-extrabold uppercase">REQUESTED TOPIC:</span>
                      <span className="font-bold text-white text-sm">{session.skillName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#B0BAC9] pt-1">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#72C7FF]" /> {new Date(session.scheduledAt).toLocaleString()}</span>
                      <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-[#8B7CFF]" /> {session.mode}</span>
                    </div>
                    {session.notes && (
                      <p className="text-xs text-[#B0BAC9] italic pt-1 border-t border-white/5">
                        "{session.notes}"
                      </p>
                    )}
                  </div>

                  {/* Accept / Reject Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleRespond(session._id, 'decline')}
                      className="px-5 py-2.5 rounded-xl border border-rose-500/40 text-rose-300 hover:bg-rose-950/40 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" /> Reject Request
                    </button>
                    <button
                      onClick={() => handleRespond(session._id, 'accept')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#101827] font-black text-xs shadow-glow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#101827]" /> Accept Swap Request ✓
                    </button>
                  </div>

                </LiquidGlassCard>
              ))
            )}
          </div>
        )}

        {/* Tab 2: OUTGOING REQUESTS */}
        {activeTab === 'outgoing' && (
          <div className="space-y-4">
            {outgoingRequests.length === 0 ? (
              <LiquidGlassCard className="p-12 text-center space-y-4 border border-dashed border-white/10 bg-[#101827]/80">
                <Send className="w-12 h-12 text-[#B0BAC9] mx-auto opacity-50" />
                <h3 className="text-lg font-extrabold text-white">No outgoing swap requests</h3>
                <p className="text-xs text-[#B0BAC9] max-w-md mx-auto">
                  When you request a skill swap with a peer mentor, your sent request status will be tracked here in real time!
                </p>
                <button
                  onClick={() => navigate('/discover')}
                  className="px-5 py-2.5 accent-gradient-bg text-[#101827] rounded-full font-black text-xs shadow-glow cursor-pointer"
                >
                  Explore Peer Mentors
                </button>
              </LiquidGlassCard>
            ) : (
              outgoingRequests.map((session) => (
                <LiquidGlassCard
                  key={session._id}
                  className={`p-6 border space-y-4 transition-all ${
                    session.status === 'ACCEPTED'
                      ? 'border-emerald-500/40 bg-[#061B16]/90 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                      : session.status === 'DECLINED'
                      ? 'border-rose-500/30 bg-[#1A0A10]/90'
                      : 'border-white/20 bg-[#101827]/90'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={session.hostId?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                        alt={session.hostId?.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#8B7CFF]/40"
                      />
                      <div>
                        <h3 className="font-extrabold text-lg text-white">{session.hostId?.name || 'Mentor User'}</h3>
                        <p className="text-xs text-[#B0BAC9]">@{session.hostId?.username} • {session.hostId?.city}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                      {session.status === 'ACCEPTED' ? (
                        <>
                          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-extrabold flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> STATUS: ACCEPTED ✓
                          </span>
                          <a
                            href={session.meetingLink || 'https://meet.google.com/new'}
                            target="_blank"
                            rel="noreferrer"
                            className="px-5 py-2.5 accent-gradient-bg text-[#101827] font-black text-xs rounded-xl shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Video className="w-4 h-4 text-[#101827]" /> Join Google Meet Call
                          </a>
                        </>
                      ) : session.status === 'DECLINED' ? (
                        <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-extrabold flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-400" /> STATUS: DECLINED ✕
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/40 text-xs font-mono font-extrabold flex items-center gap-1.5">
                          <Clock className="w-4 h-4 animate-spin text-[#8B7CFF]" /> Status: PENDING ACCEPTANCE
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteSession(session._id)}
                        className="p-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Cancel/Clear this request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#B0BAC9]">Skill Requested:</span>
                      <span className="font-bold text-white text-sm">{session.skillName}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#B0BAC9]">
                      <span>Scheduled Time:</span>
                      <span className="font-mono text-slate-200">{new Date(session.scheduledAt).toLocaleString()}</span>
                    </div>
                    {session.status === 'ACCEPTED' && (
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-emerald-300 font-mono">Shared Google Meet:</span>
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          {session.meetingLink} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                </LiquidGlassCard>
              ))
            )}
          </div>
        )}

        {/* Tab 3: ACCEPTED & ACTIVE SWAPS */}
        {activeTab === 'accepted' && (
          <div className="space-y-4">
            {acceptedSessions.length === 0 ? (
              <LiquidGlassCard className="p-12 text-center space-y-4 border border-dashed border-white/10 bg-[#101827]/80">
                <UserCheck className="w-12 h-12 text-[#B0BAC9] mx-auto opacity-50" />
                <h3 className="text-lg font-extrabold text-white">No active accepted sessions</h3>
                <p className="text-xs text-[#B0BAC9] max-w-md mx-auto">
                  Once a swap request is accepted by you or your peer mentor, your Google Meet room link will appear here!
                </p>
              </LiquidGlassCard>
            ) : (
              acceptedSessions.map((session) => {
                const hostIdStr = String(session.hostId?._id || session.hostId?.id || session.hostId);
                const isHost = hostIdStr === currentUserId;
                const partner = isHost ? session.participantId : session.hostId;
                const isPast = session.status === 'COMPLETED' || session.status === 'DECLINED';

                return (
                  <LiquidGlassCard
                    key={session._id}
                    className="p-6 border-white/20 bg-[#101827]/90 space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={partner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                          alt={partner?.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40"
                        />
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-extrabold uppercase">
                            {session.status}
                          </span>
                          <h3 className="font-extrabold text-lg text-white mt-1">
                            {isHost ? `Teaching ${session.skillName}` : `Learning ${session.skillName}`} with {partner?.name || 'Peer Mentor'}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        {/* Google Meet Link */}
                        <a
                          href={session.meetingLink || 'https://meet.google.com/new'}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2.5 accent-gradient-bg text-[#101827] font-black text-xs rounded-xl shadow-glow hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Video className="w-4 h-4 text-[#101827]" /> Join Google Meet Call
                        </a>

                        <button
                          onClick={() => openRatingModal(partner, session._id)}
                          className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-[#D6B36A] font-extrabold text-xs rounded-xl border border-[#D6B36A]/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-[#D6B36A]" /> Rate Peer (5 Criteria)
                        </button>

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
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
                      <div className="flex items-center gap-4 text-[#B0BAC9]">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(session.scheduledAt).toLocaleString()}</span>
                      </div>

                      <a
                        href={generateGoogleCalendarUrl(session)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#D6B36A] hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5 text-[#D6B36A]" /> Add to Google Calendar (5m Notice)
                      </a>
                    </div>
                  </LiquidGlassCard>
                );
              })
            )}
          </div>
        )}

      </motion.div>

      {/* Multi-Criterion Peer Rating Modal */}
      <PeerRatingModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        targetUser={reviewTargetUser}
        sessionId={reviewSessionId}
        onSuccess={() => fetchSessions()}
      />

    </motion.div>
  );
};

export default RequestsPage;
