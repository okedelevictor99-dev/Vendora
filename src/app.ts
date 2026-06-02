import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import hpp from 'hpp';

import { env } from './config/env';
import { globalRateLimiter } from './middlewares/rateLimit.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { logger } from './config/logger.config';
import authRoutes from "./modules/auth/auth.routes"
import userRoutes from "./modules/user/user.routes"
import productRoutes from "./modules/products/product.routes"
import adminauthRoutes from "./modules/admin/auth/auth.routes"
import cartRoutes from "./modules/cart/cart.routes"
import cookieParser from 'cookie-parser';


const app = express();

// ----------------------
// SECURITY HEADERS
// ----------------------
app.use(helmet());

// ----------------------
// CORS
// ----------------------
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// ----------------------
// BODY PARSING
// ----------------------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// ----------------------
// COMPRESSION
// ----------------------
app.use(compression());

// ----------------------
// HTTP PARAMETER POLLUTION PROTECTION
// ----------------------
app.use(hpp());

app.use(cookieParser());

// ----------------------
// GLOBAL RATE LIMITER
// ----------------------
app.use(globalRateLimiter);

// ----------------------
// REQUEST LOGGER
// ----------------------
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/api/auth", authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/product", productRoutes)
app.use("/api/admin",adminauthRoutes)
app.use("/api/cart", cartRoutes)


// ----------------------
// HEALTH CHECK
// ----------------------
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy 🚀',
  });
})
// ----------------------
// 404 HANDLER
// ----------------------
app.use((req, _res, next) => {
  next(new Error(`Route not found: ${req.originalUrl}`));
});

// ----------------------
// GLOBAL ERROR HANDLER
// ----------------------
app.use(errorMiddleware);

export default app;