const mongoose = require('mongoose');

const deviceSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ipAddress: { type: String, default: '127.0.0.1' },
  userAgent: { type: String, default: 'Web Browser' },
  deviceType: { type: String, default: 'Desktop' },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('DeviceSession', deviceSessionSchema);
