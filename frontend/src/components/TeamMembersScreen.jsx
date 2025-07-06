import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TeamContext } from "../context/TeamContent";
import api from "../api/axiosConfig";

function TeamMembersScreen() {
  const navigate = useNavigate();
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teamInfo.numPlayers === 0 || !teamInfo.teamName) {
      navigate("/details");
    }
    const initialMembers =
      teamInfo.members.length === teamInfo.numPlayers
        ? teamInfo.members
        : Array(teamInfo.numPlayers).fill("");
    setMembers(initialMembers);
  }, [teamInfo.numPlayers, teamInfo.members, teamInfo.teamName, navigate]);

  const handleNameChange = (index, name) => {
    const newMembers = [...members];
    newMembers[index] = name;
    setMembers(newMembers);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (members.some((name) => name.trim() === "")) {
      setError("Please enter a name for every team member.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const finalTeamData = {
      ...teamInfo,
      members: members,
    };

    try {
      const response = await api.post("/teams/create", finalTeamData);

      updateTeamInfo({
        id: response.data._id,
        teamName: response.data.teamName,
        members: response.data.members,
        score: response.data.score,
      });

      navigate("/hub");
    } catch (apiError) {
      console.error("Failed to create team:", apiError);
      setError("Could not save the team. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#131826] via-[#1f2937] to-[#111827] relative overflow-hidden px-4">
      {/* Decorative blurred glowing shapes */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-green-400 to-green-500 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-60 h-60 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="relative bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 max-w-md w-full z-10">
        <h2
          className="text-2xl font-bold text-center bg-gradient-to-r from-green-400 via-lime-400 to-green-500 bg-clip-text text-transparent drop-shadow-lg mb-6"
          style={{ fontFamily: "'Luckiest Guy', sans" }}
        >
          Who's on the Team?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Array.from({ length: teamInfo.numPlayers }).map((_, index) => (
            <div key={index}>
              <label
                htmlFor={`player-${index}`}
                className="block text-sm font-bold text-white mb-2"
              >
                Player {index + 1}'s Name
              </label>
              <input
                type="text"
                id={`player-${index}`}
                value={members[index] || ""}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Enter Player ${index + 1}'s name`}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none shadow-inner  bg-gray-700 transition-all"
                required
              />
            </div>
          ))}

          {error && (
            <p className="text-red-500 text-center text-sm mt-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-bold py-3 px-6 rounded-xl text-xl shadow-xl transform hover:scale-105 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving Team..." : "Begin the Hunt!"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeamMembersScreen;
