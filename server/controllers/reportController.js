const Report = require('../models/Report');

const submitReport = async (req, res, next) => {
  try {
    const { targetUserId, reason, details } = req.body;
    const report = await Report.create({
      reporterId: req.user._id,
      targetUserId,
      reason,
      details: details || ''
    });

    res.json({ success: true, report, message: 'Report submitted successfully. Our safety team will review it.' });
  } catch (err) {
    next(err);
  }
};

const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporterId', 'name username avatar')
      .populate('targetUserId', 'name username avatar isSuspended')
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitReport, getReports };
