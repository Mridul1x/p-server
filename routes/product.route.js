const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getAProduct,
  createProduct,
} = require("../controllers/product.controller");
const { isAdmin } = require("../middlewares/admin.middleware");
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.get("/", getAllProducts);
router.get("/:id", getAProduct);
router.post("/", createProduct);

module.exports = router;
