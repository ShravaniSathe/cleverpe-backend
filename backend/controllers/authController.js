require('dotenv').config();  // Load environment variables from .env file

const nodemailer = require('nodemailer');
const Admin = require("../models/adminModel");
const { generateToken } = require("../utils/jwt");
const { generateOTP } = require("../utils/otpGenerator");

// Set up nodemailer transporter with your email provider's settings using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other email service provider
  auth: {
    user: process.env.EMAIL_USER,  // Access the EMAIL_USER environment variable
    pass: process.env.EMAIL_PASS,  // Access the EMAIL_PASS environment variable
  },
});

// Function to send OTP to email
function sendOTP(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use EMAIL_USER environment variable
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Send OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({ email });
    }

    admin.otp = otp;
    admin.otpExpiry = otpExpiry;
    await admin.save();

    // Call the sendOTP function to send the OTP via email
    sendOTP(admin.email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

// Verify OTP
// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const now = new Date(); // Get current time
    const otpExpiryTime = new Date(admin.otpExpiry); // Convert otpExpiry to Date object

    // Log the current time and otpExpiry time for debugging
    console.log("Current Time:", now.toISOString());
    console.log("OTP Expiry Time:", otpExpiryTime.toISOString());

    // Check if the OTP has expired
    if (now > otpExpiryTime) {
      admin.otp = undefined; // Clear expired OTP
      admin.otpExpiry = undefined; // Clear expired OTP expiry
      await admin.save(); // Save changes
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Log both stored OTP and entered OTP for debugging
    console.log("Stored OTP:", admin.otp);
    console.log("Entered OTP:", otp);

    // Check if the OTP matches (ensure both are strings and trimmed)
    if (String(admin.otp).trim() === String(otp).trim()) {
      // OTP is valid, proceed with login
      admin.otp = undefined; // Clear OTP
      admin.otpExpiry = undefined; // Clear OTP expiry
      await admin.save(); // Save changes to the database

      const token = generateToken({ email: admin.email });
      return res.status(200).json({ message: "OTP verified successfully", token });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    // Log error for debugging
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};



