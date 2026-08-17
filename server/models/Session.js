const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Teacher
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Learner
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  skillName: { type: String, required: true },
  durationHours: { type: Number, default: 1.0 },
  scheduledAt: { type: Date, required: true, index: true },
  mode: { type: String, default: 'Online' },
  meetingLink: { type: String, default: 'https://meet.google.com/new' },
  locationNotes: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['REQUESTED', 'ACCEPTED', 'DECLINED', 'REJECTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
    default: 'REQUESTED',
    index: true
  },
  hostConfirmed: { type: Boolean, default: false },
  participantConfirmed: { type: Boolean, default: false },
  creditTransferred: { type: Boolean, default: false },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancellationReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
