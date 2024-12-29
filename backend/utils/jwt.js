const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expiry = "1h") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiry });
};
