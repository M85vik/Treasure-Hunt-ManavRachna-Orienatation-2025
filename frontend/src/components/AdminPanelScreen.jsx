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
    window.localStorage.removeItem("isAdminAuthenticated");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#131826] via-[#232946] to-[#0f2027] w-full">
      <div className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700/90 p-10 rounded-3xl shadow-2xl text-white text-center border border-gray-700/60">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 mb-10 drop-shadow-lg tracking-wide">
          Admin Control Panel
        </h1>

        <div className="space-y-5">
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-xl text-xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            🚦 Start Treasure Hunt
          </button>
          <button
            onClick={handleStop}
            className="w-full py-4 rounded-xl text-xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:from-red-500 hover:to-red-700 shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            🛑 Stop Treasure Hunt
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            className="w-full py-4 rounded-xl text-xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-700 shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            🏆 View Leaderboard
          </button>
        </div>

        <div className="mt-12 border-t border-gray-600 pt-6">
          <button
            onClick={handleLogout}
            className="text-base text-gray-400 hover:text-red-400 hover:underline transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
