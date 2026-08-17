const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true, index: true },
  type: { type: String, enum: ['TEACH', 'LEARN'], required: true, index: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
  experienceYears: { type: Number, default: 1 },
  notes: { type: String, default: '' }
}, { timestamps: true });

userSkillSchema.index({ userId: 1, skillId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('UserSkill', userSkillSchema);
