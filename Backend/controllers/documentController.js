const Document = require("../models/Document");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const generateVerificationId = () => {
  const randomPart = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `DOC-${new Date().getFullYear()}-${randomPart}`;
};


// ===============================
// ADD DOCUMENT
// ===============================
const uploadDocument = async (req, res) => {
  try {
    const {
      ownerName,
      documentType,
      issuingOrganization,
      issueDate,
      status,
    } = req.body;

    console.log("========== UPLOAD DEBUG ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("===================================");

    if (!ownerName || !documentType) {
      return res.status(400).json({
        success: false,
        message: "Owner name and document type are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }


    // ==========================================
    // UPLOAD FILE TO CLOUDINARY
    // ==========================================

    let cloudinaryResult;

    try {
      cloudinaryResult = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "docverify",
          resource_type: "auto",
        }
      );
    } catch (cloudinaryError) {
      console.error(
        "CLOUDINARY UPLOAD ERROR:",
        cloudinaryError
      );

      return res.status(500).json({
        success: false,
        message: "Failed to upload document to Cloudinary",
      });
    }


    // ==========================================
    // DELETE LOCAL FILE
    // ==========================================

    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (deleteError) {
      console.error(
        "LOCAL FILE DELETE ERROR:",
        deleteError
      );
    }


    // ==========================================
    // GENERATE UNIQUE VERIFICATION ID
    // ==========================================

    let verificationId;

    while (true) {
      verificationId = generateVerificationId();

      const existing = await Document.findOne({
        verificationId,
      });

      if (!existing) {
        break;
      }
    }


    // ==========================================
    // SAVE DOCUMENT IN MONGODB
    // ==========================================

    const document = await Document.create({
      verificationId,

      ownerName,

      documentType,

      issuingOrganization:
        issuingOrganization || "",

      issueDate:
        issueDate || "",

      status:
        status || "Verified",

      fileName:
        req.file.originalname,

      filePath:
        cloudinaryResult.secure_url,

      uploadedBy:
        req.user._id,
    });


    console.log(
      "CLOUDINARY URL:",
      cloudinaryResult.secure_url
    );

    console.log(
      "SAVED DOCUMENT:",
      document
    );


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });

  } catch (error) {

    console.error(
      "UPLOAD ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// GET ALL DOCUMENTS
// ===============================
const getAllDocuments = async (req, res) => {
  try {

    const documents = await Document.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: documents.length,
      documents,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// GET SINGLE DOCUMENT
// ===============================
const getDocumentById = async (req, res) => {
  try {

    const document = await Document.findById(
      req.params.id
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// UPDATE DOCUMENT
// ===============================
const updateDocument = async (req, res) => {
  try {

    const document =
      await Document.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      message: "Document updated successfully",
      document,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// DELETE DOCUMENT
// ===============================
const deleteDocument = async (req, res) => {
  try {

    const document =
      await Document.findByIdAndDelete(
        req.params.id
      );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      message: "Document deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
};