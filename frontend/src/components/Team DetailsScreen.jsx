import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TeamContext } from "../context/TeamContent";

function TeamDetailsScreen() {
  const navigate = useNavigate();
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  const [localTeamName, setLocalTeamName] = useState(teamInfo.teamName);
  const [localNumPlayers, setLocalNumPlayers] = useState(teamInfo.numPlayers);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localTeamName.trim() === "") {
      setError("Please enter a team name!");
      return;
    }
    updateTeamInfo({
      teamName: localTeamName,
      numPlayers: parseInt(localNumPlayers),
    });
    navigate("/members");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#131826] via-[#1f2937] to-[#111827] relative overflow-hidden px-4">
      {/* Decorative floating gradient shapes */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-60 h-60 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="relative bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 max-w-md w-full z-10">
        <h2
          className="text-2xl font-bold text-center bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg mb-6"
          style={{ fontFamily: "'Luckiest Guy', sans" }}
        >
          Create Your Team
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="teamName"
              className="block text-md font-bold text-white mb-2"
            >
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={localTeamName}
              onChange={(e) => {
                setLocalTeamName(e.target.value);
                setError("");
              }}
              placeholder="e.g., The Code Crusaders"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-inner bg-gray-700"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label
              htmlFor="numPlayers"
              className="block text-md font-bold text-white mb-2"
            >
              Number of Players
            </label>
            <select
              id="numPlayers"
              value={localNumPlayers}
              onChange={(e) => setLocalNumPlayers(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-gray-700 shadow-inner"
            >
              <option value="1">1 Player</option>
              <option value="2">2 Players</option>
              <option value="3">3 Players</option>
              <option value="4">4 Players</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Set Team Members →
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeamDetailsScreen;
