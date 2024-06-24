const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.DB_URL)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
