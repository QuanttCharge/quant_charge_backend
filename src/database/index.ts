import mongoose from 'mongoose';
import logger from '../common/utils/logger.js';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in .env');

  try {
    await mongoose.connect(uri);
    logger.info('MongoDB connected');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('authentication failed') || message.includes('bad auth')) {
      throw new Error('MongoDB authentication failed — check username and password in MONGODB_URI');
    }
    if (message.includes('ENOTFOUND') || message.includes('querySrv')) {
      throw new Error('MongoDB cluster not found — check the hostname in MONGODB_URI');
    }
    if (message.includes('ECONNREFUSED') || message.includes('timed out')) {
      throw new Error('MongoDB connection refused — check Network Access in Atlas (IP whitelist)');
    }
    throw new Error(`MongoDB connection failed: ${message}`);
  }
};
