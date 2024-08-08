const User = require("../models/user.model");
const { createToken } = require("../helpers/token.helper");
const { default: mongoose } = require("mongoose");
const Order = require("../models/order.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .populate("orders")
      .exec();

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const user = req.body;
    const query = { email: user.email };
    const existingUser = await User.findOne(query);

    if (existingUser) {
      const token = createToken(existingUser._id);
      return res.status(200).json({ result: existingUser, token });
    }
    const result = await User.create(user);
    const token = createToken(result._id);
    res.status(200).json({ result, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAnUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { _id } = req.user;

    if (!mongoose.Types.ObjectId.isValid(uid)) {
      throw new Error("User not found.");
    }

    if (uid !== _id.toString()) {
      throw new Error("Unauthorized access.");
    }

    const user = await User.findById(uid).populate("orders").exec();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const createUserWithOrder = async (req, res) => {
  try {
    const { uid } = req.params;
    const { orderId } = req.body;

    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.orders.push(orderId);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { uid } = req.params;

    // Find all orders for the user
    const orders = await Order.find({ userId: uid })
      .sort({ createdAt: -1 })
      .populate({
        path: "products.productId",
        model: "Product",
      })
      .exec();

    if (!orders) {
      return res.status(404).json({ error: "Orders not found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAnUser,
  registerUser,
  createUserWithOrder,
  getUserOrders,
};
