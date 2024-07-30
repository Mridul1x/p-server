const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  amountTotal: { type: mongoose.Types.Decimal128, required: true },
  amountShipping: { type: mongoose.Types.Decimal128, required: true },
  status: { type: String, default: "pending" },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  transactionID: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ["Cash On Delivery", "Online Payment"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
