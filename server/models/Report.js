const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, enum: ['Spam', 'Harassment', 'Fake skill', 'Fraud', 'Inappropriate behavior', 'No-show', 'Other'], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'RESOLVED', 'DISMISSED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
