const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: [
      'SWAP_REQUEST',
      'REQUEST_ACCEPTED',
      'SWAP_ACCEPTED',
      'SWAP_DECLINED',
      'SESSION_UPDATE',
      'SESSION_COMPLETED',
      'CREDIT_EARNED',
      'CREDIT_SPENT',
      'NEW_MESSAGE',
      'NEW_REVIEW',
      'REVIEW_RECEIVED',
      'DISPUTE_UPDATE',
      'SYSTEM'
    ],
    default: 'SYSTEM'
  },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
