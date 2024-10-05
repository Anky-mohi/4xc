const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    residence: {
      type: String,
      default: "in",
    },
    password: {
      type: String,
      required: true,
    },
    googleId: String, // for Google users
    facebookId: String, // for Facebook users
    role: {
      type: String,
      enum: ["trader", "admin"],
      default: "trader",
    },
    derivAccounts: [
      {
        accountId: String,
        token: String,
        currency: String,
      },
    ],
    wallet: {
      balance: { type: Number, default: 1000 }, // Default balance of 1000 practice units
      isReloadAllowed: { type: Boolean, default: true }, // Track if reload is allowed (e.g. once a day)
      lastReloadTime: { type: Date }, // Track the last reload time
    },
    kycStatus: {
      isVerified: { type: Boolean, default: false }, // KYC verification status
      documents: {
        idProof: String,
        addressProof: String,
      },
    },
    // documents: [{
    //   type: String, // URLs of uploaded documents
    // }],
    isBlacklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hashing password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
