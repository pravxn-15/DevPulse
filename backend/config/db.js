const mongoose = require('mongoose');

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || 'mongodb://localhost:27017/devpulse_blog';

  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`⚠️ MongoDB Connection Info: Running in Local Fallback Mode (${err.message})`);
  }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;
