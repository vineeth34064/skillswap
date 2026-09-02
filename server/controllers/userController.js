const User = require('../models/User');
const UserSkill = require('../models/UserSkill');
const Review = require('../models/Review');
const UserBadge = require('../models/UserBadge');
const Badge = require('../models/Badge');
const Session = require('../models/Session');
const CreditTransaction = require('../models/CreditTransaction');
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
    const { 
      name, bio, city, learningMode, languages, availability, avatar, coverBanner,
      headline, persona, experienceLevel, githubUrl, linkedinUrl, websiteUrl
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (city) user.city = city;
    if (learningMode) user.learningMode = learningMode;
    if (languages) user.languages = languages;
    if (headline !== undefined) user.headline = headline;
    if (persona) user.persona = persona;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    if (coverBanner) user.coverBanner = coverBanner;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (websiteUrl !== undefined) user.websiteUrl = websiteUrl;

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

// Portfolio Management
const addPortfolioItem = async (req, res, next) => {
  try {
    const { title, description, imageUrl, projectUrl, category } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newItem = {
      title,
      description: description || '',
      imageUrl: imageUrl || '',
      projectUrl: projectUrl || '',
      category: category || 'General',
      createdAt: new Date()
    };

    user.portfolio.unshift(newItem);
    await user.save();

    res.json({ success: true, portfolio: user.portfolio });
  } catch (err) {
    next(err);
  }
};

const removePortfolioItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.portfolio = user.portfolio.filter(item => String(item._id) !== itemId);
    await user.save();

    res.json({ success: true, portfolio: user.portfolio });
  } catch (err) {
    next(err);
  }
};

// Verification Layer
const updateVerifications = async (req, res, next) => {
  try {
    const { phone, email, college, linkedin, govId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (phone !== undefined) user.verifications.phone = phone;
    if (email !== undefined) user.verifications.email = email;
    if (college !== undefined) user.verifications.college = college;
    if (linkedin !== undefined) user.verifications.linkedin = linkedin;
    if (govId !== undefined) user.verifications.govId = govId;

    await user.save();
    res.json({ success: true, verifications: user.verifications });
  } catch (err) {
    next(err);
  }
};

// Safety: Block & Unblock Users
const blockUser = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.blockedUsers.includes(targetUserId)) {
      user.blockedUsers.push(targetUserId);
      await user.save();
    }

    res.json({ success: true, blockedUsers: user.blockedUsers });
  } catch (err) {
    next(err);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.blockedUsers = user.blockedUsers.filter(id => String(id) !== targetUserId);
    await user.save();

    res.json({ success: true, blockedUsers: user.blockedUsers });
  } catch (err) {
    next(err);
  }
};

// Settings Management
const updateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.settings = { ...user.settings, ...settings };
    await user.save();

    res.json({ success: true, settings: user.settings });
  } catch (err) {
    next(err);
  }
};

// Account Data Export
const exportUserData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-passwordHash');
    const skills = await UserSkill.find({ userId }).populate('skillId');
    const sessions = await Session.find({ $or: [{ hostId: userId }, { participantId: userId }] });
    const reviews = await Review.find({ reviewerId: userId });
    const transactions = await CreditTransaction.find({ $or: [{ senderId: userId }, { receiverId: userId }] });

    res.json({
      success: true,
      exportData: {
        profile: user,
        skills,
        sessions,
        reviews,
        transactions,
        exportedAt: new Date()
      }
    });
  } catch (err) {
    next(err);
  }
};

// Account Deletion (Play Store Requirement)
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await UserSkill.deleteMany({ userId });
    await Session.deleteMany({ $or: [{ hostId: userId }, { participantId: userId }] });
    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateSkills,
  addPortfolioItem,
  removePortfolioItem,
  updateVerifications,
  blockUser,
  unblockUser,
  updateSettings,
  exportUserData,
  deleteAccount
};
