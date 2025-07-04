import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function AdminPanelScreen() {
  const navigate = useNavigate();

  const handleStart = async () => {
    if (
      window.confirm(
        "Are you sure you want to start the treasure hunt for all players?"
      )
    ) {
      try {
        const response = await api.post("/game/start");
        alert(response.data.message);
      } catch (error) {
        alert("Failed to start the game. Check the server.");
      }
    }
  };

  const handleStop = async () => {
    if (window.confirm("WARNING: This will stop the hunt. Are you sure?")) {
      try {
        const response = await api.post("/game/stop");
        alert(response.data.message);
      } catch (error) {
        alert("Failed to stop the game. Check the server.");
      }
    }
  };

  const handleLogout = () => {
    // Remove the authentication flag and redirect to login
    window.localStorage.removeItem("isAdminAuthenticated");
    navigate("/admin/login");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800/90 p-8 rounded-2xl shadow-2xl text-white text-center">
      <h1 className="text-3xl font-bold text-yellow-300 mb-8">
        Admin Control Panel
      </h1>

      <div className="space-y-4">
        <button
          onClick={handleStart}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-xl"
        >
          Start Treasure Hunt
        </button>
        <button
          onClick={handleStop}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg text-xl"
        >
          Stop Treasure Hunt
        </button>
        <button
          onClick={() => navigate("/leaderboard")}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg text-xl"
        >
          View Leaderboard
        </button>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-400 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
