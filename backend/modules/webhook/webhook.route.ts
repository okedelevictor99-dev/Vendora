import { Router } from "express";
import { paystackWebhookController } from "./webhook.controller";
import express from "express"

const router = Router();

router.post(
  "/",
  express.raw({ type: "*/*" }),
  (req, _res, next) => {
    (req as any).rawBody = req.body; 
    next();
  },
  paystackWebhookController
);
export default router;