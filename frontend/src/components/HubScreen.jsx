import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { TeamContext } from "../context/TeamContent";

function HubScreen() {
  const { riddles } = useContext(GameContext);
  const { teamInfo } = useContext(TeamContext);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-amber-900 mb-2">
        The Seven Seals of Wisdom
      </h1>
      <p className="text-gray-600 mb-8">
        Team: "{teamInfo.teamName}" | Score: {teamInfo.score}
      </p>

      {/* Responsive Grid for the boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {riddles.map((riddle, index) => (
          <Link
            to={`/riddle/${riddle.id}`}
            key={riddle.id}
            className={`
              aspect-square flex flex-col items-center justify-center p-4 rounded-xl shadow-lg 
              transform hover:scale-105 transition-all duration-300
              ${
                riddle.isPuzzleSolved // <-- CHECK FOR PUZZLE SOLVED
                  ? "bg-green-500 text-white"
                  : riddle.isRiddleSolved // A half-unlocked state
                  ? "bg-yellow-400 text-gray-800" // Riddle solved, puzzle awaits
                  : "bg-gray-700 text-amber-200 hover:bg-gray-600"
              }
            `}
          >
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
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HubScreen;
