const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors"); // Import the cors package
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { authenticate } = require("./middlewares/authMiddleware"); // Import the authenticate middleware

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for the port

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing JSON requests

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};

// Connect to MongoDB
connectDB();

// Default Route
app.get("/", (req, res) => {
  res.send("Hello, CleverPe backend is working!");
});

// API Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/tasks", authenticate, taskRoutes); // Task routes with authentication middleware

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
