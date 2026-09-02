const Follow = require('../models/Follow');

const toggleFollow = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    const followerId = req.user._id;

    if (String(followerId) === String(targetUserId)) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    const existing = await Follow.findOne({ followerId, followingId: targetUserId });
    if (existing) {
      await Follow.findByIdAndDelete(existing._id);
      res.json({ success: true, isFollowing: false, message: 'Unfollowed mentor' });
    } else {
      await Follow.create({ followerId, followingId: targetUserId });
      res.json({ success: true, isFollowing: true, message: 'Following mentor!' });
    }
  } catch (err) {
    next(err);
  }
};

const getFollowStats = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user._id;
    const followersCount = await Follow.countDocuments({ followingId: userId });
    const followingCount = await Follow.countDocuments({ followerId: userId });
    const isFollowing = req.user ? !!(await Follow.findOne({ followerId: req.user._id, followingId: userId })) : false;

    res.json({ success: true, followersCount, followingCount, isFollowing });
  } catch (err) {
    next(err);
  }
};

module.exports = { toggleFollow, getFollowStats };
