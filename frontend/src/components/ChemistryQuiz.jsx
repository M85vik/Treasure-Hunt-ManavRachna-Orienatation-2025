// src/components/ChemistryQuiz.jsx
import React, { useState, useEffect } from "react";
import { QUIZ_DATA } from "../utils/quizData";

const ChemistryQuiz = () => {
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isGameOver, setIsGameOver] = useState(false);
  const [answerStatus, setAnswerStatus] = useState("idle"); // 'idle' or 'incorrect'

  const { example, question } = QUIZ_DATA;

  useEffect(() => {
    if (isGameOver) return;
    if (timeLeft <= 0) {
      setIsGameOver(true);
      return;
    }
    const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isGameOver]);

  const handleElementClick = (symbol) => {
    if (isGameOver) return;
    setSelectedSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleCheckAnswer = () => {
    if (isGameOver || selectedSymbols.length === 0) return;

    const isCorrect =
      selectedSymbols.length === question.answerSymbols.length &&
      selectedSymbols.sort().join(",") ===
        question.answerSymbols.sort().join(",");

    if (isCorrect) {
      setScore(25);
      setIsGameOver(true);
    } else {
      setAnswerStatus("incorrect");
      // After a short delay, reset the border color
      setTimeout(() => setAnswerStatus("idle"), 500);
    }
  };

  // --- NATIVE TAILWIND FEEDBACK ---
  // We use conditional classes to change the border color for feedback.
  // `transition-colors` makes the change smooth.
  const questionCardClasses = `
    w-full bg-slate-800 p-6 rounded-xl shadow-2xl border-2 transition-colors duration-300
    ${answerStatus === "incorrect" ? "border-red-500" : "border-slate-700"}
  `;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 p-4 pb-12">
      {isGameOver && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-8 text-center shadow-lg border-2 border-slate-600">
            <h2
              className={`text-4xl font-bold mb-2 ${
                score > 0 ? "text-green-400" : "text-red-500"
              }`}
            >
              {score > 0 ? "Challenge Solved!" : "Game Over"}
            </h2>
            <p className="text-slate-300 text-lg mb-4">Your final score is:</p>
            <p className="text-6xl font-bold text-yellow-400">{score}</p>
          </div>
        </div>
      )}

      <header className="w-full text-center mt-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-300 tracking-wider">
          Chemistry Quiz
        </h1>
      </header>

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

      {/* Using the dynamic classes for the question card */}
      <div className={questionCardClasses}>
        <p className="text-center font-bold text-cyan-400 mb-2 text-lg">
          YOUR QUESTION
        </p>
        <div className="text-center mb-1">
          <p className="text-sm text-slate-400">
            Time Left:
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
                disabled={isGameOver}
                className={`p-3 font-semibold text-base rounded-lg border-2 transition-all duration-200 text-center
                  ${
                    isSelected
                      ? "bg-cyan-600 border-cyan-400 text-white ring-2 ring-cyan-300"
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {element.name}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCheckAnswer}
          disabled={isGameOver || selectedSymbols.length === 0}
          className="w-full font-bold text-white py-3 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
      </div>
    </div>
  );
};

export default ChemistryQuiz;
