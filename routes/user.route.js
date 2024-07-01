const express = require("express");
const {
  getAllUsers,
  getAnUser,
  registerUser,
  createUserWithOrder,
  getUserOrders,
} = require("../controllers/user.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllUsers);
router.get("/:uid", getAnUser);
router.post("/", registerUser);
router.put("/:uid/orders", isAuthenticated, createUserWithOrder);
router.get("/:uid/orders", isAuthenticated, getUserOrders);

module.exports = router;
