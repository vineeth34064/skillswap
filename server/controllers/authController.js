const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CreditTransaction = require('../models/CreditTransaction');
const UserSkill = require('../models/UserSkill');

// In-Memory OTP Store (email -> { code, expiresAt })
const otpStore = new Map();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skillswap_dev_secret_key_2026_jwt', {
    expiresIn: '30d'
  });
};

const register = async (req, res, next) => {
  try {
    const { name, username, email, password, city, bio, learningMode, teachSkills, learnSkills } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Initial 2.0 Time Credits bonus for new users
    const user = await User.create({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      city: city || 'New York',
      bio: bio || 'Excited to swap skills and share knowledge on SkillSwap!',
      learningMode: learningMode || 'Both',
      timeCredits: 2.0
    });

    // Record signup bonus transaction
    await CreditTransaction.create({
      userId: user._id,
      type: 'BONUS',
      amount: 2.0,
      balanceAfter: 2.0,
      reason: 'Welcome Signup Bonus (2.0 Time Credits)'
    });

    // Process onboarding skills if provided
    if (teachSkills && Array.isArray(teachSkills)) {
      for (const skillItem of teachSkills) {
        await UserSkill.create({
          userId: user._id,
          skillId: skillItem.skillId,
          type: 'TEACH',
          level: skillItem.level || 'Intermediate'
        });
      }
    }

    if (learnSkills && Array.isArray(learnSkills)) {
      for (const skillItem of learnSkills) {
        await UserSkill.create({
          userId: user._id,
          skillId: skillItem.skillId,
          type: 'LEARN',
          level: skillItem.level || 'Beginner'
        });
      }
    }

    const token = generateToken(user._id);

    // HTTP-only cookie setting for web
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        city: user.city,
        timeCredits: user.timeCredits,
        trustScore: user.trustScore,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, message: 'Please enter credentials' });
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        city: user.city,
        timeCredits: user.timeCredits,
        trustScore: user.trustScore,
        rating: user.rating,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    next(err);
  }
};

const sendEmailOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required' });
    }

    const cleanEmail = email.toLowerCase();
    // Generate 6-digit random numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

    otpStore.set(cleanEmail, { code: otpCode, expiresAt });

    console.log(`[AUTH] Email Verification OTP for ${cleanEmail}: ${otpCode}`);

    res.json({
      success: true,
      message: `Verification code generated for ${cleanEmail}`,
      otpCode // Included for instant verification
    });
  } catch (err) {
    next(err);
  }
};

const verifyEmailOTP = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    const cleanEmail = email.toLowerCase();
    const stored = otpStore.get(cleanEmail);

    if (!stored || stored.code !== otpCode || stored.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    otpStore.delete(cleanEmail);

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const baseUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '');
      let uniqueUsername = baseUsername;
      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${counter}`;
        counter++;
      }

      const randomPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      const rawName = baseUsername.replace(/[\._]/g, ' ');
      const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      user = await User.create({
        name: formattedName,
        username: uniqueUsername,
        email: cleanEmail,
        passwordHash,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300`,
        city: 'Global (Email Verified)',
        bio: 'SkillSwap member verified via Email OTP.',
        learningMode: 'Both',
        timeCredits: 2.0,
        isVerified: true
      });

      await CreditTransaction.create({
        userId: user._id,
        type: 'BONUS',
        amount: 2.0,
        balanceAfter: 2.0,
        reason: 'Welcome Email Verification Bonus (2.0 Time Credits)'
      });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        city: user.city,
        timeCredits: user.timeCredits,
        trustScore: user.trustScore,
        rating: user.rating || 5.0,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    next(err);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google authentication failed: Email is required' });
    }

    const cleanEmail = email.toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const baseUsername = cleanEmail.split('@')[0].replace(/[^a-z0-9_]/g, '');
      let uniqueUsername = baseUsername;
      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${counter}`;
        counter++;
      }

      const randomPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || baseUsername,
        username: uniqueUsername,
        email: cleanEmail,
        passwordHash,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        city: 'Global (Google Auth)',
        bio: 'SkillSwap member authenticated via Google.',
        learningMode: 'Both',
        timeCredits: 2.0,
        isVerified: true
      });

      await CreditTransaction.create({
        userId: user._id,
        type: 'BONUS',
        amount: 2.0,
        balanceAfter: 2.0,
        reason: 'Welcome Google Auth Bonus (2.0 Time Credits)'
      });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        city: user.city,
        timeCredits: user.timeCredits,
        trustScore: user.trustScore,
        rating: user.rating || 5.0,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    const userSkills = await UserSkill.find({ userId: req.user._id }).populate('skillId');

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        teachSkills: userSkills.filter(s => s.type === 'TEACH'),
        learnSkills: userSkills.filter(s => s.type === 'LEARN')
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, sendEmailOTP, verifyEmailOTP, googleAuth, getMe };
