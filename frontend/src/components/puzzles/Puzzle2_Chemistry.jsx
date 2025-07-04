import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { TeamContext } from "../../context/TeamContent";
import api from "../../api/axiosConfig";
import { QUIZ_DATA } from "../../data/chemistryQuizData"; // Import data from our new file

// --- PUZZLE CONFIGURATION ---
const PUZZLE_CONFIG = {
  riddleId: 2, // The ID of the riddle that unlocks this puzzle.
  timeLimit: 90, // 90 seconds for this puzzle.
  pointsPerWin: 25,
};

// --- UI SUB-COMPONENTS ---

// Modal that appears when the game is won or lost.
const GameEndModal = ({ isSolved, score }) => {
  const title = isSolved ? "Challenge Solved!" : "Time's Up!";
  const message = `Your team's total score is now:`;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-8 text-center shadow-lg border-2 border-slate-600">
        <h2
          className={`text-4xl font-bold mb-2 ${
            isSolved ? "text-green-400" : "text-red-500"
          }`}
        >
          {title}
        </h2>
        <p className="text-slate-300 text-lg mb-4">{message}</p>
        <p className="text-6xl font-bold text-yellow-400">{score}</p>
      </div>
    </div>
  );
};

// --- MAIN PUZZLE COMPONENT ---
// This component accepts one prop: `onComplete`, a function to call when the puzzle is successfully solved.
export default function Puzzle2_Chemistry({ onComplete }) {
  // Get state and functions from our global contexts
  const { solvePuzzle } = useContext(GameContext);
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  // Local state for this puzzle instance
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [timeLeft, setTimeLeft] = useState(PUZZLE_CONFIG.timeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [answerStatus, setAnswerStatus] = useState("idle"); // 'idle' or 'incorrect'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Destructure data for easier access
  const { example, question } = QUIZ_DATA;

  // --- Core Game Logic ---

  // Effect for the countdown timer.
  useEffect(() => {
    if (isGameOver) return;
    if (timeLeft <= 0) {
      setIsGameOver(true); // End the game if time runs out
      return;
    }
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isGameOver]);

  // Effect to navigate away after the game ends.
  useEffect(() => {
    if (isGameOver) {
      // Wait 3 seconds for the user to see the modal, then navigate.
      const timer = setTimeout(() => onComplete(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, onComplete]);

  // Handles the logic when a user clicks an element button.
  const handleElementClick = (symbol) => {
    if (isGameOver || isSubmitting) return;
    setSelectedSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  // Handles the submission and checking of the answer.
  const handleCheckAnswer = async () => {
    if (isGameOver || isSubmitting || selectedSymbols.length === 0) return;

    const isCorrect =
      selectedSymbols.length === question.answerSymbols.length &&
      selectedSymbols.sort().join(",") ===
        question.answerSymbols.sort().join(",");

    if (!isCorrect) {
      setAnswerStatus("incorrect");
      setTimeout(() => setAnswerStatus("idle"), 500); // Visual feedback for wrong answer
      return;
    }

    // --- Correct Answer Flow ---
    setIsSubmitting(true);
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
      setIsGameOver(true);
    } catch (error) {
      console.error("Failed to save score!", error);
      // You could show an error to the user here.
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Dynamic Styling ---
  const questionCardClasses = `w-full bg-slate-800 p-6 rounded-xl shadow-2xl border-2 transition-colors duration-300 ${
    answerStatus === "incorrect" ? "border-red-500" : "border-slate-700"
  }`;

  return (
    <div className="bg-gray-900 w-full min-h-screen text-white flex justify-center items-start py-8">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 p-4">
        {isGameOver && (
          <GameEndModal isSolved={isSolved} score={teamInfo.score} />
        )}

        <header className="w-full text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-300 tracking-wider">
            Puzzle 2: Chemistry Quiz
          </h1>
        </header>

        {/* Example Box */}
        <div className="w-full bg-slate-800/50 p-5 rounded-xl border-2 border-dashed border-slate-600">
          <p className="text-center font-bold text-slate-400 mb-4 text-lg">
            EXAMPLE
          </p>
          <p className="text-lg text-center text-white mb-3">{example.pun}</p>
          <p className="text-center text-2xl font-bold text-yellow-400 mb-4">
            "{example.answerExplanation}"
          </p>
          <div className="flex justify-center gap-3">
            {example.options.map((el) => (
              <div
                key={el.symbol}
                className="p-3 font-semibold text-base rounded-lg bg-green-800 border-2 border-green-600 text-white"
              >
                {el.name}
              </div>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className={questionCardClasses}>
          <div className="flex justify-between items-center mb-4">
            <p className="font-bold text-cyan-400 text-lg">YOUR QUESTION</p>
            <p className="text-sm text-slate-400">
              Time Left:{" "}
              <span
                className={`font-bold ${
                  timeLeft <= 10 ? "text-red-500" : "text-yellow-400"
                }`}
              >
                {" "}
                {timeLeft}s
              </span>
            </p>
          </div>
          <p className="text-lg sm:text-xl text-white min-h-[56px] flex items-center justify-center text-center mb-4">
            {question.pun}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {question.options.map((element) => {
              const isSelected = selectedSymbols.includes(element.symbol);
              return (
                <button
                  key={element.symbol}
                  onClick={() => handleElementClick(element.symbol)}
                  disabled={isGameOver || isSubmitting}
                  className={`p-3 font-semibold text-base rounded-lg border-2 transition-all duration-200 text-center ${
                    isSelected
                      ? "bg-cyan-600 border-cyan-400 text-white ring-2 ring-cyan-300"
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {element.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCheckAnswer}
            disabled={
              isGameOver || isSubmitting || selectedSymbols.length === 0
            }
            className="w-full font-bold text-white py-3 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Checking..." : "Check Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
