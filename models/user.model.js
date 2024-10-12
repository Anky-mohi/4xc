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
    fullname: {
      type: String,
      default: null, // Optional field
    },
    residence: {
      type: String,
      default: "in",
    },
    password: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      default: null, // Optional field
    },
    facebookId: {
      type: String,
      default: null, // Optional field
    },
    role: {
      type: String,
      enum: ["trader", "admin"],
      default: "trader",
    },
    loginid: {
      type: String,
      default: null, // Optional field
    },
    balance: {
      type: Number,
      default: 0, // Default balance to 0
    },
    account_type: {
      type: String,
      default: null, // Optional field
    },
    account_category: {
      type: String,
      default: null, // Optional field
    },
    is_virtual: {
      type: Number,
      default: 0, // Default to non-virtual accounts
    },
    currency: {
      type: String,
      default: null, // Optional field
    },
    country: {
      type: String,
      default: null, // Optional field
    },
    preferred_language: {
      type: String,
      default: "en", // Default to English
    },
    user_id: {
      type: String,
      default: null, // Optional field
    },
    isBlacklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook for hashing the password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Add a method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
