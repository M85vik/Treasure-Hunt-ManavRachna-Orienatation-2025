// src/components/MasterThief.jsx

import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
// src/MasterThief.jsx

// --- CONFIGURATION ---
const PUZZLE_CONFIG = {
  maxAttempts: 3,
  pointsPerCrack: 25,
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

// --- HELPER & UI COMPONENTS ---

const GameEndModal = ({ gameState }) => {
  if (gameState === "playing") return null;
  const isWin = gameState === "cracked";
  const title = isWin ? "Vault Cracked!" : "Security Alert!";
  const message = isWin
    ? `+${PUZZLE_CONFIG.pointsPerCrack} Points Acquired!`
    : "Mission Failed. Resetting...";

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-10 rounded-lg text-center border-4 border-slate-600">
        <h2
          className={`text-5xl font-bold mb-2 ${
            isWin ? "text-cyan-400" : "text-red-500"
          }`}
        >
          {title}
        </h2>
        <p className="text-xl text-yellow-300 font-semibold">{message}</p>
      </div>
    </div>
  );
};

// --- MAIN PUZZLE COMPONENT ---
export default function MasterThief() {
  const [playerScore, setPlayerScore] = useState(0);
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

  const handleSelectionChange = (dial, value) => {
    setSelection((prev) => ({ ...prev, [dial]: value }));
  };

  const handleSubmit = () => {
    if (gameState !== "playing") return;
    const currentAttempt = {
      ...selection,
      number: parseInt(selection.number, 10),
    };
    if (
      JSON.stringify(currentAttempt) === JSON.stringify(PUZZLE_CONFIG.solution)
    ) {
      setGameState("cracked");
      setPlayerScore((prev) => prev + PUZZLE_CONFIG.pointsPerCrack);
      setFeedback("Success! The vault is open.");
    } else {
      setAttemptsLeft((prev) => prev - 1);
      setFeedback("Incorrect Combination. Security systems are on alert.");
    }
  };

  useEffect(() => {
    if (attemptsLeft <= 0 && gameState === "playing") {
      setGameState("failed");
      setFeedback("Too many failed attempts! Alarm triggered.");
    }
  }, [attemptsLeft, gameState]);

  useEffect(() => {
    if (gameState === "cracked" || gameState === "failed") {
      const timer = setTimeout(() => {
        handleReset();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [gameState, handleReset]);

  return (
    <main className="bg-slate-900 text-white min-h-screen font-sans p-4 md:p-8">
      <GameEndModal gameState={gameState} />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-lg border-4 border-slate-600">
          {/* CORRECTED HEADER SECTION */}
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-cyan-400">Vault K-47</h1>
            <div className="flex items-center space-x-1 text-2xl">
              {/* This is a clue! There are 3 cameras. */}
              <span>📹</span>
              <span>📹</span>
              <span>📹</span>
            </div>
          </header>

          <div className="bg-slate-700 p-8 my-6 rounded-xl shadow-inner">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
            className="w-full mt-4 py-4 text-2xl font-bold bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 transition-all disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            Try Combo
          </button>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-800 p-6 rounded-lg border-2 border-slate-600">
            <h2 className="text-2xl font-semibold mb-3 text-cyan-400">
              Status & Intel
            </h2>
            <div className="flex justify-between items-center bg-black p-4 rounded-md font-mono">
              <div>
                <p className="text-sm text-gray-400">SCORE</p>
                <p className="text-3xl text-green-400">{playerScore}</p>
              </div>
              <div>
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
              {" "}
              Insider Intel_
            </h2>
            <ul className="list-disc list-inside space-y-2 text-green-300">
              {CLUES.map((clue, index) => (
                <li key={index}>{clue}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

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
      className="w-full p-3 text-center text-2xl font-bold bg-slate-900 border-2 border-slate-500 rounded-md text-white disabled:opacity-50"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
