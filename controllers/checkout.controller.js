const { mongoose } = require("mongoose");
const Order = require("../models/order.model");
const Coupon = require("../models/cupon.model");
const Product = require("../models/product.model");

const createCheckoutSession = async (req, res) => {
  try {
    const {
      amountTotal,
      amountShipping,
      status,
      mobile,
      address,
      userId,
      products,
      transactionID,
      paymentMethod,
      promoCode,
    } = req.body;
    if (promoCode) {
      const coupon = await Coupon.findOne({ name: promoCode });
      if (coupon && coupon.used < coupon.limit) {
        coupon.used += 1;
        await coupon.save();
      }
    }
    const newOrder = new Order({
      amountTotal,
      amountShipping,
      status,
      mobile,
      address,
      userId,
      products,
      transactionID: transactionID, // Make sure this field matches the schema
      paymentMethod,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!["pending", "approved", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update stock only when status changes to "approved"
    if (status === "approved" && order.status !== "approved") {
      for (let item of order.products) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrder = async (req, res) => {
  const { transactionID } = req.params;
  try {
    const order = await Order.findOne({ transactionID });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createCheckoutSession,
  updateOrderStatus,
  getOrder,
};
