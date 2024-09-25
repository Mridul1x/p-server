const express = require("express");
const User = require("../models/user.model");
const multer = require("multer");
const { storage } = require("../middlewares//cloudinary.middleware");
const {
  getAllUsers,
  getAnUser,
  registerUser,
  createUserWithOrder,
  getUserOrders,
  updateUser,
} = require("../controllers/user.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");

const upload = multer({ storage });

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllUsers);
router.get("/:uid", getAnUser);
router.post("/", registerUser);
router.put("/:uid/orders", isAuthenticated, createUserWithOrder);
router.put("/:uid", isAuthenticated, updateUser);
router.get("/:uid/orders", isAuthenticated, getUserOrders);

router.post(
  "/upload",
  isAuthenticated,
  upload.single("image"), // Ensures the image upload is handled
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id); // Finds the logged-in user
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Save the uploaded image URL to the user's profile
      user.photoURL = req.file.path; // Cloudinary file path
      await user.save();

      res.status(200).json({
        message: "Image uploaded successfully",
        photoURL: user.photoURL, // Return updated photo URL
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

module.exports = router;
