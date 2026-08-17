const CreditTransaction = require('../models/CreditTransaction');
const User = require('../models/User');

const getWallet = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('timeCredits teachingHours learningHours completedSessions');
    
    const transactions = await CreditTransaction.find({ userId })
      .populate('relatedUserId', 'name avatar username')
      .populate('sessionId', 'skillName durationHours')
      .sort({ createdAt: -1 });

    const totalEarned = transactions
      .filter(t => t.type === 'EARN' || t.type === 'BONUS')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpent = transactions
      .filter(t => t.type === 'SPEND')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      wallet: {
        balance: user.timeCredits,
        totalEarned,
        totalSpent,
        teachingHours: user.teachingHours,
        learningHours: user.learningHours,
        completedSessions: user.completedSessions,
        transactions
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWallet };
