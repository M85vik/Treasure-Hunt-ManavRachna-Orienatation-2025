import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TeamContext } from "../context/TeamContent";
import axios from "axios"; // Import axios
import api from "../api/axiosConfig";

function TeamMembersScreen() {
  const navigate = useNavigate();
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  // New state to handle the loading status of the API call
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teamInfo.numPlayers === 0 || !teamInfo.teamName) {
      navigate("/details");
    }
    // Initialize with existing members if any, otherwise create empty slots
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

    setIsSubmitting(true); // Disable button and show loading state
    setError("");

    // Prepare the final data payload to send to the backend
    const finalTeamData = {
      ...teamInfo,
      members: members,
    };

    try {
      // --- THIS IS THE API CALL ---
      // Replace '/api/teams/create' with your actual backend endpoint
      const response = await api.post("/teams/create", finalTeamData);

      // Assuming the backend responds with the created team data
      console.log("Team created successfully:", response.data);

      // Update the context with the final member list
      updateTeamInfo({
        id: response.data._id, // The unique ID from MongoDB
        teamName: response.data.teamName,
        members: response.data.members,
        score: response.data.score,
      });

      // Navigate to the start of the hunt!
      navigate("/hub");
    } catch (apiError) {
      console.error("Failed to create team:", apiError);
      setError("Could not save the team. Please try again.");
      setIsSubmitting(false); // Re-enable the button on failure
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-amber-900 mb-6">
        Who's on the Team?
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* The dynamic inputs remain exactly the same */}
        {Array.from({ length: teamInfo.numPlayers }).map((_, index) => (
          <div key={index}>
            <label
              htmlFor={`player-${index}`}
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Player {index + 1}'s Name
            </label>
            <input
              type="text"
              id={`player-${index}`}
              value={members[index] || ""}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Enter Player ${index + 1}'s name`}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            />
          </div>
        ))}

        {error && (
          <p className="text-red-500 text-center text-sm mt-4">{error}</p>
        )}

        {/* The button is now aware of the submission state */}
        <button
          type="submit"
          disabled={isSubmitting} // Disable button while submitting
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-transform mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving Team..." : "Begin the Hunt!"}
        </button>
      </form>
    </div>
  );
}

export default TeamMembersScreen;
