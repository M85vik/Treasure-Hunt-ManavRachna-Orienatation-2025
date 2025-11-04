const express = require("express");
const router = express.Router();
const {
  createTeam,
  addScore,
  getLeaderboard,
} = require("../controllers/teamController");


router.post("/create", createTeam);

router.post("/score", addScore);

router.get("/leaderboard", getLeaderboard);

module.exports = router;
