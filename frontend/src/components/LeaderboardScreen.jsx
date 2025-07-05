import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

const REFRESH_INTERVAL = 300000; // 5 minutes

const RankBadge = ({ rank }) => {
  const colors = {
    1: "from-yellow-400 to-yellow-500 text-yellow-900 border-yellow-300 shadow-yellow-400",
    2: "from-gray-300 to-gray-400 text-gray-800 border-gray-300 shadow-gray-300",
    3: "from-orange-400 to-orange-500 text-orange-900 border-orange-300 shadow-orange-300",
  };
  const defaultColor =
    "from-slate-700 to-slate-800 text-white border-slate-600 shadow-slate-600";
  const colorClass = colors[rank] || defaultColor;
  return (
    <div
      className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-xl font-bold border-4 bg-gradient-to-br ${colorClass}`}
    >
      {rank}
    </div>
  );
};

export default function LeaderboardScreen() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError("");
        const response = await api.get("/teams/leaderboard");
        setTeams(response.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Could not load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
    const intervalId = setInterval(fetchLeaderboard, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-[#131826] via-[#1f2937] to-[#111827] min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Floating shapes */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-60 h-60 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="relative w-full max-w-3xl bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 z-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            <span className="text-2xl">🏆</span>
            Leaderboard
          </h1>
          <Link
            to="/hub"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-left">
              <span className="text-xs block leading-tight font-normal">
                Back
              </span>
            </div>
          </Link>
        </header>

        <div className="space-y-4">
          {loading && (
            <p className="text-center text-lg text-gray-300 py-8">
              Loading ranks...
            </p>
          )}
          {error && (
            <p className="text-center text-lg text-red-400 py-8">{error}</p>
          )}
          {!loading && teams.length === 0 && (
            <p className="text-center text-lg text-gray-300 py-8">
              No teams have scored yet. Be the first!
            </p>
          )}
          {teams.map((team, index) => (
            <div
              key={team._id}
              className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex items-center gap-4 border border-white/10 shadow-lg transition-all hover:scale-[1.02]"
            >
              <RankBadge rank={index + 1} />
              <div className="flex-grow overflow-hidden">
                <p className="text-xl font-bold text-white truncate">
                  {team.teamName}
                </p>
                <p className="text-sm text-gray-300 truncate">
                  Members: {team.members.join(", ")}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-bold text-yellow-300">
                  {team.score}
                </p>
                <p className="text-xs text-gray-400">Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
