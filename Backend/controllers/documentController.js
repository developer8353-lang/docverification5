const Document = require("../models/Document");

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
    console.log(
      "ISSUING ORGANIZATION:",
      issuingOrganization
    );
    console.log("FILE:", req.file);
    console.log("===================================");


    if (!ownerName || !documentType) {
      return res.status(400).json({
        success: false,
        message: "Owner name and document type are required",
      });
    }


    let verificationId;

    // Generate unique Verification ID
    while (true) {
      verificationId = generateVerificationId();

      const existing = await Document.findOne({
        verificationId,
      });

      if (!existing) break;
    }


    const document = await Document.create({
      verificationId,

      ownerName,

      documentType,

      // IMPORTANT
      issuingOrganization: issuingOrganization || "",

      issueDate: issueDate || "",

      status: status || "Verified",

      fileName: req.file
        ? req.file.originalname
        : "",

      filePath: req.file
        ? req.file.path
        : "",

      uploadedBy: req.user._id,
    });


    console.log(
      "SAVED ORGANIZATION:",
      document.issuingOrganization
    );


    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });

  } catch (error) {

    console.error("UPLOAD ERROR:", error);

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