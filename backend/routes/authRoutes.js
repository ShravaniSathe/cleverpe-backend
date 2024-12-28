const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/authController");
const nodemailer = require('nodemailer');

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
