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
   
    score: {
      type: Number,
      default: 0,
    },

   
    scoreLastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
