const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true, index: true },
  complainantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  respondentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: {
    type: String,
    enum: ['MENTOR_ABSENT', 'WRONG_SKILL', 'ABUSIVE_BEHAVIOR', 'TECH_ISSUE', 'OTHER'],
    required: true
  },
  details: { type: String, default: '' },
  evidenceUrls: [{ type: String }],
  status: {
    type: String,
    enum: ['PENDING', 'REFUNDED', 'SPLIT', 'DISMISSED'],
    default: 'PENDING'
  },
  adminNotes: { type: String, default: '' },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
