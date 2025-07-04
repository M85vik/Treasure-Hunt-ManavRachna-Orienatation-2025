import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";

export default function RiddleScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { riddles, solveRiddle } = useContext(GameContext);

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  // Find the data for the current riddle from the URL id
  const currentRiddle = riddles.find((r) => r.id === parseInt(id));

  // If the riddle data can't be found, show an error.
  if (!currentRiddle) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-red-600">Error</h1>
        <p className="text-gray-700 mt-2">Riddle with ID "{id}" not found.</p>
        <Link
          to="/hub"
          className="mt-4 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Return to Hub
        </Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim() !== currentRiddle.passcode) {
      setError("The code is incorrect. The seal remains locked.");
      setPasscode("");
      return;
    }

    // Mark the riddle as solved in our game state
    solveRiddle(currentRiddle.id);

    // Navigate to the puzzle, adding it to the browser history.
    navigate(`/puzzle/${currentRiddle.id}`);
  };

  // --- This section handles what to show based on the riddle's state ---

  // A) If the entire puzzle path is complete (riddle & puzzle solved)
  if (currentRiddle.isPuzzleSolved) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl text-center bg-green-200">
        <h2 className="text-2xl font-bold mb-6">
          Seal #{currentRiddle.id} is Unlocked!
        </h2>
        <p className="text-xl">You have already solved this puzzle.</p>
        <Link
          to="/hub"
          className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-xl"
        >
          Return to Hub
        </Link>
      </div>
    );
  }

  // B) If the riddle is solved but the puzzle isn't, give a direct link to the puzzle.
  if (currentRiddle.isRiddleSolved) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl text-center bg-yellow-200">
        <h2 className="text-2xl font-bold mb-6">
          Riddle for Seal #{currentRiddle.id} is Solved!
        </h2>
        <p className="text-xl">The path to the puzzle is open.</p>
        <Link
          to={`/puzzle/${currentRiddle.id}`}
          className="inline-block mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-xl"
        >
          Go to Puzzle #{currentRiddle.id}
        </Link>
      </div>
    );
  }

  // C) Default view: The riddle is unsolved. Show the riddle and input form.
  return (
    <div
      className={`w-full max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl text-gray-800 ${currentRiddle.color}`}
    >
      <div className="text-left mb-4">
        <Link to="/hub" className="text-sm text-blue-700 hover:underline">
          ← Back to Hub
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        The Riddle of Seal #{currentRiddle.id}
      </h2>
      <p className="text-xl sm:text-2xl italic leading-relaxed mb-8 text-center">
        "{currentRiddle.riddle}"
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
        <label htmlFor="passcode" className="block font-bold mb-2 text-center">
          Enter the 4-Digit Passcode
        </label>
        <input
          type="number"
          id="passcode"
          value={passcode}
          onChange={(e) => {
            if (e.target.value.length <= 4) setPasscode(e.target.value);
            setError("");
          }}
          className="w-full p-3 text-center text-2xl tracking-[.5em] font-mono border-2 border-gray-500 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none"
          placeholder="----"
          required
        />
        {error && (
          <p className="text-red-700 font-bold mt-4 text-center">{error}</p>
        )}
        <button
          type="submit"
          className="w-full mt-6 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-transform"
        >
          Unlock Puzzle
        </button>
      </form>
    </div>
  );
}
