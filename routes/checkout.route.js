const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  updateOrderStatus,
} = require("../controllers/checkout.controller");

router.post("/", createCheckoutSession);
router.put("/update-status", updateOrderStatus);

module.exports = router;
