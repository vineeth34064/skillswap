const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  coverBanner: { type: String, default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  headline: { type: String, default: 'SkillSwap Community Member' },
  bio: { type: String, default: 'Passionate about sharing skills, exchanging time, and learning new ideas.' },
  persona: { type: String, enum: ['Student', 'Professional', 'Freelancer', 'Teacher'], default: 'Professional' },
  experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
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
  
  // Real Trust Verification Layer
  isVerified: { type: Boolean, default: true },
  verifications: {
    phone: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    college: { type: Boolean, default: false },
    linkedin: { type: Boolean, default: false },
    govId: { type: Boolean, default: false },
    mentor: { type: Boolean, default: true }
  },

  // Social Connections & Portfolio
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  websiteUrl: { type: String, default: '' },
  portfolio: [{
    title: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    projectUrl: { type: String, default: '' },
    category: { type: String, default: 'General' },
    createdAt: { type: Date, default: Date.now }
  }],

  // Safety & Moderation
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  mutedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Monetization & Subscription
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: { type: Date },

  // User Settings & Privacy
  settings: {
    darkMode: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    privateProfile: { type: Boolean, default: false },
    timezone: { type: String, default: 'UTC' }
  },

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
