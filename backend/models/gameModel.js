const mongoose = require("mongoose");


const gameSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["inactive", "active", "stopped"], 
    default: "inactive",
    required: true,
  },
 
});


gameSchema.statics.getSingleton = function () {
  return this.findOneAndUpdate(
    {},
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
