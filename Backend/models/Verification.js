const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    verificationId: {
      type: String,
      required: true,
    },

    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },

    searchedAt: {
      type: Date,
      default: Date.now,
    },

    ipAddress: {
      type: String,
      default: "",
    },

    result: {
      type: String,
      enum: ["Verified", "Not Found"],
      default: "Not Found",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Verification", verificationSchema);