const SKILL_CATEGORIES = [
  "Technology",
  "Design",
  "Business",
  "Languages",
  "Music",
  "Sports",
  "Academic",
  "Cooking",
  "Photography",
  "Lifestyle",
  "Career",
  "Other"
];

const SKILL_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

const SESSION_STATUS = {
  REQUESTED: "REQUESTED",
  ACCEPTED: "ACCEPTED",
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  DISPUTED: "DISPUTED"
};

const TRANSACTION_TYPES = {
  EARN: "EARN",
  SPEND: "SPEND",
  BONUS: "BONUS",
  REFUND: "REFUND",
  PENALTY: "PENALTY"
};

const LEARNING_MODES = {
  ONLINE: "Online",
  IN_PERSON: "In person",
  BOTH: "Both"
};

const INITIAL_TIME_CREDITS = 2.0;

const MATCH_WEIGHTS = {
  SKILL_COMPATIBILITY: 0.40,
  AVAILABILITY: 0.20,
  LOCATION: 0.10,
  LEARNING_PREFERENCE: 0.10,
  SKILL_LEVEL: 0.10,
  RATING: 0.10
};

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const BADGES_LIST = [
  { code: "FIRST_SWAP", name: "First Swap", description: "Completed your first skill swap session", icon: "Sparkles" },
  { code: "TEACH_10", name: "10 Hours Taught", description: "Taught for over 10 hours on SkillSwap", icon: "Award" },
  { code: "TEACH_50", name: "50 Hours Taught", description: "Master mentor! Taught 50+ hours", icon: "Crown" },
  { code: "RELIABLE_TEACHER", name: "Reliable Teacher", description: "Maintained 100% session completion rate", icon: "ShieldCheck" },
  { code: "TOP_MENTOR", name: "Top Mentor", description: "Achieved 4.9+ star rating across 15+ reviews", icon: "Star" },
  { code: "FAST_RESPONDER", name: "Fast Responder", description: "Responds to swap requests within 1 hour", icon: "Zap" },
  { code: "COMMUNITY_BUILDER", name: "Community Builder", description: "Exchanged skills with 10+ unique partners", icon: "Users" },
  { code: "VERIFIED_SKILL", name: "Verified Skill", description: "Has skill credentials verified by admin", icon: "BadgeCheck" }
];

module.exports = {
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SESSION_STATUS,
  TRANSACTION_TYPES,
  LEARNING_MODES,
  INITIAL_TIME_CREDITS,
  MATCH_WEIGHTS,
  DAYS_OF_WEEK,
  BADGES_LIST
};
