const mongoose = require('mongoose');

const userBadgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  badgeCode: { type: String, required: true },
  awardedAt: { type: Date, default: Date.now }
}, { timestamps: true });

userBadgeSchema.index({ userId: 1, badgeCode: 1 }, { unique: true });

module.exports = mongoose.model('UserBadge', userBadgeSchema);
