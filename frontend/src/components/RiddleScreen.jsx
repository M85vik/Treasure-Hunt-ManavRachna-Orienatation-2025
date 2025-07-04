import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { TeamContext } from "../context/TeamContent";
import api from "../api/axiosConfig";

function RiddleScreen() {
  const { id } = useParams(); // Gets the 'id' from the URL (e.g., '/riddle/1')
  const navigate = useNavigate();

  const { riddles, solveRiddle } = useContext(GameContext);
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the specific riddle data based on the URL id
  const currentRiddle = riddles.find((r) => r.id === parseInt(id));

  // If the riddle is already unlocked, redirect back to the hub
  useEffect(() => {
    if (currentRiddle && currentRiddle.isUnlocked) {
      navigate(`/puzzle/${currentRiddle.id}`);
    }
  }, [currentRiddle, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passcode.trim() !== currentRiddle.passcode) {
      setError("The code is incorrect. The seal remains locked.");
      setPasscode("");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // 1. Award points by calling the backend
      const response = await api.post("/teams/score", {
        teamId: teamInfo.id,
        pointsToAdd: 25,
      });

      // 2. Update frontend state
      updateTeamInfo({ score: response.data.team.score }); // Update score in TeamContext
      solveRiddle(currentRiddle.id); // Mark riddle as solved in GameContext

      // 3. Navigate to the puzzle
      navigate(`/puzzle/${currentRiddle.id}`);
    } catch (apiError) {
      console.error("Failed to update score", apiError);
      setError("Could not connect to server to save score. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!currentRiddle) return <div>Riddle not found!</div>;

  return (
    // The background color is set dynamically!
    <div
      className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl text-center text-gray-800 ${currentRiddle.color}`}
    >
      <h2 className="text-2xl font-bold mb-6">
        The Riddle of Seal #{currentRiddle.id}
      </h2>

      <p className="text-xl sm:text-2xl italic leading-relaxed mb-8">
        "{currentRiddle.riddle}"
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
        <label htmlFor="passcode" className="block font-bold mb-2">
          Enter the 4-Digit Passcode
        </label>
        <input
          type="number" // Using type="number" can bring up numeric keyboard on mobile
          id="passcode"
          value={passcode}
          onChange={(e) => {
            // Only allow 4 digits
            if (e.target.value.length <= 4) {
              setPasscode(e.target.value);
            }
            setError(""); // Clear error on new input
          }}
          className="w-full p-3 text-center text-2xl tracking-[.5em] font-mono border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none"
          placeholder="----"
          required
        />

        {error && <p className="text-red-700 font-bold mt-4">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-transform"
        >
          {isSubmitting ? "Verifying..." : "Attempt to Unlock"}
        </button>
      </form>
    </div>
  );
}

export default RiddleScreen;
