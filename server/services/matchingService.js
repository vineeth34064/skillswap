const UserSkill = require('../models/UserSkill');
const User = require('../models/User');

// Calculate Haversine distance in km
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 10;
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const calculateMatchesForUser = async (currentUserId) => {
  try {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return [];

    // Get current user's skills safely
    const currentUserSkills = await UserSkill.find({ userId: currentUserId }).populate('skillId');
    const userTeaches = currentUserSkills.filter(s => s.type === 'TEACH' && s.skillId);
    const userWants = currentUserSkills.filter(s => s.type === 'LEARN' && s.skillId);

    const userTeachNames = userTeaches.map(s => (s.skillId?.name || '').toLowerCase()).filter(Boolean);
    const userWantNames = userWants.map(s => (s.skillId?.name || '').toLowerCase()).filter(Boolean);

    // Get all other active users
    const otherUsers = await User.find({
      _id: { $ne: currentUserId },
      isSuspended: false
    });

    const matches = [];

    for (const otherUser of otherUsers) {
      const otherUserSkills = await UserSkill.find({ userId: otherUser._id }).populate('skillId');
      const otherTeaches = otherUserSkills.filter(s => s.type === 'TEACH' && s.skillId);
      const otherWants = otherUserSkills.filter(s => s.type === 'LEARN' && s.skillId);

      const otherTeachNames = otherTeaches.map(s => (s.skillId?.name || '').toLowerCase()).filter(Boolean);
      const otherWantNames = otherWants.map(s => (s.skillId?.name || '').toLowerCase()).filter(Boolean);

      // 1. Skill Compatibility (40%)
      let skillScore = 0;
      const reasons = [];
      const reciprocalSkills = [];

      // Check what current user wants that other user teaches
      const matchedWantToTeach = userWantNames.filter(want => otherTeachNames.includes(want));
      // Check what other user wants that current user teaches
      const matchedTeachToWant = userTeachNames.filter(teach => otherWantNames.includes(teach));

      const isReciprocal = matchedWantToTeach.length > 0 && matchedTeachToWant.length > 0;

      if (isReciprocal) {
        skillScore = 40;
        const uWantCap = matchedWantToTeach[0].toUpperCase();
        const uTeachCap = matchedTeachToWant[0].toUpperCase();
        reasons.push(`Perfect Swap: You offer ${uTeachCap} and ${otherUser.name} teaches ${uWantCap}`);
        reciprocalSkills.push({ userATeaches: uTeachCap, userBTeaches: uWantCap });
      } else if (matchedWantToTeach.length > 0) {
        skillScore = 25;
        const uWantCap = matchedWantToTeach[0].toUpperCase();
        reasons.push(`${otherUser.name} teaches ${uWantCap} which you want to learn`);
      } else if (matchedTeachToWant.length > 0) {
        skillScore = 20;
        reasons.push(`${otherUser.name} wants to learn ${matchedTeachToWant[0].toUpperCase()} which you teach`);
      } else {
        // Fallback score if no direct match but complementary skill profile
        skillScore = otherTeaches.length > 0 ? 10 : 0;
      }

      if (skillScore === 0) continue; // Skip if no skill overlap at all

      // 2. Availability Overlap (20%)
      let availabilityScore = 15;
      const userDays = Array.isArray(currentUser.availability)
        ? currentUser.availability.map(a => typeof a === 'object' ? a.day : a)
        : [];
      const otherDays = Array.isArray(otherUser.availability)
        ? otherUser.availability.map(a => typeof a === 'object' ? a.day : a)
        : [];
      const sharedDays = userDays.filter(day => otherDays.includes(day));

      if (sharedDays.length > 0) {
        availabilityScore = 20;
        reasons.push(`Overlapping availability on ${sharedDays.join(', ')}`);
      } else {
        reasons.push('Flexible scheduling available');
      }

      // 3. Location / Distance (10%)
      let locationScore = 10;
      const distKm = calculateDistanceKm(
        currentUser.location?.coordinates?.[1], currentUser.location?.coordinates?.[0],
        otherUser.location?.coordinates?.[1], otherUser.location?.coordinates?.[0]
      );

      if (distKm <= 5) {
        locationScore = 10;
        reasons.push(`Nearby (${distKm.toFixed(1)} km away in ${otherUser.city || 'your area'})`);
      } else if (distKm <= 25) {
        locationScore = 8;
        reasons.push(`Within driving distance (${distKm.toFixed(1)} km)`);
      } else {
        locationScore = 6;
        reasons.push(`Available for online exchange`);
      }

      // 4. Learning Preference (10%)
      let prefScore = 10;
      if (currentUser.learningMode === 'Both' || otherUser.learningMode === 'Both' || currentUser.learningMode === otherUser.learningMode) {
        prefScore = 10;
        reasons.push(`Compatible mode (${currentUser.learningMode === 'Both' ? 'Online & In-person' : currentUser.learningMode})`);
      } else {
        prefScore = 5;
      }

      // 5. Skill Level & Trust Rating (20%)
      let ratingScore = Math.min(10, Math.round(((otherUser.rating || 4.5) / 5.0) * 10));
      let trustBonus = Math.min(10, Math.round(((otherUser.trustScore || 85) / 100) * 10));

      const totalScore = Math.min(99, Math.max(50, Math.round(skillScore + availabilityScore + locationScore + prefScore + ratingScore + trustBonus)));

      matches.push({
        user: {
          _id: otherUser._id,
          name: otherUser.name,
          username: otherUser.username,
          avatar: otherUser.avatar,
          city: otherUser.city,
          rating: otherUser.rating || 5.0,
          trustScore: otherUser.trustScore || 90,
          teachingHours: otherUser.teachingHours || 0,
          learningHours: otherUser.learningHours || 0,
          completedSessions: otherUser.completedSessions || 0,
          learningMode: otherUser.learningMode || 'Online',
          bio: otherUser.bio || ''
        },
        matchScore: totalScore,
        isDirectSwap: isReciprocal,
        reasons,
        distanceKm: parseFloat(distKm.toFixed(1)),
        teachesSkills: otherTeaches.map(s => ({ name: s.skillId?.name || 'Skill', level: s.level || 'Intermediate', category: s.skillId?.category || 'General' })),
        wantsSkills: otherWants.map(s => ({ name: s.skillId?.name || 'Skill', level: s.level || 'Beginner', category: s.skillId?.category || 'General' }))
      });
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  } catch (err) {
    console.error('Matching Engine Calculation Error:', err);
    return [];
  }
};

module.exports = { calculateMatchesForUser, calculateDistanceKm };
