const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const teamRoutes = require("./routes/teamRoutes");
const gameRoutes = require("./routes/gameRoutes");


dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://treasure-hunt-mru25-m85vik.netlify.app/api", 

  "https://treasure-hunt-mru25-m85vik.netlify.app",
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


const app = express();



app.use(cors(corsOptions));
app.use(express.json()); 

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
