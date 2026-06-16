import express from "express";
import OrderModel from "../models/orderModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// ── ADMIN: Get all orders ─────────────────────────────────────────
orderRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ── ADMIN: Cancel order ───────────────────────────────────────────
orderRouter.post("/:orderId/admin-cancel", authMiddleware, async (req, res) => {
  const { cancelNote } = req.body;
  try {
    const order = await OrderModel.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    if (order.isCancelled) return res.json({ success: false, message: "Order already cancelled" });

    // Save original payment status so restore can bring it back
    order.originalPaymentStatus = order.payment_status;
    order.isCancelled    = true;
    order.cancelNote     = cancelNote?.trim() || "Cancelled by admin";
    order.cancelledAt    = new Date();
    order.payment_status = "cancelled";
    await order.save();

    await sendEmail({
      to: order.email,
      subject: `Your Order Has Been Cancelled — #${order.orderId}`,
      html: cancelEmailHtml(order),
    });

    res.json({ success: true, message: "Order cancelled. Customer notified." });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ── ADMIN: Restore cancelled order ───────────────────────────────
orderRouter.post("/:orderId/admin-restore", authMiddleware, async (req, res) => {
  try {
    const order = await OrderModel.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    if (!order.isCancelled) return res.json({ success: false, message: "Order is not cancelled" });

    order.isCancelled    = false;
    order.payment_status = order.originalPaymentStatus || "paid";
    order.cancelNote     = "";
    order.cancelledAt    = undefined;
    order.originalPaymentStatus = undefined;
    await order.save();

    await sendEmail({
      to: order.email,
      subject: `Your Order Has Been Restored — #${order.orderId}`,
      html: restoreEmailHtml(order),
    });

    res.json({ success: true, message: "Order restored. Customer notified." });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ── Get single order by stripeSessionId (SuccessPage) ────────────
orderRouter.get("/:sessionId", async (req, res) => {
  try {
    const order = await OrderModel.findOne({ stripeSessionId: req.params.sessionId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ── EMAIL TEMPLATES ───────────────────────────────────────────────
function cancelEmailHtml(order) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#c0392b,#e74c3c);padding:32px 40px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;">Order Cancelled</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">MA Auto Electrics</p>
  </td></tr>
  <tr><td style="padding:28px 40px;">
    <p style="color:#333;font-size:15px;">Hi <strong>${order.user}</strong>,</p>
    <p style="color:#555;font-size:14px;">Your order <strong>#${order.orderId}</strong> has been cancelled.</p>
    <table width="100%" style="background:#f9f9f9;border-radius:8px;padding:14px;border:1px solid #eee;margin:16px 0;font-size:13px;">
      <tr><td style="color:#888;padding:4px 0;width:130px;">Order ID</td><td style="color:#333;font-weight:600;">#${order.orderId}</td></tr>
      <tr><td style="color:#888;padding:4px 0;">Amount</td><td style="color:#333;">£${Number(order.amount).toFixed(2)}</td></tr>
      ${order.cancelNote ? `<tr><td style="color:#888;padding:4px 0;">Reason</td><td style="color:#333;">${order.cancelNote}</td></tr>` : ""}
    </table>
    <p style="color:#888;font-size:12px;">Questions? Email us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:#317F21;">${process.env.ADMIN_EMAIL}</a></p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

function restoreEmailHtml(order) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#317F21,#4CAF50);padding:32px 40px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;">Order Restored</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">MA Auto Electrics</p>
  </td></tr>
  <tr><td style="padding:28px 40px;">
    <p style="color:#333;font-size:15px;">Hi <strong>${order.user}</strong>,</p>
    <p style="color:#555;font-size:14px;">Great news! Your order <strong>#${order.orderId}</strong> has been restored and is now active again.</p>
    <table width="100%" style="background:#f9f9f9;border-radius:8px;padding:14px;border:1px solid #eee;margin:16px 0;font-size:13px;">
      <tr><td style="color:#888;padding:4px 0;width:130px;">Order ID</td><td style="color:#333;font-weight:600;">#${order.orderId}</td></tr>
      <tr><td style="color:#888;padding:4px 0;">Amount</td><td style="color:#317F21;font-weight:700;">£${Number(order.amount).toFixed(2)}</td></tr>
      <tr><td style="color:#888;padding:4px 0;">Status</td><td style="color:#317F21;font-weight:600;">Active</td></tr>
    </table>
    <p style="color:#888;font-size:12px;">Questions? Email us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:#317F21;">${process.env.ADMIN_EMAIL}</a></p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

export default orderRouter;