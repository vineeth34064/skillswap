const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
    console.log(`[DB] Attempting MongoDB connection to local/provided URI: ${mongoUri || 'mongodb://127.0.0.1:27017/skillswap'}...`);
  } else {
    console.log(`[DB] Connecting to Cloud MongoDB Atlas cluster...`);
  }

  const targetUri = mongoUri || 'mongodb://127.0.0.1:27017/skillswap';

  try {
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[DB] Connected to MongoDB: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[DB] MongoDB connection error: ${err.message}`);
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('127.0.0.1')) {
      console.log(`[DB] Fallback: Trying in-memory database...`);
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri);
        console.log(`[DB] Connected to In-Memory MongoDB Server at ${memUri}`);
      } catch (memErr) {
        console.warn(`[DB] In-Memory fallback skipped (${memErr.message}). Waiting for valid MONGO_URI in environment variables.`);
      }
    }
  }
};

module.exports = connectDB;
