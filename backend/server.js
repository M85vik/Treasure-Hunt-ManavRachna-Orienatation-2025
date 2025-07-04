const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const teamRoutes = require("./routes/teamRoutes");
const gameRoutes = require("./routes/gameRoutes");

// Load environment variables
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173", // Your local frontend
  "https://your-frontend-url.vercel.app", // YOUR VERCEL URL WILL GO HERE
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Initialize Express App
const app = express();

// Middleware

app.use(cors(corsOptions));
app.use(express.json()); // Allow the server to accept JSON in the request body

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- API Routes ---
app.use("/api/teams", teamRoutes);
app.use("/api/game", gameRoutes); // 2. Add the game routes
// Define the port
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running in on port ${PORT}`);
});
