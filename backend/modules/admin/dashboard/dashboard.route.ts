import { Router } from "express";
import { admin } from "@/middlewares/admin.middleware";
import { getDashboardStats } from "./dashboard.controller";

const router = Router();

router.get("/stats", admin, getDashboardStats);

export default router;