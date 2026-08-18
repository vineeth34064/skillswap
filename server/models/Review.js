const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: false, index: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  communication: { type: Number, default: 5, min: 1, max: 5 },
  teachingQuality: { type: Number, default: 5, min: 1, max: 5 },
  knowledge: { type: Number, default: 5, min: 1, max: 5 },
  behavior: { type: Number, default: 5, min: 1, max: 5 },
  reliability: { type: Number, default: 5, min: 1, max: 5 },
  comment: { type: String, default: 'Great skill swap session!' }
}, { timestamps: true });

reviewSchema.index({ sessionId: 1, reviewerId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
