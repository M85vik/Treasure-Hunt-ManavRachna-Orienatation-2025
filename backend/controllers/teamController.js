const Team = require("../models/teamModel");

// @desc    Create a new team
// @route   POST /api/teams/create
// @access  Public
const createTeam = async (req, res) => {
  try {
    const { teamName, numPlayers, members } = req.body;

    // Basic validation
    if (!teamName || !numPlayers || !members) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if team name already exists
    const teamExists = await Team.findOne({ teamName });
    if (teamExists) {
      return res
        .status(400)
        .json({ message: "A team with this name already exists" });
    }

    const team = new Team({
      teamName,
      numPlayers,
      members,
    });

    const createdTeam = await team.save();
    res.status(201).json(createdTeam); // 201 = Created
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addScore = async (req, res) => {
  try {
    const { teamId, pointsToAdd } = req.body;

    if (!teamId || !pointsToAdd) {
      return res
        .status(400)
        .json({ message: "Team ID and points are required." });
    }

    // Find the team and add the points atomically
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { $inc: { score: pointsToAdd } }, // $inc is a MongoDB operator to increment a field
      { new: true } // This option returns the updated document
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found." });
    }

    res
      .status(200)
      .json({ message: "Score updated successfully", team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// --- UPDATE THE EXPORTS ---
module.exports = {
  createTeam,
  addScore, // Add the new function here
};
