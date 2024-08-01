const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getAProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { isAdmin } = require("../middlewares/admin.middleware");
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.get("/", getAllProducts);
router.get("/:id", getAProduct);
router.post("/", isAuthenticated, isAdmin, createProduct);
router.put("/:id", isAuthenticated, isAdmin, updateProduct); // add this route
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct); // add this route

module.exports = router;
