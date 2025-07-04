// src/components/EmojiEnigma.jsx

import "../App.css";

import React, { useState, useEffect, useCallback } from "react";

// --- DYNAMIC PUZZLE ENGINE (This logic remains the same) ---
const EMOJI_POOL = ["🚀", "☀️", "🔑", "❤️", "⚙️", "💎", "⏰", "⚡️"];
const DECRYPTION_RULES = [
  "🚀 (Rocket): Its value is its position in the sequence (1, 2, 3, or 4).",
  "☀️ (Sun): If the sequence contains a ❤️, its value is 5. Otherwise, its value is 8.",
  "🔑 (Key): Its value is the number of sides on the shape next to the keypad (a Hexagon).",
  "❤️ (Heart): Its value is the LAST digit of your current SCORE. (If score is 0, value is 0).",
  "⚙️ (Gear): Its value is the number of 'mechanical' emojis (🚀, ⚙️, ⏰) in the sequence.",
  "💎 (Diamond): Its value is always 3.",
  "⏰ (Clock): Its value is the FIRST digit of your current SCORE. (If score is 0, value is 0).",
  "⚡️ (Lightning): Its value is the total count of 'energy' emojis (☀️, ⚡️) in the sequence.",
];

const calculateDigit = (emoji, index, sequence, score) => {
  const scoreStr = score.toString();
  switch (emoji) {
    case "🚀":
      return index + 1;
    case "☀️":
      return sequence.includes("❤️") ? 5 : 8;
    case "🔑":
      return 6;
    case "❤️":
      return parseInt(scoreStr.slice(-1), 10);
    case "⚙️":
      return sequence.filter((e) => ["🚀", "⚙️", "⏰"].includes(e)).length;
    case "💎":
      return 3;
    case "⏰":
      return parseInt(scoreStr[0], 10) || 0;
    case "⚡️":
      return sequence.filter((e) => ["☀️", "⚡️"].includes(e)).length;
    default:
      return 0;
  }
};

const generateNewPuzzle = (score) => {
  const newSequence = [...EMOJI_POOL]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  const newSolution = newSequence
    .map((emoji, index) =>
      calculateDigit(emoji, index, newSequence, score).toString()
    )
    .join("");
  return { sequence: newSequence, solution: newSolution };
};

// --- UI COMPONENTS ---
const GameEndModal = ({ gameState }) => {
  if (gameState === "playing") return null;
  const isWin = gameState === "solved";
  const title = isWin ? "Code Decrypted!" : "System Error!";
  const message = isWin
    ? `+25 Points Transferred!`
    : "Incorrect. Resetting system...";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg text-center border-4 border-gray-700 w-full max-w-sm">
        <h2
          className={`text-4xl sm:text-5xl font-bold mb-2 ${
            isWin ? "text-lime-400" : "text-red-500"
          }`}
        >
          {title}
        </h2>
        <p className="text-lg sm:text-xl text-yellow-300 font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
};

// --- MAIN PUZZLE COMPONENT ---
export default function EmojiEnigma() {
  // --- STATE AND LOGIC (This remains the same) ---
  const [playerScore, setPlayerScore] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("Enter the 4-digit code.");
  const [enigma, setEnigma] = useState({ sequence: [], solution: "" });

  const handleReset = useCallback((currentScore) => {
    setGameState("playing");
    setUserInput("");
    setEnigma(generateNewPuzzle(currentScore));
    setFeedback("New enigma loaded. Decrypt the sequence.");
  }, []);

  useEffect(() => {
    handleReset(0);
  }, [handleReset]);

  const handleKeyPress = (digit) => {
    if (userInput.length < 4 && gameState === "playing")
      setUserInput(userInput + digit);
  };
  const handleSubmit = () => {
    if (gameState !== "playing" || userInput.length !== 4) return;
    if (userInput === enigma.solution) {
      setGameState("solved");
      const newScore = playerScore + 25;
      setPlayerScore(newScore);
      setFeedback("Access Granted.");
      setTimeout(() => handleReset(newScore), 3000);
    } else {
      setGameState("failed");
      setFeedback("Access Denied. Code incorrect.");
      setTimeout(() => handleReset(playerScore), 3000);
    }
  };

  return (
    // Set a consistent background and padding for the whole page
    <main className="bg-gray-900 text-white min-h-screen font-sans w-full">
      <GameEndModal gameState={gameState} />
      {/* Centered container with responsive padding */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Main grid: single column on mobile, two columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Section 1: The Vault (Spans 3/5 width on large screens) */}
          <div className="lg:col-span-3 bg-gray-800 p-4 sm:p-6 rounded-lg border-4 border-gray-700">
            <header className="mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-lime-400">
                Dynamic Enigma Vault
              </h1>
              <p className="text-gray-400">
                Sequence and solution change each round.
              </p>
            </header>

            <div className="bg-black p-4 my-6 rounded-xl shadow-inner flex justify-around items-center">
              {enigma.sequence.map((emoji, index) => (
                <span key={index} className="text-5xl sm:text-6xl md:text-7xl">
                  {emoji}
                </span>
              ))}
            </div>

            <div className="flex items-stretch gap-4">
              <div className="hidden sm:flex items-center justify-center p-4 bg-gray-900 rounded-lg">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-yellow-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.5l7.794 4.5v9L12 20.5l-7.794-4.5v-9L12 2.5z" />
                </svg>
              </div>
              <div className="flex-grow bg-black rounded-lg p-2 sm:p-4">
                <div className="h-14 sm:h-16 w-full bg-gray-700 rounded-md mb-4 flex items-center justify-center text-4xl sm:text-5xl font-mono text-lime-300 tracking-widest">
                  {userInput || "----"}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "CLR", 0, "ENT"].map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        if (key === "CLR") setUserInput("");
                        else if (key === "ENT") handleSubmit();
                        else handleKeyPress(key.toString());
                      }}
                      className={`p-3 sm:p-4 rounded-md text-xl sm:text-2xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-lime-400 
                        ${key === "CLR" ? "bg-red-800 hover:bg-red-700" : ""}
                        ${
                          key === "ENT" ? "bg-green-800 hover:bg-green-700" : ""
                        }
                        ${
                          typeof key === "number" || key === 0
                            ? "bg-gray-600 hover:bg-gray-500"
                            : ""
                        }
                      `}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Intel & Status (Spans 2/5 width on large screens) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border-2 border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-lime-400">
                Status Panel
              </h2>
              <div className="bg-black p-4 rounded-md font-mono flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-400">SCORE</p>
                  <p className="text-3xl text-green-400">{playerScore}</p>
                </div>
                <p className="p-2 rounded-md text-center font-semibold text-sm sm:text-base bg-gray-700 text-gray-300">
                  {feedback}
                </p>
              </div>
            </div>

            <div className="bg-black p-4 sm:p-6 rounded-lg border-2 border-lime-500 font-mono h-fit">
              <h2 className="text-2xl font-semibold mb-4 text-lime-400">
                Rules.txt
              </h2>
              <ul className="list-disc list-inside space-y-3 text-lime-300 text-xs sm:text-sm">
                {DECRYPTION_RULES.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
