const express = require("express");
const { sendOTP, verifyOTP, logout } = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/logout", authenticate, logout);

module.exports = router;
