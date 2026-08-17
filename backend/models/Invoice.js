import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },
    serviceName: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null
    }
  },
  { timestamps: true }
);

const Invoice = mongoose.model('Invoice', InvoiceSchema);
export default Invoice;
