const User = require('../models/User');
const Session = require('../models/Session');
const CreditTransaction = require('../models/CreditTransaction');
const Dispute = require('../models/Dispute');
const Report = require('../models/Report');
const Skill = require('../models/Skill');
const UserSkill = require('../models/UserSkill');

const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isSuspended: false });
    const totalSessions = await Session.countDocuments();
    const completedSessions = await Session.countDocuments({ status: 'COMPLETED' });

    const totalHoursRes = await Session.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$durationHours' } } }
    ]);
    const totalHoursExchanged = totalHoursRes[0]?.total || 0;

    const totalCreditsRes = await CreditTransaction.aggregate([
      { $match: { type: 'EARN' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalCreditsEarned = totalCreditsRes[0]?.total || 0;

    const openDisputes = await Dispute.countDocuments({ status: 'OPEN' });
    const pendingReports = await Report.countDocuments({ status: 'PENDING' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalSessions,
        completedSessions,
        totalHoursExchanged,
        totalCreditsEarned,
        openDisputes,
        pendingReports
      }
    });
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

const toggleUserSuspension = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} has been ${user.isSuspended ? 'suspended' : 'reactivated'}.`,
      user
    });
  } catch (err) {
    next(err);
  }
};

const getDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find()
      .populate('sessionId')
      .populate('disputerId', 'name email username avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, disputes });
  } catch (err) {
    next(err);
  }
};

const resolveDispute = async (req, res, next) => {
  try {
    const { disputeId } = req.params;
    const { resolution, adminNotes } = req.body; // 'RESOLVED_REFUND', 'RESOLVED_RELEASE', 'DISMISSED'

    const dispute = await Dispute.findById(disputeId).populate('sessionId');
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute not found' });
    }

    dispute.status = resolution || 'DISMISSED';
    dispute.adminNotes = adminNotes || 'Resolved by Administrator';
    await dispute.save();

    res.json({ success: true, dispute, message: `Dispute status updated to ${dispute.status}` });
  } catch (err) {
    next(err);
  }
};

const mergeSkills = async (req, res, next) => {
  try {
    const { targetSkillId, duplicateSkillId } = req.body;

    if (!targetSkillId || !duplicateSkillId) {
      return res.status(400).json({ success: false, message: 'Target skill ID and duplicate skill ID required' });
    }

    // Reassign all UserSkill references to targetSkillId
    await UserSkill.updateMany({ skillId: duplicateSkillId }, { skillId: targetSkillId });
    await Session.updateMany({ skillId: duplicateSkillId }, { skillId: targetSkillId });

    // Remove duplicate skill definition
    await Skill.findByIdAndDelete(duplicateSkillId);

    res.json({ success: true, message: 'Duplicate skill merged successfully into target skill.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  toggleUserSuspension,
  getDisputes,
  resolveDispute,
  mergeSkills
};
