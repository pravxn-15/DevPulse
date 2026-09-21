const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devpulse';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000 // Quick timeout if MongoDB is offline
    });
    isConnected = true;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️ MongoDB connection attempt failed: ${err.message}`);
    console.warn(`ℹ️ Operating with hybrid database fallback mode.`);
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
