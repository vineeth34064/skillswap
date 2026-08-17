const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';
    console.log(`[DB] Attempting MongoDB connection to ${mongoUri}...`);
    
    // Attempt standard connection with 3 sec timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[DB] Connected to MongoDB: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[DB] Standard MongoDB connection failed: ${err.message}`);
    console.log(`[DB] Fallback: Initializing Memory MongoDB Server...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log(`[DB] Connected to In-Memory MongoDB Server at ${memUri}`);
    } catch (memErr) {
      console.error(`[DB] In-Memory MongoDB failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
