import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [gameStatus, setGameStatus] = useState("loading"); // 'loading', 'inactive', 'active', 'stopped'

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/game/status");
        setGameStatus(response.data.status);
      } catch (error) {
        console.error("Could not fetch game status", error);
        setGameStatus("error");
      }
    };
    fetchStatus();
  }, []);

  const renderContent = () => {
    switch (gameStatus) {
      case "loading":
        return (
          <p className="text-gray-700 mt-4 mb-8 animate-pulse">
            Connecting to the hunt...
          </p>
        );

      case "inactive":
        return (
          <>
            <p className="text-white-700 mt-4 mb-8">
              The Treasure Hunt has not started yet. Please wait for the admin's
              signal!
            </p>
            <button
              disabled
              className="w-full bg-gray-400/60 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg cursor-not-allowed"
            >
              Waiting to Start...
            </button>
          </>
        );

      case "active":
        return (
          <>
            <p className="text-white-700 mt-4 mb-8">
              The hunt is on! Gather your team and prepare for a challenge!
            </p>
            <button
              onClick={() => navigate("/details")}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-xl text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Adventure
            </button>
          </>
        );

      case "stopped":
        return (
          <>
            <p className="text-white-700 mt-4 mb-8">
              The Treasure Hunt has now ended. Thanks for playing!
            </p>
            <button
              onClick={() => navigate("/leaderboard")}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View Final Leaderboard
            </button>
          </>
        );

      case "error":
        return (
          <p className="text-red-600 font-bold mt-4 mb-8">
            Could not connect to the game server. Please try refreshing.
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center  bg-gradient-to-br from-[#131826] via-[#1f2937] to-[#111827] w-full pt-10 relative overflow-hidden">
      {/* Decorative floating shapes or gradients */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-amber-500 to-amber-700 rounded-full blur-3xl opacity-30 top-0 left-0 animate-pulse"></div>
      <div className="absolute w-60 h-60 bg-gradient-to-tr from-purple-400 to-indigo-600 rounded-full blur-3xl opacity-30 bottom-0 right-0 animate-pulse"></div>

      <div className="z-10 text-center px-4">
        <span
          className="block text-xl sm:text-lg md:text-xl font-semibold tracking-widest text-amber-400 uppercase mb-4  pb-20"
          style={{ fontFamily: "'Luckiest Guy', sans" }}
        >
          MRU Presents
        </span>

        <div className="bg-white/20 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 max-w-md mx-auto">
          <span className="text-6xl mb-4 inline-block">🧭</span>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg mb-2"
            style={{ fontFamily: "'Luckiest Guy', sans" }}
          >
            The Great Digital Treasure Hunt!
          </h1>

          {renderContent()}
        </div>
      </div>

      <div className="z-10 absolute bottom-0 pb-10 text-center">
        <Link
          to="/admin/login"
          className="  text-lg font-bold   text-amber-400 hover:text-amber-500 hover:underline transition-colors "
        >
          Admin Login
        </Link>
        <br />
        <Link
          to="/about"
          className="hover:text-blue-600 hover:underline transition-colors"
        >
          About Us
        </Link>
      </div>
    </div>
  );
}
