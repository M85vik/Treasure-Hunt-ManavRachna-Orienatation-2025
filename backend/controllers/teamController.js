const Team = require("../models/teamModel");
const Game = require("../models/gameModel"); // Import the Game model to check status

/**
 * @desc    Create a new team
 * @route   POST /api/teams/create
 * @access  Public
 */
const createTeam = async (req, res) => {
  try {
    const { teamName, numPlayers, members } = req.body;

    if (!teamName || !numPlayers || !members) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

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
    res.status(201).json(createdTeam);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc    Add points to a team's score, but only if the game is active.
 * @route   POST /api/teams/score
 * @access  Public
 */
const addScore = async (req, res) => {
  try {
    // --- CRITICAL CHECK ---
    // First, get the current game status from the database.
    const game = await Game.getSingleton();

    // If the game is not currently 'active', block the request.
    if (game.status !== "active") {
      return res.status(403).json({
        message: `Score cannot be added because the game is not active. Current status: ${game.status}.`,
      });
    }

    // If the game IS active, proceed with adding the score.
    const { teamId, pointsToAdd } = req.body;
    if (!teamId || !pointsToAdd) {
      return res
        .status(400)
        .json({ message: "Team ID and points are required." });
    }

    // --- THIS IS THE FIX ---
    // When we update the score, we ALSO explicitly set our new timestamp field.
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        $inc: { score: pointsToAdd },
        scoreLastUpdated: new Date(), // Set the timestamp to the exact moment of the update
      },
      { new: true }
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

const getLeaderboard = async (req, res) => {
  try {
    // --- THIS IS THE OTHER PART OF THE FIX ---
    // We now use our reliable `scoreLastUpdated` field for the tie-breaker.
    // It sorts by score (desc), then by the score timestamp (asc).
    // This correctly ranks the team that reached a score first higher in a tie.
    const teams = await Team.find({}).sort({ score: -1, scoreLastUpdated: 1 });

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createTeam,
  addScore,
  getLeaderboard,
};
