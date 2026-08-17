const User = require('../models/User');

const updateTrustScore = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  let score = 50; // base score

  // Completed sessions contribution (up to 25 pts)
  score += Math.min(25, user.completedSessions * 2);

  // Rating contribution (up to 20 pts)
  score += Math.round((user.rating / 5.0) * 20);

  // Profile completeness (photo, bio, city) (10 pts)
  if (user.avatar) score += 3;
  if (user.bio && user.bio.length > 20) score += 4;
  if (user.city) score += 3;

  // Verification status (15 pts)
  if (user.isVerified) score += 15;

  // Clamp between 30 and 99
  const finalScore = Math.min(99, Math.max(30, score));

  user.trustScore = finalScore;
  await user.save();
  return finalScore;
};

module.exports = { updateTrustScore };
