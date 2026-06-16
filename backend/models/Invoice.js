import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
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
  }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);
export default Invoice;