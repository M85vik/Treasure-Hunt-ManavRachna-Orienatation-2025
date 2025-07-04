import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { GameContext } from "../../context/GameContext";
import { TeamContext } from "../../context/TeamContent";
import api from "../../api/axiosConfig";
import { MORSE_CODE_DICT } from "../../data/morseData";
import { WORD_LIST } from "../../data/wordList";

// --- PUZZLE CONFIGURATION ---
const PUZZLE_CONFIG = { riddleId: 6, pointsPerWin: 25, timeLimit: 60 };

const textToMorse = (text) => {
  if (!text) return "";
  return text
    .toUpperCase()
    .split("")
    .map((char) => MORSE_CODE_DICT[char] || "")
    .join(" ");
};

// --- UI SUB-COMPONENTS ---
const GameEndModal = ({ isSolved, score }) => {
  const title = isSolved ? "Signal Decoded!" : "Time's Up!";
  const message = `Your team's total score is now:`;
  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-8 text-center shadow-lg border-2 border-slate-600 w-full max-w-md">
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

// --- MAIN PUZZLE COMPONENT (CORRECTED) ---
export default function Puzzle6_MorseCode({ onComplete }) {
  const { solvePuzzle } = useContext(GameContext);
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  const [timeLeft, setTimeLeft] = useState(PUZZLE_CONFIG.timeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    setCurrentWord(WORD_LIST[randomIndex]);
    setUserInput("");
    setIsWrong(false);
    setTimeLeft(PUZZLE_CONFIG.timeLimit);
    setIsGameOver(false);
    setIsSolved(false);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  useEffect(() => {
    if (isGameOver) return;
    if (timeLeft <= 0) {
      setIsGameOver(true);
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isGameOver]);

  // --- THIS IS THE CORRECTED LOGIC ---
  useEffect(() => {
    if (isGameOver) {
      if (isSolved) {
        // If the game ended because it was a WIN, navigate away.
        const timer = setTimeout(() => onComplete(), 4000);
        return () => clearTimeout(timer);
      } else {
        // If the game ended because of a LOSS (time out), just reset the puzzle.
        const timer = setTimeout(() => handleReset(), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isGameOver, isSolved, onComplete, handleReset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isGameOver || isSubmitting) return;
    if (userInput.trim().toUpperCase() !== currentWord) {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 500);
      return;
    }

    setIsSubmitting(true);
    setIsSolved(true);
    setIsGameOver(true);
    solvePuzzle(PUZZLE_CONFIG.riddleId);
    try {
      const response = await api.post("/teams/score", {
        teamId: teamInfo.id,
        pointsToAdd: PUZZLE_CONFIG.pointsPerWin,
      });
      updateTeamInfo({ score: response.data.team.score });
    } catch (error) {
      console.error("Background score update failed:", error);
    }
  };

  const morseWord = useMemo(() => textToMorse(currentWord), [currentWord]);
  const inputClasses = `w-full max-w-xs text-center text-2xl font-semibold uppercase bg-slate-700 text-white p-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-300 ${
    isWrong ? "border-red-500" : "border-slate-600 focus:border-cyan-500"
  } ${
    isSolved ? "bg-green-800 border-green-500" : ""
  } disabled:cursor-not-allowed disabled:opacity-50`;

  return (
    <div className="bg-gray-900 w-full min-h-screen text-white flex justify-center items-start py-8">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 sm:gap-8 p-4">
        {isGameOver && (
          <GameEndModal isSolved={isSolved} score={teamInfo.score} />
        )}
        <header>
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-cyan-300 tracking-widest uppercase drop-shadow-lg">
            Puzzle 6: Morse Code
          </h1>
        </header>
        <div className="w-full max-w-sm flex justify-between items-center gap-4">
          <div className="text-center bg-slate-800/50 py-3 px-5 rounded-lg border border-slate-700 flex-1">
            <p className="text-sm sm:text-lg text-slate-300">TEAM SCORE</p>
            <p className="text-3xl sm:text-4xl font-bold text-yellow-400">
              {teamInfo.score}
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
            <div className="text-3xl sm:text-4xl font-mono text-yellow-400 tracking-widest p-4 rounded-lg bg-slate-900 min-h-[72px] flex items-center justify-center">
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
              className="w-full max-w-xs font-bold text-white py-3 px-4 rounded-lg transition-all duration-300 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={isGameOver}
            >
              CHECK
            </button>
          </form>
        </div>
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
                <span className="font-mono text-lg text-yellow-400">
                  {code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
