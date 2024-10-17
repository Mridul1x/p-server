const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    discount: { type: Number, required: true }, // percentage, e.g., 10 for 10%
    limit: { type: Number, required: true }, // Max number of uses
    used: { type: Number, default: 0 }, // How many times it has been used
    validity: { type: Date, required: true }, // Expiry date
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
