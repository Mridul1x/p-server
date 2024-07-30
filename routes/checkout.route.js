const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  updateOrderStatus,
  getOrder,
} = require("../controllers/checkout.controller");

router.post("/", createCheckoutSession);
router.put("/update-status", updateOrderStatus);
router.get("/:transactionID", getOrder);

module.exports = router;
