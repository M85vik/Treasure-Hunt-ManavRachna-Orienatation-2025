import React from "react";
import { useNavigate } from "react-router-dom";

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center">
      <span className="text-6xl mb-4 inline-block">🧭</span>
      <h1
        className="text-4xl font-bold text-amber-900 drop-shadow-lg"
        style={{ fontFamily: "'Luckiest Guy', cursive" }}
      >
        The Great Digital Treasure Hunt!
      </h1>
      <p className="text-gray-600 mt-4 mb-8">
        Welcome, brave adventurers! Your quest for glory and riches awaits.
        Gather your team and prepare for a challenge!
      </p>
      <button
        onClick={() => navigate("/details")} // Navigate to the details route on click
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-transform"
      >
        Start Your Adventure
      </button>
    </div>
  );
}
// Reminder: Add the "Luckiest Guy" font to your public/index.html <head> tag for this to work.

export default WelcomeScreen;
