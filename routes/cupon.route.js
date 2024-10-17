const express = require("express");
const {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon,
} = require("../controllers/cupon.controller");
const router = express.Router();

// Admin routes
router.post("/create", createCoupon); // Admin can create coupons
router.get("/", getCoupons); // Admin can list all coupons
router.delete("/:id", deleteCoupon); // Admin can delete a coupon

// User route to apply a coupon
router.post("/apply", applyCoupon);

module.exports = router;
