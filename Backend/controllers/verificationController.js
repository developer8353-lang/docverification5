const path = require("path");
const Document = require("../models/Document");

// ==========================================
// VERIFY DOCUMENT
// ==========================================

const verifyDocument = async (req, res) => {
  try {
    const { verificationId } = req.params;

    console.log("Verification ID:", verificationId);

    if (!verificationId) {
      return res.status(400).json({
        success: false,
        message: "Verification ID is required",
      });
    }

    const document = await Document.findOne({
      verificationId: verificationId.trim(),
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ==========================================
    // CREATE IMAGE / FILE URL
    // ==========================================

    let fileUrl = null;

    if (document.filePath) {
      const fileName = path.basename(document.filePath);

      fileUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${fileName}`;
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message: "Document verified successfully",

      document: {
        _id: document._id,

        verificationId: document.verificationId,

        ownerName: document.ownerName,

        documentType: document.documentType,

        issuingOrganization:
          document.issuingOrganization,

        issueDate: document.issueDate,

        fileName: document.fileName,

        filePath: document.filePath,

        fileUrl: fileUrl,

        status: document.status,

        verificationDate: document.updatedAt,

        createdAt: document.createdAt,
      },
    });

  } catch (error) {
    console.error(
      "Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// ==========================================
// VERIFICATION HISTORY
// ==========================================

const getVerificationHistory = async (
  req,
  res
) => {
  try {
    const documents = await Document.find().sort({
      createdAt: -1,
    });

    const updatedDocuments = documents.map(
      (document) => {

        let fileUrl = null;

        if (document.filePath) {
          const fileName = path.basename(
            document.filePath
          );

          fileUrl = `${req.protocol}://${req.get(
            "host"
          )}/uploads/${fileName}`;
        }

        return {
          ...document.toObject(),
          fileUrl,
        };
      }
    );

    return res.status(200).json({
      success: true,

      count: updatedDocuments.length,

      documents: updatedDocuments,
    });

  } catch (error) {

    console.error(
      "History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to get verification history",
      error: error.message,
    });
  }
};


module.exports = {
  verifyDocument,
  getVerificationHistory,
};