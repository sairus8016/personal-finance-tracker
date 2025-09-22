// src/db.ts
import mongoose from 'mongoose';

export const connectToDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://bwbates_db_user:9NfmO9ASJarwWwRN@clusterbwb.seeb127.mongodb.net/personalFinance?retryWrites=true&w=majority&appName=ClusterBWB');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
