import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger.config';

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.MONGO_URI);

    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};