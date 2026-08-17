const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const User = require('./models/User');
const Skill = require('./models/Skill');
const UserSkill = require('./models/UserSkill');
const Session = require('./models/Session');
const CreditTransaction = require('./models/CreditTransaction');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');
const Review = require('./models/Review');
const Badge = require('./models/Badge');
const UserBadge = require('./models/UserBadge');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing database collections...');

    await User.deleteMany({});
    await Skill.deleteMany({});
    await UserSkill.deleteMany({});
    await Session.deleteMany({});
    await CreditTransaction.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Review.deleteMany({});
    await Badge.deleteMany({});
    await UserBadge.deleteMany({});

    console.log('[Seed] Inserting Badges...');
    const badges = await Badge.insertMany([
      { code: 'FIRST_SWAP', name: 'First Swap', description: 'Completed your first skill swap session', icon: 'Sparkles' },
      { code: 'TEACH_10', name: '10 Hours Taught', description: 'Taught for over 10 hours on SkillSwap', icon: 'Award' },
      { code: 'TEACH_50', name: '50 Hours Taught', description: 'Master mentor! Taught 50+ hours', icon: 'Crown' },
      { code: 'RELIABLE_TEACHER', name: 'Reliable Teacher', description: 'Maintained 100% session completion rate', icon: 'ShieldCheck' },
      { code: 'TOP_MENTOR', name: 'Top Mentor', description: 'Achieved 4.9+ star rating across 15+ reviews', icon: 'Star' }
    ]);

    console.log('[Seed] Inserting Core Skills...');
    const skillsList = [
      { name: 'C++', category: 'Technology', description: 'System programming, OOP, data structures, & memory management', difficulty: 'Advanced', icon: 'Code' },
      { name: 'Python', category: 'Technology', description: 'Data analysis, scripting, machine learning, and automation', difficulty: 'Intermediate', icon: 'Terminal' },
      { name: 'React', category: 'Technology', description: 'Building modern dynamic web frontend applications', difficulty: 'Intermediate', icon: 'Layout' },
      { name: 'Node.js', category: 'Technology', description: 'Backend development, REST APIs, and event-driven Node runtime', difficulty: 'Intermediate', icon: 'Server' },
      { name: 'UI/UX Design', category: 'Design', description: 'User interface design, Figma wireframing, and user research', difficulty: 'Intermediate', icon: 'Figma' },
      { name: 'Photoshop', category: 'Design', description: 'Photo editing, raster graphics, composite image design', difficulty: 'Intermediate', icon: 'Image' },
      { name: 'Video Editing', category: 'Design', description: 'Premiere Pro, DaVinci Resolve color grading & timeline editing', difficulty: 'Intermediate', icon: 'Video' },
      { name: 'Guitar', category: 'Music', description: 'Acoustic & electric guitar chords, fingerpicking, and music theory', difficulty: 'Beginner', icon: 'Music' },
      { name: 'Spanish', category: 'Languages', description: 'Conversational Spanish grammar, vocabulary, and accent coaching', difficulty: 'Intermediate', icon: 'Languages' },
      { name: 'Public Speaking', category: 'Career', description: 'Speech structuring, vocal modulation, and stage confidence', difficulty: 'Intermediate', icon: 'Mic' },
      { name: 'Cooking', category: 'Cooking', description: 'Gourmet home cooking, knife skills, and pasta from scratch', difficulty: 'Beginner', icon: 'Utensils' },
      { name: 'Digital Marketing', category: 'Business', description: 'SEO optimization, content strategy, and social media ads', difficulty: 'Intermediate', icon: 'TrendingUp' }
    ];

    const insertedSkills = await Skill.insertMany(skillsList);
    const skillMap = {};
    insertedSkills.forEach(s => { skillMap[s.name] = s._id; });

    console.log('[Seed] Inserting Demo Users...');
    const passwordHash = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        name: 'Vineet Kumar',
        username: 'vineet',
        email: 'vineet@skillswap.dev',
        passwordHash,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        bio: 'Full Stack Engineer with 4 years experience. Love C++ and React. Looking to master UI/UX and Video Editing!',
        city: 'New York',
        location: { type: 'Point', coordinates: [-73.985130, 40.748817] }, // NYC Midtown
        timeCredits: 4.5,
        rating: 4.9,
        trustScore: 94,
        teachingHours: 12,
        learningHours: 6,
        completedSessions: 8,
        availability: [{ day: 'Saturday', startTime: '10:00', endTime: '16:00' }, { day: 'Sunday', startTime: '14:00', endTime: '18:00' }]
      },
      {
        name: 'Sarah Jenkins',
        username: 'sarah_ux',
        email: 'sarah@skillswap.dev',
        passwordHash,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
        bio: 'Senior Product Designer at a fintech startup. 6+ years in Figma & Photoshop. Passionate about learning C++ algorithms!',
        city: 'New York',
        location: { type: 'Point', coordinates: [-73.971200, 40.758000] }, // 2.1 km away
        timeCredits: 8.0,
        rating: 5.0,
        trustScore: 98,
        teachingHours: 24,
        learningHours: 10,
        completedSessions: 16,
        availability: [{ day: 'Saturday', startTime: '09:00', endTime: '14:00' }, { day: 'Wednesday', startTime: '18:00', endTime: '21:00' }]
      },
      {
        name: 'Alex Rivera',
        username: 'alex_py',
        email: 'alex@skillswap.dev',
        passwordHash,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        bio: 'Data Scientist. Love teaching Python scripting and Machine Learning models. Want to learn acoustic guitar!',
        city: 'New York',
        location: { type: 'Point', coordinates: [-73.991100, 40.735000] },
        timeCredits: 3.0,
        rating: 4.8,
        trustScore: 90,
        teachingHours: 8,
        learningHours: 4,
        completedSessions: 5,
        availability: [{ day: 'Monday', startTime: '19:00', endTime: '21:00' }, { day: 'Sunday', startTime: '11:00', endTime: '15:00' }]
      },
      {
        name: 'Elena Rostova',
        username: 'elena_lang',
        email: 'elena@skillswap.dev',
        passwordHash,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
        bio: 'Bilingual native Spanish speaker & linguist. Happy to help with conversational Spanish in exchange for Web Dev help!',
        city: 'New York',
        location: { type: 'Point', coordinates: [-73.962000, 40.773000] },
        timeCredits: 5.5,
        rating: 4.9,
        trustScore: 92,
        teachingHours: 15,
        learningHours: 8,
        completedSessions: 11
      },
      {
        name: 'Admin Supervisor',
        username: 'admin',
        email: 'admin@skillswap.dev',
        passwordHash,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
        bio: 'SkillSwap Platform Administrator',
        city: 'New York',
        isAdmin: true,
        timeCredits: 100.0,
        trustScore: 100
      }
    ]);

    const vineet = users[0];
    const sarah = users[1];
    const alex = users[2];
    const elena = users[3];

    console.log('[Seed] Linking User Skills...');
    await UserSkill.insertMany([
      // Vineet teaches C++ and React, wants UI/UX and Video Editing
      { userId: vineet._id, skillId: skillMap['C++'], type: 'TEACH', level: 'Advanced', experienceYears: 4 },
      { userId: vineet._id, skillId: skillMap['React'], type: 'TEACH', level: 'Advanced', experienceYears: 3 },
      { userId: vineet._id, skillId: skillMap['UI/UX Design'], type: 'LEARN', level: 'Beginner' },
      { userId: vineet._id, skillId: skillMap['Video Editing'], type: 'LEARN', level: 'Beginner' },

      // Sarah teaches UI/UX and Photoshop, wants C++ and Python
      { userId: sarah._id, skillId: skillMap['UI/UX Design'], type: 'TEACH', level: 'Expert', experienceYears: 6 },
      { userId: sarah._id, skillId: skillMap['Photoshop'], type: 'TEACH', level: 'Expert', experienceYears: 5 },
      { userId: sarah._id, skillId: skillMap['C++'], type: 'LEARN', level: 'Beginner' },
      { userId: sarah._id, skillId: skillMap['Python'], type: 'LEARN', level: 'Beginner' },

      // Alex teaches Python, wants Guitar
      { userId: alex._id, skillId: skillMap['Python'], type: 'TEACH', level: 'Expert', experienceYears: 5 },
      { userId: alex._id, skillId: skillMap['Guitar'], type: 'LEARN', level: 'Beginner' },

      // Elena teaches Spanish, wants React
      { userId: elena._id, skillId: skillMap['Spanish'], type: 'TEACH', level: 'Expert', experienceYears: 10 },
      { userId: elena._id, skillId: skillMap['React'], type: 'LEARN', level: 'Beginner' }
    ]);

    console.log('[Seed] Creating Sample Sessions & Transactions...');
    const completedSession = await Session.create({
      hostId: vineet._id, // Teacher
      participantId: sarah._id, // Learner
      skillId: skillMap['C++'],
      skillName: 'C++',
      durationHours: 1.0,
      scheduledAt: new Date(Date.now() - 86400000 * 2),
      mode: 'Online',
      meetingLink: 'https://meet.google.com/skillswap-cpp-demo',
      notes: 'Intro to pointers, references, and STL vectors in C++',
      status: 'COMPLETED',
      hostConfirmed: true,
      participantConfirmed: true,
      creditTransferred: true
    });

    await CreditTransaction.create({
      userId: sarah._id,
      type: 'SPEND',
      amount: 1.0,
      balanceAfter: 8.0,
      reason: 'Completed session: Learned C++',
      sessionId: completedSession._id,
      relatedUserId: vineet._id
    });

    await CreditTransaction.create({
      userId: vineet._id,
      type: 'EARN',
      amount: 1.0,
      balanceAfter: 4.5,
      reason: 'Completed session: Taught C++',
      sessionId: completedSession._id,
      relatedUserId: sarah._id
    });

    // Upcoming session
    await Session.create({
      hostId: sarah._id, // Teacher
      participantId: vineet._id, // Learner
      skillId: skillMap['UI/UX Design'],
      skillName: 'UI/UX Design',
      durationHours: 1.0,
      scheduledAt: new Date(Date.now() + 86400000 * 1),
      mode: 'Online',
      meetingLink: 'https://meet.google.com/skillswap-uiux-demo',
      notes: 'Figma auto-layout and component design token walkthrough',
      status: 'ACCEPTED'
    });

    console.log('[Seed] Adding Sample Reviews...');
    await Review.create({
      sessionId: completedSession._id,
      reviewerId: sarah._id,
      targetUserId: vineet._id,
      rating: 5,
      communication: 5,
      teachingQuality: 5,
      knowledge: 5,
      reliability: 5,
      comment: 'Vineet is an exceptional C++ tutor! He explained complex memory references and pointer arithmetic with super clear visual diagrams. 10/10 recommend!'
    });

    console.log('[Seed] Creating Sample Chat Conversations...');
    const conv = await Conversation.create({
      participants: [vineet._id, sarah._id],
      lastMessage: 'Looking forward to our Figma session tomorrow!',
      lastMessageAt: new Date()
    });

    await Message.create([
      {
        conversationId: conv._id,
        senderId: sarah._id,
        text: 'Hi Vineet! Thanks for the awesome C++ session yesterday!'
      },
      {
        conversationId: conv._id,
        senderId: vineet._id,
        text: 'You are welcome Sarah! Excited for our Figma UI/UX session tomorrow at 10 AM.'
      },
      {
        conversationId: conv._id,
        senderId: sarah._id,
        text: 'Looking forward to our Figma session tomorrow!'
      }
    ]);

    await UserBadge.create({
      userId: vineet._id,
      badgeCode: 'FIRST_SWAP'
    });

    console.log('✅ [Seed] Database seeded successfully with demo users, skills, reciprocal matches, sessions, transactions, and chat!');
    process.exit(0);
  } catch (err) {
    console.error('❌ [Seed] Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
