const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  googleId: String, // for Google users
  facebookId: String, // for Facebook users
  role: {
    type: String,
    enum: ['trader', 'admin'],
    default: 'trader',
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  documents: [{
    type: String, // URLs of uploaded documents
  }],
  isBlacklisted: {
    type: Boolean,
    default: false,
  },
},
{timestamps: true}
);

// Hashing password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;