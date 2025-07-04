// src/components/MorsePuzzleGame.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MORSE_CODE_DICT } from "../utils/morseData";
import { WORD_LIST } from "../utils/wordList";

// Helper function remains the same
const textToMorse = (text) => {
  if (!text) return "";
  return text
    .split("")
    .map((char) => MORSE_CODE_DICT[char] || "")
    .join(" ");
};

const MorsePuzzleGame = () => {
  // --- State Management for a Single Game ---
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isWrong, setIsWrong] = useState(false);

  // --- Game Logic ---
  // This now just selects the single word for the game
  const selectWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    setCurrentWord(WORD_LIST[randomIndex]);
  }, []);

  // Set up the game on initial component mount
  useEffect(() => {
    selectWord();
  }, [selectWord]);

  // useEffect hook for the timer
  useEffect(() => {
    // If game is over, don't run the timer
    if (isGameOver) return;

    // When time runs out, end the game
    if (timeLeft <= 0) {
      setIsGameOver(true);
      return;
    }

    // Set up the interval
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(timerId);
  }, [timeLeft, isGameOver]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent submissions if game is over
    if (isGameOver) return;

    if (userInput.trim().toUpperCase() === currentWord) {
      // CORRECT ANSWER: Set score, mark as solved, and end the game
      setScore(25);
      setIsSolved(true);
      setIsGameOver(true);
    } else {
      // WRONG ANSWER: Show visual feedback, user can try again
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const morseWord = useMemo(() => textToMorse(currentWord), [currentWord]);

  const inputClasses = `
    w-full max-w-xs text-center text-2xl font-semibold uppercase bg-slate-700 text-white p-3 rounded-lg border-2
    focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-300
    ${isWrong ? "border-red-500" : "border-slate-600 focus:border-cyan-500"}
    ${isSolved ? "bg-green-800 border-green-500" : ""}
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 sm:gap-8 pb-12">
      {/* --- New: Game Over Modal --- */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-8 text-center shadow-lg border-2 border-slate-600">
            <h2
              className={`text-4xl font-bold mb-2 ${
                isSolved ? "text-green-400" : "text-red-500"
              }`}
            >
              {isSolved ? "You Solved It!" : "Time's Up!"}
            </h2>
            <p className="text-slate-300 text-lg mb-4">Your final score is:</p>
            <p className="text-6xl font-bold text-yellow-400">{score}</p>
          </div>
        </div>
      )}

      <header className="mt-6 md:mt-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-cyan-300 tracking-widest uppercase drop-shadow-lg">
          Morse Puzzle
        </h1>
      </header>

      <div className="w-full max-w-sm flex justify-between items-center gap-4">
        <div className="text-center bg-slate-800/50 py-3 px-5 rounded-lg border border-slate-700 flex-1">
          <p className="text-sm sm:text-lg text-slate-300">SCORE</p>
          <p className="text-3xl sm:text-4xl font-bold text-yellow-400">
            {score}
          </p>
        </div>
        <div className="text-center bg-slate-800/50 py-3 px-5 rounded-lg border border-slate-700 flex-1">
          <p className="text-sm sm:text-lg text-slate-300">TIME LEFT</p>
          <p
            className={`text-3xl sm:text-4xl font-bold transition-colors ${
              timeLeft <= 10 ? "text-red-500" : "text-yellow-400"
            }`}
          >
            {timeLeft}
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl border-2 border-slate-700 flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-slate-400 mb-2 font-mono">DECODE THE WORD:</p>
          <div className="text-3xl sm:text-4xl font-mono text-yellow-400 tracking-widest p-4 rounded-lg bg-slate-900 min-h-[72px]">
            {morseWord}
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-4"
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toUpperCase())}
            placeholder="TYPE ANSWER"
            className={inputClasses}
            disabled={isGameOver}
            autoFocus
          />
          <button
            type="submit"
            className="w-full max-w-xs font-bold text-white py-3 px-4 rounded-lg transition-all duration-300 bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={isGameOver}
          >
            CHECK
          </button>
        </form>
      </div>

      {/* Morse Code Reference Chart remains the same */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto mt-4 p-4 bg-slate-800/80 rounded-xl border-2 border-slate-700">
        <p className="text-center font-bold text-slate-300 mb-4">
          Morse Code Reference
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-4 gap-y-2">
          {Object.entries(MORSE_CODE_DICT).map(([letter, code]) => (
            <div
              key={letter}
              className="flex justify-between items-center bg-slate-900/50 px-2 py-1 rounded"
            >
              <span className="font-bold text-lg text-white">{letter}</span>
              <span className="font-mono text-lg text-yellow-400">{code}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MorsePuzzleGame;
