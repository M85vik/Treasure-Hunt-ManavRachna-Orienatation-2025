import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function WelcomeScreen() {
  console.log(import.meta.env.VITE_API_URL);

  const navigate = useNavigate();
  // State to hold the game status from the backend
  const [gameStatus, setGameStatus] = useState("loading"); // 'loading', 'inactive', 'active', 'stopped'

  // This effect runs when the component mounts to get the current game status.
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/game/status");
        setGameStatus(response.data.status);
      } catch (error) {
        console.error("Could not fetch game status", error);
        setGameStatus("error"); // A special state for connection errors
      }
    };
    fetchStatus();
  }, []); // Empty array means it runs only once.

  // --- This is the new conditional rendering logic ---
  const renderContent = () => {
    switch (gameStatus) {
      case "loading":
        return (
          <p className="text-gray-600 mt-4 mb-8">Connecting to the hunt...</p>
        );

      case "inactive":
        return (
          <>
            <p className="text-gray-600 mt-4 mb-8">
              The Treasure Hunt has not started yet. Please wait for the admin's
              signal!
            </p>
            <button
              disabled
              className="w-full bg-gray-400 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg cursor-not-allowed"
            >
              Waiting to Start...
            </button>
          </>
        );

      case "active":
        return (
          <>
            <p className="text-gray-600 mt-4 mb-8">
              The hunt is on! Gather your team and prepare for a challenge!
            </p>
            <button
              onClick={() => navigate("/details")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-transform"
            >
              Start Your Adventure
            </button>
          </>
        );

      case "stopped":
        return (
          <>
            <p className="text-gray-600 mt-4 mb-8">
              The Treasure Hunt has now ended. Thanks for playing!
            </p>
            <button
              onClick={() => navigate("/leaderboard")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-transform"
            >
              View Final Leaderboard
            </button>
          </>
        );

      case "error":
        return (
          <p className="text-red-500 font-bold mt-4 mb-8">
            Could not connect to the game server. Please try refreshing.
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center">
      <span className="text-6xl mb-4 inline-block">🧭</span>
      <h1
        className="text-4xl font-bold text-amber-900 drop-shadow-lg"
        style={{ fontFamily: "'Luckiest Guy', cursive" }}
      >
        The Great Digital Treasure Hunt!
      </h1>

      {/* Render the appropriate content based on game status */}
      {renderContent()}

      {/* The Admin Login link is always visible */}
      <div className="mt-8 text-center">
        <Link
          to="/admin/login"
          className="text-sm text-gray-500 hover:text-blue-600 hover:underline transition-colors"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
}
