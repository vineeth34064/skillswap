const User = require('../models/User');
const UserSkill = require('../models/UserSkill');
const Review = require('../models/Review');
const UserBadge = require('../models/UserBadge');
const Badge = require('../models/Badge');
const { updateTrustScore } = require('../services/trustScoreCalculator');

const getProfile = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let user;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(identifier).select('-passwordHash');
    } else {
      user = await User.findOne({ username: identifier.toLowerCase() }).select('-passwordHash');
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Recalculate trust score
    await updateTrustScore(user._id);

    const skills = await UserSkill.find({ userId: user._id }).populate('skillId');
    const validSkills = skills.filter(s => s.skillId);

    const reviews = await Review.find({ targetUserId: user._id })
      .populate('reviewerId', 'name avatar username')
      .sort({ createdAt: -1 });
    
    const userBadges = await UserBadge.find({ userId: user._id });
    const badgeCodes = userBadges.map(b => b.badgeCode);
    const badges = await Badge.find({ code: { $in: badgeCodes } });

    res.json({
      success: true,
      profile: {
        ...user.toObject(),
        teachSkills: validSkills.filter(s => s.type === 'TEACH'),
        learnSkills: validSkills.filter(s => s.type === 'LEARN'),
        reviews,
        badges
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, city, learningMode, languages, availability, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (city) user.city = city;
    if (learningMode) user.learningMode = learningMode;
    if (languages) user.languages = languages;
    if (availability) {
      if (Array.isArray(availability)) {
        user.availability = availability.map(item => {
          if (typeof item === 'string') {
            return { day: item, startTime: '09:00', endTime: '21:00' };
          }
          return item;
        });
      } else {
        user.availability = availability;
      }
    }
    if (avatar) user.avatar = avatar;

    await user.save();
    await updateTrustScore(user._id);

    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

const updateSkills = async (req, res, next) => {
  try {
    const { teachSkills, learnSkills } = req.body;
    const userId = req.user._id;

    // Clear existing skills
    await UserSkill.deleteMany({ userId });

    if (teachSkills && Array.isArray(teachSkills)) {
      for (const item of teachSkills) {
        if (item && item.skillId) {
          await UserSkill.create({
            userId,
            skillId: typeof item.skillId === 'object' ? item.skillId._id : item.skillId,
            type: 'TEACH',
            level: item.level || 'Intermediate',
            experienceYears: item.experienceYears || 1
          });
        }
      }
    }

    if (learnSkills && Array.isArray(learnSkills)) {
      for (const item of learnSkills) {
        if (item && item.skillId) {
          await UserSkill.create({
            userId,
            skillId: typeof item.skillId === 'object' ? item.skillId._id : item.skillId,
            type: 'LEARN',
            level: item.level || 'Beginner'
          });
        }
      }
    }

    const updatedSkills = await UserSkill.find({ userId }).populate('skillId');
    const validUpdated = updatedSkills.filter(s => s.skillId);

    res.json({
      success: true,
      teachSkills: validUpdated.filter(s => s.type === 'TEACH'),
      learnSkills: validUpdated.filter(s => s.type === 'LEARN')
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, updateSkills };
