const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Database connection error: MONGODB_URI environment variable is not defined.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // Quick timeout so server doesn't hang indefinitely
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    console.warn('Backend server remains active. Please ensure your MongoDB Atlas cluster or local MongoDB instance is reachable.');
  }
};

// Listen to mongoose connection events for auto-reconnect reporting
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB runtime connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Waiting for connection...');
});

module.exports = connectDB;

