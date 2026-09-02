const Dispute = require('../models/Dispute');
const Session = require('../models/Session');

const fileDispute = async (req, res, next) => {
  try {
    const { sessionId, respondentId, reason, details, evidenceUrls } = req.body;
    const dispute = await Dispute.create({
      sessionId,
      complainantId: req.user._id,
      respondentId,
      reason,
      details: details || '',
      evidenceUrls: evidenceUrls || []
    });

    await Session.findByIdAndUpdate(sessionId, { status: 'CANCELLED' });

    res.json({ success: true, dispute, message: 'Dispute submitted. Admin will review within 24h.' });
  } catch (err) {
    next(err);
  }
};

const getDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find()
      .populate('complainantId', 'name avatar username')
      .populate('respondentId', 'name avatar username')
      .populate('sessionId')
      .sort({ createdAt: -1 });

    res.json({ success: true, disputes });
  } catch (err) {
    next(err);
  }
};

const resolveDispute = async (req, res, next) => {
  try {
    const { disputeId } = req.params;
    const { status, adminNotes } = req.body;
    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });

    dispute.status = status;
    dispute.adminNotes = adminNotes || '';
    dispute.resolvedAt = new Date();
    await dispute.save();

    res.json({ success: true, dispute });
  } catch (err) {
    next(err);
  }
};

module.exports = { fileDispute, getDisputes, resolveDispute };
