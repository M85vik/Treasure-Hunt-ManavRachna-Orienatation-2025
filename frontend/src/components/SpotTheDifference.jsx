// src/components/SpotTheDifference.jsx
import React, { useState, useEffect } from "react";

// --- Data and Image URLs are the same ---
const DIFFERENCES = [
  { id: "light", x: 48, y: 7, radius: 2.5 },
  { id: "star", x: 49.5, y: 24, radius: 2.5 },
  { id: "gift", x: 19, y: 92, radius: 4 },
  { id: "shoe", x: 26, y: 88, radius: 2 },
  { id: "hairtie", x: 86.5, y: 44, radius: 2 },
  { id: "debris", x: 53, y: 92, radius: 3 },
];
const IMAGE_ORIGINAL_URL = "src/assets/original.png";
const IMAGE_MODIFIED_URL = "src/assets/changed.png";

// --- All your logic functions (useState, useEffect, handleImageClick, etc.) remain exactly the same ---
const SpotTheDifference = () => {
  const [found, setFound] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (found.length === DIFFERENCES.length) {
      setTimeout(() => setIsGameOver(true), 500);
    }
  }, [found]);

  const handleImageClick = (e) => {
    if (isGameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const foundDiff = DIFFERENCES.find((diff) => {
      if (found.includes(diff.id)) return false;
      const distance = Math.sqrt(
        Math.pow(diff.x - x, 2) + Math.pow(diff.y - y, 2)
      );
      return distance < diff.radius;
    });
    if (foundDiff) {
      setFound((prev) => [...prev, foundDiff.id]);
    } else {
      const clickId = Date.now();
      setClicks((prev) => [...prev, { x, y, id: clickId }]);
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== clickId));
      }, 700);
    }
  };

  const handleRestart = () => {
    setFound([]);
    setClicks([]);
    setIsGameOver(false);
  };

  // No changes needed to renderMarkers
  const renderMarkers = () => (
    <>
      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute border-2 border-red-500 rounded-full pointer-events-none animate-ping"
          style={{
            left: `${click.x}%`,
            top: `${click.y}%`,
            width: "40px",
            height: "40px",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      {found.map((id) => {
        const diff = DIFFERENCES.find((d) => d.id === id);
        return (
          <div
            key={id}
            className="absolute border-4 border-green-400 bg-green-400/20 rounded-full pointer-events-none shadow-lg"
            style={{
              left: `${diff.x}%`,
              top: `${diff.y}%`,
              width: `${diff.radius * 4}%`,
              height: `${diff.radius * 4}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </>
  );

  // --- THIS IS THE PART TO REPLACE ---
  return (
    <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center p-4">
      {isGameOver && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-8 text-center shadow-lg border-2 border-slate-600">
            <h2 className="text-5xl font-bold text-green-400 mb-4">You Win!</h2>
            <p className="text-slate-300 text-lg mb-6">
              You found all {DIFFERENCES.length} differences.
            </p>
            <button
              onClick={handleRestart}
              className="font-bold text-white py-3 px-8 rounded-lg bg-cyan-600 hover:bg-cyan-500"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      <header className="text-center my-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-300">
          Spot the Difference
        </h1>
        <p className="text-xl sm:text-2xl text-yellow-400 mt-2 font-semibold">
          Found: {found.length} / {DIFFERENCES.length}
        </p>
      </header>

      {/* This is the new, corrected layout container */}
      <div className="w-full flex flex-col md:flex-row gap-4 justify-center">
        {/* --- Container for the Original Image --- */}
        <div className="w-full md:w-1/2 relative">
          <img
            src={IMAGE_ORIGINAL_URL}
            alt="Original Scene"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {/* This overlay captures clicks and displays markers */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={handleImageClick}
          >
            {renderMarkers()}
          </div>
        </div>

        {/* --- Container for the Modified Image --- */}
        <div className="w-full md:w-1/2 relative">
          <img
            src={IMAGE_MODIFIED_URL}
            alt="Modified Scene"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {/* This overlay also captures clicks and displays markers */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={handleImageClick}
          >
            {renderMarkers()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotTheDifference;
