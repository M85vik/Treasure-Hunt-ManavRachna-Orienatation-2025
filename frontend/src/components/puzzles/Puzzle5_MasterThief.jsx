import React, { useState, useEffect, useCallback, useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { TeamContext } from "../../context/TeamContent";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
// --- PUZZLE CONFIGURATION ---
const PUZZLE_CONFIG = {
  riddleId: 5,
  pointsPerWin: 25,
  maxAttempts: 3,
  solution: {
    number: 4,
    color: "Green",
    symbol: "Diamond",
    direction: "North",
  },
};

const CLUES = [
  "The number dial is one greater than the total number of security cameras.",
  "The Red dial is not used.",
  "The dial set to North is directly to the left of the Diamond symbol dial.",
  "If the color is Green, the number must be an even number.",
  "The Club symbol is not used.",
  "The direction is not West.",
];

// --- UI SUB-COMPONENTS ---
const GameEndModal = ({ gameState, score }) => {
  if (gameState === "playing") return null;
  const isWin = gameState === "cracked";
  const title = isWin ? "Vault Cracked!" : "Security Alert!";
  const message = isWin
    ? `+${PUZZLE_CONFIG.pointsPerWin} Points Acquired!`
    : "Mission Failed. Resetting...";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 p-10 rounded-lg text-center border-4 border-slate-600 w-full max-w-md">
        <h2
          className={`text-5xl font-bold mb-2 ${
            isWin ? "text-cyan-400" : "text-red-500"
          }`}
        >
          {title}
        </h2>
        <p className="text-xl text-yellow-300 font-semibold">{message}</p>
        {isWin && (
          <p className="text-slate-300 text-base mt-2">
            New Team Score:{" "}
            <span className="font-bold text-white">{score}</span>
          </p>
        )}
      </div>
    </div>
  );
};

const Dial = ({ id, label, options, value, onChange, disabled }) => (
  <div className="flex flex-col items-center">
    <label htmlFor={id} className="mb-2 font-semibold text-slate-300">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      disabled={disabled}
      className="w-full p-3 text-center text-xl sm:text-2xl font-bold bg-slate-900 border-2 border-slate-500 rounded-md text-white disabled:opacity-50"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

// --- MAIN PUZZLE COMPONENT ---
export default function Puzzle5_MasterThief() {
  const navigate = useNavigate();
  const onComplete = () => {
    navigate("/hub");
  };
  const { solvePuzzle } = useContext(GameContext);
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  const [attemptsLeft, setAttemptsLeft] = useState(PUZZLE_CONFIG.maxAttempts);
  const [gameState, setGameState] = useState("playing");
  const [feedback, setFeedback] = useState(
    'Enter the combination and press "Try Combo".'
  );
  const [selection, setSelection] = useState({
    number: "1",
    color: "Red",
    symbol: "Spade",
    direction: "North",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = useCallback(() => {
    setGameState("playing");
    setAttemptsLeft(PUZZLE_CONFIG.maxAttempts);
    setFeedback("The system has reset. Enter the new combination.");
    setSelection({
      number: "1",
      color: "Red",
      symbol: "Spade",
      direction: "North",
    });
  }, []);

  useEffect(() => {
    if (attemptsLeft <= 0 && gameState === "playing") {
      setGameState("failed");
      setFeedback("Too many failed attempts! Alarm triggered.");
    }
  }, [attemptsLeft, gameState]);

  useEffect(() => {
    if (gameState === "cracked" || gameState === "failed") {
      const timer = setTimeout(() => {
        navigate("/hub");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, onComplete, handleReset]);

  const handleSelectionChange = (dial, value) => {
    setSelection((prev) => ({ ...prev, [dial]: value }));
  };

  const handleSubmit = async () => {
    if (gameState !== "playing" || isSubmitting) return;

    const currentAttempt = {
      ...selection,
      number: parseInt(selection.number, 10),
    };
    if (
      JSON.stringify(currentAttempt) === JSON.stringify(PUZZLE_CONFIG.solution)
    ) {
      setGameState("cracked");
      setFeedback("Success! The vault is open. Transferring points...");
      setIsSubmitting(true);
      solvePuzzle(PUZZLE_CONFIG.riddleId);

      try {
        const response = await api.post("/teams/score", {
          // --- THIS IS THE FIX ---
          // The key is now `teamId`, which matches what the backend expects.
          teamId: teamInfo.id,
          pointsToAdd: PUZZLE_CONFIG.pointsPerWin,
        });
        updateTeamInfo({ score: response.data.team.score });
      } catch (error) {
        console.error(
          "Background score update failed. This did not affect user progression.",
          error
        );
      }
    } else {
      setAttemptsLeft((prev) => prev - 1);
      setFeedback("Incorrect Combination. Security systems are on alert.");
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans p-4 md:p-8 w-full">
      <GameEndModal gameState={gameState} score={teamInfo.score} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: The Vault */}
        <div className="bg-slate-800 p-6 rounded-lg border-4 border-slate-600">
          <header className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
              Puzzle 5: The Vault
            </h1>
            <div
              className="flex items-center space-x-1 text-2xl"
              title="3 Security Cameras"
            >
              <span>📹</span>
              <span>📹</span>
              <span>📹</span>
            </div>
          </header>

          <div className="bg-slate-700 p-6 sm:p-8 my-6 rounded-xl shadow-inner">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <Dial
                id="number"
                label="Number"
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                value={selection.number}
                onChange={handleSelectionChange}
                disabled={gameState !== "playing"}
              />
              <Dial
                id="color"
                label="Color"
                options={["Red", "Green", "Blue", "Yellow"]}
                value={selection.color}
                onChange={handleSelectionChange}
                disabled={gameState !== "playing"}
              />
              <Dial
                id="symbol"
                label="Symbol"
                options={["Spade", "Diamond", "Club", "Heart"]}
                value={selection.symbol}
                onChange={handleSelectionChange}
                disabled={gameState !== "playing"}
              />
              <Dial
                id="direction"
                label="Direction"
                options={["North", "East", "South", "West"]}
                value={selection.direction}
                onChange={handleSelectionChange}
                disabled={gameState !== "playing"}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={gameState !== "playing"}
            className="w-full mt-4 py-4 text-xl sm:text-2xl font-bold bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 transition-all disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            Try Combo
          </button>
        </div>

        {/* Right Column: Intel and Status */}
        <div className="space-y-8">
          <div className="bg-slate-800 p-6 rounded-lg border-2 border-slate-600">
            <h2 className="text-2xl font-semibold mb-3 text-cyan-400">
              Status Panel
            </h2>
            <div className="flex flex-col sm:flex-row justify-between items-center bg-black p-4 rounded-md font-mono gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-400">TEAM SCORE</p>
                <p className="text-3xl text-green-400">{teamInfo.score}</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-400">ATTEMPTS LEFT</p>
                <p className="text-3xl text-red-500">{attemptsLeft}</p>
              </div>
            </div>
            <p
              className={`mt-4 p-3 rounded-md text-center font-semibold ${
                feedback.includes("Incorrect") || feedback.includes("Alarm")
                  ? "bg-red-900 text-red-300"
                  : "bg-green-900 text-green-300"
              }`}
            >
              {feedback}
            </p>
          </div>
          <div className="bg-black p-6 rounded-lg border-2 border-green-500 font-mono">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">
              Insider Intel_
            </h2>
            <ul className="list-disc list-inside space-y-2 text-green-300 text-sm sm:text-base">
              {CLUES.map((clue, index) => (
                <li key={index}>{clue}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
