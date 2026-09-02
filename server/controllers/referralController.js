const Referral = require('../models/Referral');
const User = require('../models/User');

const getReferralStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const code = user.username ? user.username.toUpperCase() + '-SWAP' : 'SKILL-' + String(userId).slice(-4).toUpperCase();

    const referrals = await Referral.find({ referrerId: userId }).populate('referredId', 'name avatar username createdAt');
    const totalEarned = referrals.filter(r => r.status === 'COMPLETED').length * 0.5;

    res.json({
      success: true,
      referralCode: code,
      referrals,
      totalEarnedCredits: totalEarned
    });
  } catch (err) {
    next(err);
  }
};

const claimReferral = async (req, res, next) => {
  try {
    const { code } = req.body;
    const referrerUsername = code.replace('-SWAP', '').toLowerCase();
    const referrer = await User.findOne({ username: referrerUsername });

    if (!referrer) return res.status(404).json({ success: false, message: 'Invalid referral code' });
    if (String(referrer._id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Cannot refer yourself' });
    }

    const existing = await Referral.findOne({ referredId: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already used a referral code' });

    const referral = await Referral.create({
      referrerId: referrer._id,
      referredId: req.user._id,
      referralCode: code
    });

    res.json({ success: true, referral, message: 'Referral code applied! Complete your first swap to claim +0.5 bonus credit.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReferralStats, claimReferral };
