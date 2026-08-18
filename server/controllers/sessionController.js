const Session = require('../models/Session');
const User = require('../models/User');
const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');
const CreditTransaction = require('../models/CreditTransaction');
const Notification = require('../models/Notification');
const UserBadge = require('../models/UserBadge');
const { updateTrustScore } = require('../services/trustScoreCalculator');

const generateGoogleMeetLink = (seed) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  if (seed) {
    const clean = String(seed).toLowerCase().replace(/[^a-z0-9]/g, '');
    let p1 = '', p2 = '', p3 = '';
    for (let i = 0; i < 3; i++) p1 += chars[(clean.charCodeAt(i % clean.length) || i) % chars.length];
    for (let i = 3; i < 7; i++) p2 += chars[(clean.charCodeAt(i % clean.length) || i) % chars.length];
    for (let i = 7; i < 10; i++) p3 += chars[(clean.charCodeAt(i % clean.length) || i) % chars.length];
    return `https://meet.google.com/${p1}-${p2}-${p3}`;
  }
  const getRand = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://meet.google.com/${getRand(3)}-${getRand(4)}-${getRand(3)}`;
};

const createSessionRequest = async (req, res, next) => {
  try {
    let { partnerId, skillId, durationHours, scheduledAt, mode, meetingLink, locationNotes, notes } = req.body;
    const currentUserId = req.user._id;

    if (!partnerId) {
      return res.status(400).json({ success: false, message: 'Partner ID is required' });
    }

    if (currentUserId.toString() === partnerId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request a swap session with yourself' });
    }

    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner user not found' });
    }

    let skillName = 'Skill Swap Session';
    let targetSkill = null;

    if (skillId && skillId !== 'general') {
      targetSkill = await Skill.findById(skillId);
      if (targetSkill) skillName = targetSkill.name;
    }

    if (!targetSkill) {
      const teacherSkills = await UserSkill.find({ userId: partnerId, type: 'TEACH' }).populate('skillId');
      if (teacherSkills && teacherSkills.length > 0 && teacherSkills[0].skillId) {
        targetSkill = teacherSkills[0].skillId;
        skillId = targetSkill._id;
        skillName = targetSkill.name;
      }
    }

    if (!targetSkill) {
      targetSkill = await Skill.findOne();
      if (targetSkill) {
        skillId = targetSkill._id;
        skillName = targetSkill.name;
      }
    }

    // Generate unique, persistent Google Meet room shared by both peers
    if (!meetingLink || meetingLink.trim() === '' || meetingLink === 'https://meet.google.com/new' || meetingLink === 'https://meet.google.com/') {
      meetingLink = generateGoogleMeetLink();
    }

    const session = await Session.create({
      hostId: partnerId,
      participantId: currentUserId,
      skillId: skillId || null,
      skillName: skillName,
      durationHours: durationHours || 1.0,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      mode: mode || 'Online',
      meetingLink: meetingLink,
      locationNotes: locationNotes || '',
      notes: notes || '',
      status: 'REQUESTED'
    });

    // Notify host of swap request with room link
    try {
      await Notification.create({
        userId: partnerId,
        title: 'New Skill Swap Request!',
        message: `${req.user.name} requested a 1-hour swap session for ${skillName}. Google Meet room: ${meetingLink}`,
        type: 'SWAP_REQUEST',
        link: `/requests`
      });
    } catch (notifErr) {
      console.warn('Notification warning:', notifErr.message);
    }

    res.status(201).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

const respondToSessionRequest = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body; // ACCEPTED or DECLINED
    const currentUserId = req.user._id;

    if (!['ACCEPTED', 'DECLINED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid response status' });
    }

    const session = await Session.findById(sessionId)
      .populate('hostId', 'name username avatar city trustScore rating')
      .populate('participantId', 'name username avatar city trustScore rating');

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const hostIdStr = session.hostId._id ? session.hostId._id.toString() : session.hostId.toString();
    if (hostIdStr !== currentUserId.toString()) {
      return res.status(403).json({ success: false, message: 'Only the requested mentor can respond to this request' });
    }

    session.status = status;
    await session.save();

    const participantIdStr = session.participantId._id ? session.participantId._id.toString() : session.participantId.toString();
    const hostName = session.hostId?.name || req.user.name;

    // 1. Notify participant via MongoDB notification
    try {
      await Notification.create({
        userId: participantIdStr,
        title: `Swap Request ${status === 'ACCEPTED' ? 'Accepted! 🎉' : 'Declined'}`,
        message: status === 'ACCEPTED'
          ? `${hostName} accepted your swap request for ${session.skillName}! Your Google Meet link is: ${session.meetingLink}`
          : `${hostName} was unable to accept your swap request for ${session.skillName}.`,
        type: status === 'ACCEPTED' ? 'REQUEST_ACCEPTED' : 'SWAP_DECLINED',
        link: `/requests`
      });
    } catch (notifErr) {
      console.warn('Notification creation warning:', notifErr.message);
    }

    // 2. Real-time Socket.io dispatch so other user's screen updates immediately
    if (req.io) {
      req.io.to(`user:${participantIdStr}`).emit('session_updated', {
        session,
        status,
        meetingLink: session.meetingLink,
        title: `Swap Request ${status === 'ACCEPTED' ? 'Accepted! 🎉' : 'Declined'}`,
        message: status === 'ACCEPTED'
          ? `${hostName} accepted your swap request! Join Meet: ${session.meetingLink}`
          : `${hostName} was unable to accept your swap request.`
      });

      req.io.emit('session_status_changed', {
        sessionId: session._id,
        status,
        hostId: hostIdStr,
        participantId: participantIdStr,
        meetingLink: session.meetingLink
      });
    }

    res.status(200).json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

const confirmSessionCompletion = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const currentUserId = req.user._id.toString();

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isHost = session.hostId.toString() === currentUserId;
    const isParticipant = session.participantId.toString() === currentUserId;

    if (!isHost && !isParticipant) {
      return res.status(403).json({ success: false, message: 'Not authorized for this session' });
    }

    if (isHost) session.hostConfirmed = true;
    if (isParticipant) session.participantConfirmed = true;

    let settled = false;

    // Dual confirmation settlement
    if (session.hostConfirmed && session.participantConfirmed && session.status !== 'COMPLETED') {
      session.status = 'COMPLETED';
      settled = true;

      const duration = session.durationHours || 1.0;

      // Transfer 1 Time Credit: Participant (Learner) -> Host (Teacher)
      const host = await User.findById(session.hostId);
      const participant = await User.findById(session.participantId);

      if (host && participant) {
        participant.timeCredits = Math.max(0, participant.timeCredits - duration);
        participant.learningHours = (participant.learningHours || 0) + duration;
        participant.completedSessions = (participant.completedSessions || 0) + 1;
        await participant.save();

        host.timeCredits = (host.timeCredits || 0) + duration;
        host.teachingHours = (host.teachingHours || 0) + duration;
        host.completedSessions = (host.completedSessions || 0) + 1;
        await host.save();

        // Create transaction logs
        try {
          await CreditTransaction.create({
            fromUserId: participant._id,
            toUserId: host._id,
            sessionId: session._id,
            amount: duration,
            type: 'EARNED',
            description: `Time Credit earned for teaching ${session.skillName}`
          });
        } catch (txErr) {
          console.warn('Credit transaction log warning:', txErr.message);
        }

        // Recalculate Trust Scores
        await updateTrustScore(host._id);
        await updateTrustScore(participant._id);

        // Notifications
        try {
          await Notification.create({
            userId: host._id,
            title: `+${duration} Time Credit Earned! ⚡`,
            message: `Session for ${session.skillName} completed. +${duration} Time Credit added to your balance.`,
            type: 'CREDIT_EARNED',
            link: `/dashboard`
          });

          await Notification.create({
            userId: participant._id,
            title: `-${duration} Time Credit Transferred`,
            message: `Session for ${session.skillName} completed. -${duration} Time Credit transferred to ${host.name}.`,
            type: 'CREDIT_SPENT',
            link: `/dashboard`
          });
        } catch (notifErr) {
          console.warn('Completion notification warning:', notifErr.message);
        }
      }
    }

    await session.save();

    res.status(200).json({ success: true, session, settled });
  } catch (err) {
    next(err);
  }
};

const getUserSessions = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    const sessions = await Session.find({
      $or: [{ hostId: currentUserId }, { participantId: currentUserId }]
    })
      .populate('hostId', 'name username avatar city trustScore rating')
      .populate('participantId', 'name username avatar city trustScore rating')
      .populate('skillId', 'name category')
      .sort({ createdAt: -1 });

    // Migrate any session with old /new link to persistent shared room
    for (const s of sessions) {
      if (!s.meetingLink || s.meetingLink === 'https://meet.google.com/new' || s.meetingLink === 'https://meet.google.com/') {
        s.meetingLink = generateGoogleMeetLink(s._id);
        await Session.updateOne({ _id: s._id }, { $set: { meetingLink: s.meetingLink } });
      }
    }

    res.status(200).json({ success: true, sessions });
  } catch (err) {
    next(err);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const currentUserId = req.user._id.toString();

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.hostId.toString() !== currentUserId && session.participantId.toString() !== currentUserId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this session' });
    }

    await Session.findByIdAndDelete(sessionId);
    res.status(200).json({ success: true, message: 'Session deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const clearPastSessions = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    const result = await Session.deleteMany({
      $or: [{ hostId: currentUserId }, { participantId: currentUserId }],
      status: { $in: ['COMPLETED', 'DECLINED', 'REJECTED', 'CANCELLED'] }
    });

    res.status(200).json({ success: true, message: 'Cleared all past sessions', deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSessionRequest,
  respondToSessionRequest,
  confirmSessionCompletion,
  getUserSessions,
  deleteSession,
  clearPastSessions
};
