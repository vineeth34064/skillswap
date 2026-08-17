const mongoose = require('mongoose');

const creditTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: ['EARN', 'SPEND', 'BONUS', 'REFUND', 'PENALTY'],
    required: true,
    index: true
  },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  reason: { type: String, required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('CreditTransaction', creditTransactionSchema);
