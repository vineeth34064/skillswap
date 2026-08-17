const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  disputerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, enum: ['No-show', 'Session not completed', 'Incorrect duration', 'Misrepresentation', 'Other'], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'RESOLVED_REFUND', 'RESOLVED_RELEASE', 'DISMISSED'], default: 'OPEN' },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
