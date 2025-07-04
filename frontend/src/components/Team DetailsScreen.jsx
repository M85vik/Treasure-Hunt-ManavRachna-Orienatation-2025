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
    // Update the central context state
    updateTeamInfo({
      teamName: localTeamName,
      numPlayers: parseInt(localNumPlayers),
    });
    // Navigate to the next screen
    navigate("/members");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-amber-900 mb-6">
        Create Your Team
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... form inputs are the same as before ... */}
        <div>
          <label
            htmlFor="teamName"
            className="block text-sm font-bold text-gray-700 mb-2"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <div>
          <label
            htmlFor="numPlayers"
            className="block text-sm font-bold text-gray-700 mb-2"
          >
            Number of Players
          </label>
          <select
            id="numPlayers"
            value={localNumPlayers}
            onChange={(e) => setLocalNumPlayers(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
          >
            <option value="1">1 Player</option>
            <option value="2">2 Players</option>
            <option value="3">3 Players</option>
            <option value="4">4 Players</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-transform"
        >
          Set Team Members →
        </button>
      </form>
    </div>
  );
}

export default TeamDetailsScreen;
