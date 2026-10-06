const express = require("express");

const {
  verifyDocument,
  getVerificationHistory,
} = require("../controllers/verificationController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// PUBLIC DOCUMENT VERIFICATION
// GET /api/documents/verify/:verificationId
// ========================================
router.get(
  "/verify/:verificationId",
  verifyDocument
);

// ========================================
// ADMIN VERIFICATION HISTORY
// GET /api/documents/history/all
// ========================================
router.get(
  "/history/all",
  protect,
  adminOnly,
  getVerificationHistory
);

module.exports = router;