const Coupon = require("../models/cupon.model");

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { name, description, discount, limit, validity } = req.body;

    const coupon = new Coupon({
      name,
      description,
      discount,
      limit,
      validity,
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply a coupon
exports.applyCoupon = async (req, res) => {
  try {
    const { name } = req.body;
    const coupon = await Coupon.findOne({ name });

    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    if (coupon.used >= coupon.limit)
      return res.status(400).json({ message: "Coupon limit reached" });
    if (new Date(coupon.validity) < new Date())
      return res.status(400).json({ message: "Coupon has expired" });
    // Apply discount
    res.status(200).json({
      discount: coupon.discount,
      message: `Coupon applied successfully. You get ${coupon.discount}% off.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
