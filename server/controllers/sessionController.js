const Session = require('../models/Session');
const User = require('../models/User');
const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');
const CreditTransaction = require('../models/CreditTransaction');
const Notification = require('../models/Notification');
const UserBadge = require('../models/UserBadge');
const { updateTrustScore } = require('../services/trustScoreCalculator');

const createSessionRequest = async (req, res, next) => {
  try {
    let { partnerId, skillId, durationHours, scheduledAt, mode, meetingLink, locationNotes, notes } = req.body;
    const currentUserId = req.user._id;

    if (!partnerId) {
      return res.status(400).json({ success: false, message: 'Partner ID is required' });
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

    const session = await Session.create({
      hostId: partnerId,
      participantId: currentUserId,
      skillId: skillId || null,
      skillName: skillName,
      durationHours: durationHours || 1.0,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      mode: mode || 'Online',
      meetingLink: meetingLink || 'https://meet.google.com/new',
      locationNotes: locationNotes || '',
      notes: notes || '',
      status: 'REQUESTED'
    });

    // Notify host of swap request
    await Notification.create({
      userId: partnerId,
      title: 'New Skill Swap Request!',
      message: `${req.user.name} requested a 1-hour swap session for ${skillName}.`,
      type: 'SWAP_REQUEST',
      link: `/sessions`
    });

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

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.hostId.toString() !== currentUserId.toString()) {
      return res.status(403).json({ success: false, message: 'Only the requested mentor can respond to this request' });
    }

    session.status = status;
    await session.save();

    // Notify participant
    try {
      await Notification.create({
        userId: session.participantId,
        title: `Swap Request ${status === 'ACCEPTED' ? 'Accepted!' : 'Declined'}`,
        message: `Your request for ${session.skillName} was ${status.toLowerCase()}.`,
        type: status === 'ACCEPTED' ? 'REQUEST_ACCEPTED' : 'SWAP_DECLINED',
        link: `/sessions`
      });
    } catch (notifErr) {
      console.warn('Notification creation warning:', notifErr.message);
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
        await CreditTransaction.create({
          fromUserId: participant._id,
          toUserId: host._id,
          sessionId: session._id,
          amount: duration,
          type: 'EARNED',
          description: `Time Credit earned for teaching ${session.skillName}`
        });

        // Recalculate Trust Scores
        await updateTrustScore(host._id);
        await updateTrustScore(participant._id);

        // Notifications
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
      status: { $in: ['COMPLETED', 'DECLINED', 'CANCELLED'] }
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
