const Reel = require('../models/Reel');

const getReels = async (req, res, next) => {
  try {
    const reels = await Reel.find()
      .populate('mentorId', 'name username avatar trustScore badges headline')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json({ success: true, reels });
  } catch (err) {
    next(err);
  }
};

const createReel = async (req, res, next) => {
  try {
    const { title, description, videoUrl, skillName, durationSeconds } = req.body;
    const reel = await Reel.create({
      mentorId: req.user._id,
      title,
      description: description || '',
      videoUrl,
      skillName: skillName || 'General',
      durationSeconds: durationSeconds || 30
    });

    const populated = await Reel.findById(reel._id).populate('mentorId', 'name username avatar trustScore badges headline');
    res.json({ success: true, reel: populated });
  } catch (err) {
    next(err);
  }
};

const toggleLikeReel = async (req, res, next) => {
  try {
    const { reelId } = req.params;
    const userId = req.user._id;
    const reel = await Reel.findById(reelId);
    if (!reel) return res.status(404).json({ success: false, message: 'Reel not found' });

    const likedIndex = reel.likes.indexOf(userId);
    if (likedIndex > -1) {
      reel.likes.splice(likedIndex, 1);
      reel.likesCount = Math.max(0, reel.likesCount - 1);
    } else {
      reel.likes.push(userId);
      reel.likesCount += 1;
    }

    await reel.save();
    res.json({ success: true, likesCount: reel.likesCount, isLiked: reel.likes.includes(userId) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReels, createReel, toggleLikeReel };
