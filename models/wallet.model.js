const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Referencing the User model
    },
    realBalance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Real balance cannot be negative"], // Added validation for non-negative values
    },
    practiceBalance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Practice balance cannot be negative"], // Added validation for non-negative values
    },
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

module.exports = mongoose.model("Wallet", walletSchema);
