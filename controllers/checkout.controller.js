const { mongoose } = require("mongoose");
const Order = require("../models/order.model");

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
    } = req.body;

    const newOrder = new Order({
      amountTotal,
      amountShipping,
      status,
      mobile,
      address,
      userId,
      products,
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

    if (!["pending", "approved"].includes(status)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  updateOrderStatus,
};
