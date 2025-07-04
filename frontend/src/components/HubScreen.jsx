import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { TeamContext } from "../context/TeamContent";

// Non-clickable component for fully solved seals
const SolvedSeal = ({ children }) => (
  <div className="aspect-square flex flex-col items-center justify-center p-4 rounded-xl shadow-lg bg-green-500 text-white cursor-not-allowed">
    {children}
  </div>
);

export default function HubScreen() {
  const { riddles } = useContext(GameContext);
  const { teamInfo } = useContext(TeamContext);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl text-center">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-2">
            The Six Seals of Wisdom
          </h1>
          <p className="text-gray-600">
            Team: "{teamInfo.teamName}" | Total Score:{" "}
            <span className="font-bold">{teamInfo.score}</span>
          </p>
        </div>
        <Link
          to="/leaderboard"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-transform"
        >
          🏆 View Leaderboard
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {riddles.map((riddle, index) => {
          const sealContent = (
            <>
              <span className="text-5xl mb-2">
                {riddle.isPuzzleSolved
                  ? "🔓"
                  : riddle.isRiddleSolved
                  ? "🧩"
                  : "🔒"}
              </span>
              <span className="font-bold text-lg">
                {riddle.isPuzzleSolved
                  ? `Seal ${index + 1} Unlocked`
                  : `Seal ${index + 1}`}
              </span>
            </>
          );

          if (riddle.isPuzzleSolved) {
            return <SolvedSeal key={riddle.id}>{sealContent}</SolvedSeal>;
          }

          // --- THIS IS THE KEY LOGIC CHANGE ---
          // Determine the correct destination for the link.
          const destination = riddle.isRiddleSolved
            ? `/puzzle/${riddle.id}` // If riddle is solved, go straight to puzzle
            : `/riddle/${riddle.id}`; // Otherwise, go to the riddle

          return (
            <Link
              to={destination}
              key={riddle.id}
              className={`aspect-square flex flex-col items-center justify-center p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300
                ${
                  riddle.isRiddleSolved
                    ? "bg-yellow-400 text-gray-800"
                    : "bg-gray-700 text-amber-200 hover:bg-gray-600"
                }`}
            >
              {sealContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
