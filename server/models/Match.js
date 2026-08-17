const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  matchScore: { type: Number, required: true }, // e.g. 98
  isDirectSwap: { type: Boolean, default: false },
  reasons: [{ type: String }],
  reciprocalSkills: [{
    userATeaches: { type: String },
    userBTeaches: { type: String }
  }]
}, { timestamps: true });

matchSchema.index({ userA: 1, userB: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
