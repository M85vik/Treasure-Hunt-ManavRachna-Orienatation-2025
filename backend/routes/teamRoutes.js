const express = require("express");
const router = express.Router();
const { createTeam, addScore } = require("../controllers/teamController");

// This will be mounted at /api/teams, so this route is effectively /api/teams/create
router.post("/create", createTeam);

router.post("/score", addScore);

module.exports = router;
