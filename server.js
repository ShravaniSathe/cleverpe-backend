const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // For parsing JSON requests

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};


app.get("/", (req, res) => {
    res.send("Hello, CleverPe backend is working!");
  });



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectDB();