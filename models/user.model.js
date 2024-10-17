const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const accountSchema = new mongoose.Schema(
  {
    account_category: {
      type: String,
      enum: ['trading'],
      required: true,
    },
    account_type: {
      type: String,
      enum: ['binary'],
      required: true,
    },
    broker: {
      type: String,
      enum: ['CR', 'VRTC'],
      required: true,
    },
    created_at: {
      type: Number, // Assuming it's a Unix timestamp
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    currency_type: {
      type: String,
      enum: ['fiat', 'crypto'],
      required: true,
    },
    is_disabled: {
      type: Boolean,
      default: false,
    },
    is_virtual: {
      type: Boolean,
      required: true,
    },
    landing_company_name: {
      type: String,
      required: true,
    },
    linked_to: {
      type: [String], // Assuming this is an array of strings
      default: [],
    },
    loginid: {
      type: String,
      required: true,
    },
  },
  { _id: false } // Prevents automatic _id generation for subdocuments
);

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
      default: '',
    },
    residence: {
      type: String,
      default: "in",
    },
    password: {
      type: String,
      required: true,
    },
    googleId: String, // For Google users
    facebookId: String, // For Facebook users
    role: {
      type: String,
      enum: ["trader", "admin"],
      default: "trader",
    },
    loginid: String, // Current login ID for the account
    balance: {
      type: Number,
      default: 0,
    },
    account_type: {
      type: String,
      enum: ['binary'],
    },
    account_category: {
      type: String,
      enum: ['trading'],
    },
    is_virtual: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      required: false,
      default: 'USD',
    },
    country: {
      type: String,
      default: 'in',
    },
    preferred_language: {
      type: String,
      default: 'EN',
    },
    user_id: {
      type: Number, // Assuming user_id is a numeric identifier
      required: false,
      unique: false,
    },
    deriv_token: {
      type: String,
      required: false,
    },
    account_list: [accountSchema], // An array of trading accounts
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
