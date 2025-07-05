import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { TeamContext } from "../context/TeamContent";

const SolvedSeal = ({ children }) => (
  <div className="aspect-square flex flex-col items-center justify-center p-4 rounded-2xl shadow-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white cursor-not-allowed transform hover:scale-105 transition-all">
    {children}
  </div>
);

export default function HubScreen() {
  const { riddles } = useContext(GameContext);
  const { teamInfo } = useContext(TeamContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#131826] via-[#1f2937] to-[#111827] relative overflow-hidden px-4">
      {/* Floating background shapes */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-60 h-60 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="relative w-full max-w-5xl bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1
              className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg mb-2"
              style={{ fontFamily: "'Luckiest Guy', sans" }}
            >
              The Six Seals of Wisdom
            </h1>
            <p className="text-gray-100">
              Team:{" "}
              <span className="font-bold text-amber-300">
                "{teamInfo.teamName}"
              </span>{" "}
              | Total Score:{" "}
              <span className="font-bold text-green-400">{teamInfo.score}</span>
            </p>
          </div>
          <Link
            to="/leaderboard"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
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
                    ? "✅"
                    : riddle.isRiddleSolved
                    ? "🧩"
                    : "🔒"}
                </span>
                <span className="font-bold text-center">
                  {riddle.isPuzzleSolved
                    ? `Seal ${index + 1} Unlocked`
                    : `Seal ${index + 1}`}
                </span>
              </>
            );

            if (riddle.isPuzzleSolved) {
              return <SolvedSeal key={riddle.id}>{sealContent}</SolvedSeal>;
            }

            const destination = riddle.isRiddleSolved
              ? `/puzzle/${riddle.id}`
              : `/riddle/${riddle.id}`;

            return (
              <Link
                to={destination}
                key={riddle.id}
                className={`aspect-square flex flex-col items-center justify-center p-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 ${
                  riddle.isRiddleSolved
                    ? "bg-gradient-to-br from-yellow-300 to-yellow-400 text-gray-800 hover:from-yellow-400 hover:to-yellow-500"
                    : "bg-gradient-to-br from-gray-700 to-gray-800 text-amber-200 hover:from-gray-600 hover:to-gray-700"
                }`}
              >
                {sealContent}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
