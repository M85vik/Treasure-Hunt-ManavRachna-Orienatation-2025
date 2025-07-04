const express = require("express");
const router = express.Router();
const {
  startGame,
  stopGame,
  getGameStatus,
} = require("../controllers/gameController");

router.post("/start", startGame);
router.post("/stop", stopGame);
router.get("/status", getGameStatus); // Add the new GET route

module.exports = router;
