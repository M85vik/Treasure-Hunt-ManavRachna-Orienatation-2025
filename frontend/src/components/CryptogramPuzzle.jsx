import React, { useState, useEffect } from "react";

const CryptogramPuzzle = () => {
  // State to manage user input and puzzle status
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  // New state for providing inline feedback for incorrect answers
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const correctAnswer = "1999";

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

  // Effect to clear feedback message after 3 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userAnswer.trim() === correctAnswer) {
      setIsCorrect(true);
      setScore(25);
      setFeedbackMessage(""); // Clear any previous error messages
    } else {
      setFeedbackMessage(
        "Incorrect. The pattern might be trickier than it seems!"
      );
      setUserAnswer(""); // Clear input for another try
    }
  };

  return (
    // Main container to center the puzzle card
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-slate-200">
      {/* The main card with dark UI styling */}
      <div className="bg-slate-800/50 backdrop-blur-sm ring-1 ring-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Puzzle Header with Gradient Text */}
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          #9 - Tricky Cryptogram Puzzle
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Below, you can see some coding:
        </p>

        {/* Puzzle Content */}
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

        {/* Question & Input Form */}
        <div className="mt-8">
          <p className="text-slate-300 font-medium">
            Now deciphering the way it has been coded, can you find out how
            September will be coded?
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
              disabled={isCorrect}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
              aria-label="Your answer for September"
            />
            <button
              type="submit"
              disabled={isCorrect}
              className="w-full sm:w-auto px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all duration-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Feedback Messages Area */}
        <div className="mt-4 h-8">
          {" "}
          {/* Reserve space to prevent layout shift */}
          {isCorrect && (
            <div className="p-3 bg-green-500/20 text-green-300 rounded-lg text-center font-semibold text-sm transition-opacity duration-500 opacity-100">
              Correct! You earned {score} points.
            </div>
          )}
          {feedbackMessage && (
            <div className="p-3 bg-red-500/20 text-red-300 rounded-lg text-center font-semibold text-sm transition-opacity duration-500 opacity-100">
              {feedbackMessage}
            </div>
          )}
        </div>

        {/* Answer Toggle and Explanation */}
        <div className="mt-4 border-t border-slate-700 pt-4 text-sm">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>

          {/* Animated Answer Box */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showAnswer ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 space-y-2">
              <p className="font-bold text-white">January = 10 | 1 | 7</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>
                  <span className="font-semibold text-slate-200">10</span> is
                  the position of letter 'J' in alphabetical order.
                </li>
                <li>
                  <span className="font-semibold text-slate-200">1</span> is the
                  position of January in months.
                </li>
                <li>
                  <span className="font-semibold text-slate-200">7</span> is the
                  number of letters in "January".
                </li>
              </ul>
              <p className="mt-4 pt-2 border-t border-slate-600">
                The same pattern applies to all months. Thus:
                <br />
                <span className="font-bold text-white">
                  September = 19 | 9 | 9 (which is 1999).
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptogramPuzzle;
