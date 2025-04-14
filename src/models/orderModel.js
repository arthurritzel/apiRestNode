import mongoose from "mongoose";
import { v4 } from "uuid";

const productItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [productItemSchema],
  status: { type: String, enum: ["pending", "waitPayment", "completed", "cancelled"], default: "pending" },
  token: { type: String, unique: true, default: v4()},
}, {
  versionKey: false,
  timestamps: true,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;