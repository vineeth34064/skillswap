const User = require('../models/User');
const UserSkill = require('../models/UserSkill');

const getLeaderboard = async (req, res, next) => {
  try {
    // 1. Top Mentors (by Rating & Review Count)
    const topMentorsRaw = await User.find({ isSuspended: { $ne: true } })
      .select('name username avatar city trustScore rating reviewCount teachingHours learningHours completedSessions timeCredits')
      .sort({ rating: -1, reviewCount: -1, completedSessions: -1 })
      .limit(10);

    // 2. Top Sharers (by Teaching Hours)
    const topSharersRaw = await User.find({ isSuspended: { $ne: true } })
      .select('name username avatar city trustScore rating reviewCount teachingHours learningHours completedSessions timeCredits')
      .sort({ teachingHours: -1, completedSessions: -1 })
      .limit(10);

    // 3. Credit Champions (by Time Credits)
    const creditChampionsRaw = await User.find({ isSuspended: { $ne: true } })
      .select('name username avatar city trustScore rating reviewCount teachingHours learningHours completedSessions timeCredits')
      .sort({ timeCredits: -1 })
      .limit(10);

    // Populate teach skills for users
    const populateSkills = async (usersList) => {
      return Promise.all(
        usersList.map(async (u) => {
          const userSkills = await UserSkill.find({ userId: u._id, type: 'TEACH' }).populate('skillId', 'name category');
          return {
            ...u.toObject(),
            teachesSkills: userSkills.map(us => us.skillId).filter(Boolean)
          };
        })
      );
    };

    const [topMentors, topSharers, creditChampions] = await Promise.all([
      populateSkills(topMentorsRaw),
      populateSkills(topSharersRaw),
      populateSkills(creditChampionsRaw)
    ]);

    res.json({
      success: true,
      leaderboard: {
        topMentors,
        topSharers,
        creditChampions
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLeaderboard };
