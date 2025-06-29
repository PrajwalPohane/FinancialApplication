import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI not set');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri);
    // Optionally, add a success log here if desired
  } catch (error) {
    // ... existing error handling ...
  }
};

export default connectDB;