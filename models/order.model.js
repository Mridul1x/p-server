const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  amountTotal: { type: mongoose.Types.Decimal128, required: true },
  amountShipping: { type: mongoose.Types.Decimal128, required: true },
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
    required: true,
  },
  mobile: { type: Number, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
