const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
      unique: true,
    },
    numPlayers: {
      type: Number,
      required: [true, "Number of players is required"],
      min: 1,
      max: 4,
    },
    members: {
      type: [String],
      required: [true, "Team members are required"],
    },
    // --- ADD THIS ---
    score: {
      type: Number,
      default: 0,
    },

    // --- THIS IS THE NEW FIELD ---
    // A dedicated timestamp to track when the score was last changed.
    scoreLastUpdated: {
      type: Date,
      default: Date.now, // Set to the creation time initially
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
