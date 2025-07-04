const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const teamRoutes = require("./routes/teamRoutes");

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
app.use("/api/teams", teamRoutes);

// Define the port
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in on port ${PORT}`);
});
