import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import cookieParser from "cookie-parser";

import { env } from "./configs/env";
import { globalRateLimiter } from "./middlewares/rateLimit.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger } from "./configs/logger.config";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import productRoutes from "./modules/products/product.routes";
import adminauthRoutes from "./modules/admin/auth/auth.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/order/order.routes";
import { initCrons } from "./crons/cron.index";
import webhookRoutes from "./modules/webhook/webhook.route";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use("/api/webhook", webhookRoutes);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(compression());
app.use(hpp());
app.use(cookieParser());
// app.use(globalRateLimiter);

app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
});

// initCrons();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/admin", adminauthRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy 🚀" });
});

app.use((req, _res, next) => {
  next(new Error(`Route not found: ${req.originalUrl}`));
});

app.use(errorMiddleware);

export default app;