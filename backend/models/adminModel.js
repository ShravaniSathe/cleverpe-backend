// adminModel.js (or wherever the Admin model is defined)

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,  // OTP as a string
      required: false,  // Allow otp to be empty after verification
    },
    otpExpiry: {
      type: Date,  // Expiry time as Date
      required: false,  // Allow otpExpiry to be empty after verification
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
