const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'name username avatar city rating trustScore')
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name avatar username')
      .populate('sessionRef')
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, recipientId, text, imageUrl, sessionRef } = req.body;
    const senderId = req.user._id;

    let convId = conversationId;

    if (!convId && recipientId) {
      // Find or create conversation between sender and recipient
      let conv = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] }
      });

      if (!conv) {
        conv = await Conversation.create({
          participants: [senderId, recipientId],
          lastMessage: text,
          lastMessageAt: new Date()
        });
      }
      convId = conv._id;
    }

    const message = await Message.create({
      conversationId: convId,
      senderId,
      text,
      imageUrl: imageUrl || '',
      sessionRef: sessionRef || null
    });

    await Conversation.findByIdAndUpdate(convId, {
      lastMessage: text,
      lastMessageAt: new Date()
    });

    const populatedMsg = await Message.findById(message._id).populate('senderId', 'name avatar username');

    res.status(201).json({ success: true, message: populatedMsg, conversationId: convId });
  } catch (err) {
    next(err);
  }
};

module.exports = { getConversations, getMessages, sendMessage };
