import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  images: [{ type: String }],
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, default: uuidv4 },
    stripeSessionId: { type: String, required: true, unique: true },
    user: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    products: [productSchema],
    amount: { type: Number, required: true },
    // "pending" | "paid" | "cancelled"
    payment_status: { type: String, default: "pending" },
    // saved before cancel so restore works
    originalPaymentStatus: { type: String, default: "" },
    // admin cancel fields
    isCancelled: { type: Boolean, default: false },
    cancelNote: { type: String, default: "" },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;