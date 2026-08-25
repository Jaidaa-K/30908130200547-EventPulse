const dns = require('dns');

dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
  }

  try {
    await connectionPromise;
    console.log('MongoDB connected');
  } catch (error) {
    connectionPromise = null;
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;