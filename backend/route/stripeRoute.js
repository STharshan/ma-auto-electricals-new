import express from "express";
import { createCheckoutSession, checkoutSuccess, stripeWebhook } from "../controllers/orderController.js";
import { checkoutRateLimiter } from "../middleware/rateLimiters.js";

const stripeRouter = express.Router();

stripeRouter.post("/create-checkout-session", checkoutRateLimiter, createCheckoutSession);
stripeRouter.get("/checkout-success", checkoutSuccess);

// ⚠️ Webhook route - must use raw body (express.raw), NOT express.json()
stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default stripeRouter;
