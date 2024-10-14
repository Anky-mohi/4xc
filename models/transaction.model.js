const mongoose = require("mongoose");

const transactionHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Wallet",
    },
    paymentFor: {
      type: Number,
      enum: [1, 2], // 1 for credit, 2 for debit
      required: true, // added required to ensure this field is always set
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: Date,
      default: Date.now, // Corrected Date.now usage
    },
    currency: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransactionHistory", transactionHistorySchema);