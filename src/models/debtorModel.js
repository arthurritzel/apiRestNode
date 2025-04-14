import mongoose from 'mongoose';

const productItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const debtorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // Adicionado aqui
  products: [productItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "overdue"],
    default: "pending"
  },
}, {
  versionKey: false,
  timestamps: true
});

const Debtor = mongoose.model("Debtor", debtorSchema);

export default Debtor;
