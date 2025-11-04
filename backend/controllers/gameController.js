const Game = require("../models/gameModel"); 
// @desc    Start the treasure hunt
// @route   POST /api/game/start
const startGame = async (req, res) => {
  try {
    const game = await Game.getSingleton();
    game.status = "active";
    await game.save();
    console.log("GAME STATUS UPDATED: active");
    res
      .status(200)
      .json({ message: "The treasure hunt is now LIVE!", status: game.status });
  } catch (error) {
    res.status(500).json({ message: "Server error while starting game." });
  }
};



// @desc    Stop the treasure hunt
// @route   POST /api/game/stop
const stopGame = async (req, res) => {
  try {
    const game = await Game.getSingleton();
    game.status = "stopped";
    await game.save();
    console.log("GAME STATUS UPDATED: stopped");
    res
      .status(200)
      .json({
        message: "The treasure hunt has been STOPPED.",
        status: game.status,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error while stopping game." });
  }
};



// @desc    Get the current game status
// @route   GET /api/game/status
const getGameStatus = async (req, res) => {
  try {
    const game = await Game.getSingleton();
    res.status(200).json({ status: game.status });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error while fetching game status." });
  }
};

module.exports = {
  startGame,
  stopGame,
  getGameStatus,
};
