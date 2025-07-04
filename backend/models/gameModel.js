const mongoose = require("mongoose");

// This schema will hold a single document for the entire game's state.
const gameSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["inactive", "active", "stopped"], // The only possible values
    default: "inactive", // The game is inactive by default
    required: true,
  },
  // We can add other global game settings here in the future
});

// We use a "Singleton" pattern here - we ensure there's only one game status document.
// The "Game" model will always refer to this single document.
gameSchema.statics.getSingleton = function () {
  return this.findOneAndUpdate(
    {},
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
