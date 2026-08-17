const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  bio: { type: String, default: 'Passionate about sharing skills and learning new ideas.' },
  city: { type: String, default: 'New York' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [-73.935242, 40.730610] } // [lng, lat]
  },
  languages: { type: [String], default: ['English'] },
  learningMode: { type: String, enum: ['Online', 'In person', 'Both'], default: 'Both' },
  timeCredits: { type: Number, default: 2.0 },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  trustScore: { type: Number, default: 88 },
  teachingHours: { type: Number, default: 0 },
  learningHours: { type: Number, default: 0 },
  completedSessions: { type: Number, default: 0 },
  cancellationRate: { type: Number, default: 0 },
  responseRate: { type: Number, default: 98 },
  isVerified: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  availability: [{
    day: { type: String },
    startTime: { type: String },
    endTime: { type: String }
  }]
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
