import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

const REFRESH_INTERVAL = 300000; // 5 minutes

const RankBadge = ({ rank }) => {
  const colors = {
    1: "bg-yellow-400 text-yellow-900 border-yellow-500",
    2: "bg-gray-300 text-gray-800 border-gray-400",
    3: "bg-orange-400 text-orange-900 border-orange-500",
  };
  const defaultColor = "bg-slate-700 text-white border-slate-600";
  const colorClass = colors[rank] || defaultColor;
  return (
    <div
      className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-xl font-bold border-4 ${colorClass}`}
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
    <div className="bg-slate-900 text-white w-full min-h-screen p-4 sm:p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold text-yellow-300">
            <span className="text-4xl">🏆</span>
            Leaderboard
          </h1>

          {/* --- THIS IS THE FINAL CORRECTED BUTTON --- */}
          <Link
            to="/hub"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105"
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
            {/* This div handles the stacked text */}
            <div className="text-left">
              <span className="text-xs block leading-tight font-normal">
                Back to
              </span>
              <span className="text-base block leading-tight font-bold">
                Hub
              </span>
            </div>
          </Link>
          {/* --- END OF CORRECTION --- */}
        </header>

        <div className="space-y-3">
          {loading && (
            <p className="text-center text-lg text-gray-400 py-8">
              Loading ranks...
            </p>
          )}
          {error && (
            <p className="text-center text-lg text-red-400 py-8">{error}</p>
          )}

          {!loading && teams.length === 0 && (
            <p className="text-center text-lg text-gray-400 py-8">
              No teams have scored yet. Be the first!
            </p>
          )}

          {teams.map((team, index) => (
            <div
              key={team._id}
              className="bg-slate-800 p-4 rounded-lg flex items-center gap-4 shadow-md"
            >
              <RankBadge rank={index + 1} />
              <div className="flex-grow overflow-hidden">
                <p className="text-xl font-bold text-white truncate">
                  {team.teamName}
                </p>
                <p className="text-sm text-slate-400 truncate">
                  Team Members: {team.members.join(", ")}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-bold text-yellow-300">
                  {team.score}
                </p>
                <p className="text-xs text-slate-500">Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
