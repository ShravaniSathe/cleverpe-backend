// authMiddleware.js
const jwt = require("jsonwebtoken");
const { isBlacklisted, addToBlacklist } = require("../utils/blacklist");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  // Check if the token is blacklisted
  if (isBlacklisted(token)) {
    return res.status(401).json({ message: "Token is invalid (blacklisted)." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Logout function to blacklist the token
const logout = (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  // Add the token to the blacklist
  addToBlacklist(token);

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { authenticate, logout };
