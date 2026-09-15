import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";
import cookieParser from "cookie-parser";

import { env } from "./configs/env";
import { globalRateLimiter } from "@/middlewares/rateLimit.middleware";
import { errorMiddleware } from "@/middlewares/error.middleware";
import { logger } from "./configs/logger.config";

import authRoutes from "@/modules/client/auth/auth.routes";
import userRoutes from "@/modules/client/user/user.routes";
import productRoutes from "@/modules/client/products/product.routes";
import adminauthRoutes from "@/modules/admin/auth/auth.routes";
import cartRoutes from "@/modules/client/cart/cart.routes";
import orderRoutes from "@/modules/client/order/order.routes";
import adminOrderRoues from "@/modules/admin/order/order.routes"
import adminProductRoutes from "@/modules/admin/product/product.routes"
import adminDashboardRoutes from "@/modules/admin/dashboard/dashboard.route";
import adminUserRoutes from "@/modules/admin/user/user.routes"
import adminAccountRoutes from "@/modules/admin/account/account.route"
import { requestLogger } from "@/middlewares/requestloggermiddleware";
import { initCrons } from "./crons/cron.index";
import webhookRoutes from "@/modules/client/webhook/webhook.route";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use("/api/webhook", requestLogger, webhookRoutes);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(compression());
app.use(hpp());
app.use(cookieParser());
app.use(globalRateLimiter);

app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(requestLogger);

initCrons();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);



app.use("/api/admin/order", adminOrderRoues)
app.use("/api/admin/product", adminProductRoutes)
app.use("/api/admin", adminauthRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/user", adminUserRoutes)
app.use("/api/admin/account", adminAccountRoutes)

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy 🚀" });
});

app.use((req, _res, next) => {
  next(new Error(`Route not found: ${req.originalUrl}`));
});

app.use(errorMiddleware);

export default app;