import app from './app';
import mongoose from 'mongoose';
import { connectDB } from './configs/db';
import { logger } from './configs/logger.config';
import { env } from './configs/env';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

    const shutdown = (signal: string) => {
      logger.warn(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err: any) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: any) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();