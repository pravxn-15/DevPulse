const mongoose = require('mongoose');

// Disable command buffering so operations don't freeze for 30s when MongoDB is offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/devpulse';

  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`⚠️ MongoDB Offline: Running in Lightning Fast Fallback Mode (${err.message})`);
  }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
