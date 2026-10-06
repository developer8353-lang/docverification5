const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    verificationId: {
      type: String,
      required: true,
      unique: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    documentType: {
      type: String,
      required: true,
      trim: true,
    },

    // IMPORTANT:
    // Frontend me bhi isi naam se field aa rahi hai
    issuingOrganization: {
      type: String,
      default: "jejroe",
      trim: true,
    },

    issueDate: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Verified", "Pending", "Rejected"],
      default: "Verified",
    },

    fileName: {
      type: String,
      default: "",
    },

    filePath: {
      type: String,
      default: "",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Document",
  documentSchema
);