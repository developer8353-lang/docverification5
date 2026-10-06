const express = require("express");

const {
  verifyDocument,
  getVerificationHistory,
} = require("../controllers/verificationController");

const {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ==========================================
// UPLOAD DOCUMENT
// POST /api/documents/upload
// ==========================================
router.post(
  "/upload",
  protect,
  adminOnly,
  upload.single("document"),
  uploadDocument
);


// ==========================================
// PUBLIC DOCUMENT VERIFICATION
// GET /api/documents/verify/:verificationId
// ==========================================
router.get(
  "/verify/:verificationId",
  verifyDocument
);


// ==========================================
// ADMIN VERIFICATION HISTORY
// GET /api/documents/history/all
// ==========================================
router.get(
  "/history/all",
  protect,
  adminOnly,
  getVerificationHistory
);


// ==========================================
// ADMIN - GET ALL DOCUMENTS
// GET /api/documents/all
// ==========================================
router.get(
  "/all",
  protect,
  adminOnly,
  getAllDocuments
);


// ==========================================
// ADMIN - GET SINGLE DOCUMENT
// GET /api/documents/:id
// ==========================================
router.get(
  "/:id",
  protect,
  adminOnly,
  getDocumentById
);


// ==========================================
// ADMIN - UPDATE DOCUMENT
// PUT /api/documents/:id
// ==========================================
router.put(
  "/:id",
  protect,
  adminOnly,
  updateDocument
);


// ==========================================
// ADMIN - DELETE DOCUMENT
// DELETE /api/documents/:id
// ==========================================
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteDocument
);


module.exports = router;