import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { TeamContext } from "../../context/TeamContent";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
// --- PUZZLE CONFIGURATION ---
const PUZZLE_CONFIG = {
  riddleId: 3,
  pointsPerWin: 25,
  correctAnswer: "1999",
};

// --- DATA FOR THE PUZZLE UI ---
const puzzleData = [
  { month: "January", code: "1017" },
  { month: "February", code: "628" },
  { month: "March", code: "1335" },
  { month: "April", code: "145" },
  { month: "May", code: "1353" },
  { month: "June", code: "1064" },
  { month: "July", code: "1074" },
  { month: "August", code: "186" },
];

// --- MAIN PUZZLE COMPONENT ---
// Accepts one prop: `onComplete`, a function to call when the puzzle is successfully solved.
export default function Puzzle3_Cryptogram() {
  const navigate = useNavigate();
  const onComplete = () => {
    navigate("/hub");
  };
  // Get state and functions from our global contexts
  const { solvePuzzle } = useContext(GameContext);
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  // Local state for this puzzle instance
  const [userAnswer, setUserAnswer] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Core Game Logic ---

  // Effect to clear feedback messages after a few seconds.
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Effect to navigate away after the puzzle is solved.
  useEffect(() => {
    if (isSolved) {
      // Wait 3 seconds for the user to see the success message.
      const timer = setTimeout(() => {
        navigate("/hub");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSolved, onComplete]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSolved || isSubmitting) return;

    if (userAnswer.trim() !== PUZZLE_CONFIG.correctAnswer) {
      setFeedbackMessage(
        "Incorrect. The pattern might be trickier than it seems!"
      );
      setUserAnswer(""); // Clear input for another try
      return;
    }

    // --- Correct Answer Flow ---
    setIsSubmitting(true);
    setFeedbackMessage(
      `Correct! You earned ${PUZZLE_CONFIG.pointsPerWin} points.`
    );

    try {
      // 1. Tell the backend to add points for this team.
      const response = await api.post("/teams/score", {
        teamId: teamInfo.id,
        pointsToAdd: PUZZLE_CONFIG.pointsPerWin,
      });
      // 2. Update frontend state.
      updateTeamInfo({ score: response.data.team.score });
      solvePuzzle(PUZZLE_CONFIG.riddleId);
      setIsSolved(true);
    } catch (error) {
      console.error("Failed to save score!", error);
      setFeedbackMessage("Could not save score. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 w-full min-h-screen text-slate-200 flex justify-center items-center py-8">
      <div className="bg-slate-800/50 backdrop-blur-sm ring-1 ring-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          Puzzle 3: Cryptogram
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Below, you can see a list of months and their corresponding codes:
        </p>

        <div className="mt-6">
          <div className="p-4 bg-slate-900/70 rounded-lg font-mono text-sm sm:text-base space-y-2">
            {puzzleData.map((item, index) => (
              <div
                key={item.month}
                className={`flex justify-between p-2 rounded-md ${
                  index % 2 === 0 ? "bg-slate-800/50" : ""
                }`}
              >
                <span className="text-slate-300">{item.month}</span>
                <span className="text-cyan-400">= {item.code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-slate-300 font-medium">
            By deciphering the pattern, can you find the code for **September**?
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter the code for September"
              disabled={isSolved || isSubmitting}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
              aria-label="Your answer for September"
            />
            <button
              type="submit"
              disabled={isSolved || isSubmitting}
              className="w-full sm:w-auto px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Submit"}
            </button>
          </form>
        </div>

        <div className="mt-4 h-8">
          {feedbackMessage && (
            <div
              className={`p-3 rounded-lg text-center font-semibold text-sm transition-opacity duration-500 ${
                isSolved
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {feedbackMessage}
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-slate-700 pt-4 text-sm">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showExplanation
                ? "max-h-96 opacity-100 mt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 space-y-2">
              <p className="font-bold text-white">
                Example: January = 10 | 1 | 7
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>
                  <span className="font-semibold text-slate-200">10</span> =
                  Position of 'J' in the alphabet.
                </li>
                <li>
                  <span className="font-semibold text-slate-200">1</span> =
                  Position of January in the calendar (1st month).
                </li>
                <li>
                  <span className="font-semibold text-slate-200">7</span> =
                  Number of letters in the word "January".
                </li>
              </ul>
              <p className="mt-4 pt-2 border-t border-slate-600">
                Thus:{" "}
                <span className="font-bold text-white">
                  September = 19 | 9 | 9 ⇒ 1999
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
