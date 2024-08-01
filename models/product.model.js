const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  title: { type: String },
  price: { type: Number },
  imageUrl: { type: String },
  category: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
