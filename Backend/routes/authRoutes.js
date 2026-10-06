const express = require("express");

const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/authController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get all users - Admin only
router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

module.exports = router;