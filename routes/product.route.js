const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../middlewares//cloudinary.middleware");
const upload = multer({ storage });
const {
  getAllProducts,
  getAProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  addReview,
} = require("../controllers/product.controller");
const { isSuperAdmin } = require("../middlewares/superAdmin.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");
const {
  isAdminOrSuperAdmin,
} = require("../middlewares/adminORsuperAdmin.middleware");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const Product = require("../models/product.model");

router.get("/", getAllProducts);
router.get("/categories", getAllCategories);
router.get("/:id", getAProduct);
router.post("/", isAuthenticated, isAdminOrSuperAdmin, createProduct);
router.put("/:id", isAuthenticated, isAdminOrSuperAdmin, updateProduct); // add this route
router.delete("/:id", isAuthenticated, isAdminOrSuperAdmin, deleteProduct); // add this route
router.post("/:id/reviews", isAuthenticated, addReview);
router.post(
  "/upload",
  isAuthenticated,
  isAdminOrSuperAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      // No need to find a product here
      // Since you're creating a new product

      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: req.file.path, // Return the Cloudinary URL
      });
    } catch (error) {
      console.error("Failed to upload image", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

module.exports = router;
