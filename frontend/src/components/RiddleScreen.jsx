import React, { useContext, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { GameContext } from "../context/GameContext";

export default function RiddleScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { riddles, solveRiddle } = useContext(GameContext);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const currentRiddle = riddles.find((r) => r.id === parseInt(id));
  if (!currentRiddle) return <div>Riddle not found!</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim() !== currentRiddle.passcode) {
      setError("The code is incorrect.");
      setPasscode("");
      return;
    }
    solveRiddle(currentRiddle.id);
    navigate(`/puzzle/${currentRiddle.id}`);
  };

  if (currentRiddle.isPuzzleSolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 px-4">
        <div className="w-full max-w-2xl p-8 rounded-3xl bg-white/30 backdrop-blur-md shadow-2xl text-center border border-white/10">
          <h2 className="text-3xl font-bold text-green-800 mb-6">
            Seal #{currentRiddle.id} is Unlocked!
          </h2>
          <p className="text-xl text-green-900">
            You have already solved this puzzle.
          </p>
          <Link
            to="/hub"
            className="inline-block mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-xl transform hover:scale-105 transition-all"
          >
            ← Return to Hub
          </Link>
        </div>
      </div>
    );
  }

  if (currentRiddle.isRiddleSolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-violet-700 to-purple-500 px-4">
        <div className="w-full max-w-2xl p-8 rounded-3xl bg-white/30 backdrop-blur-md shadow-2xl text-center border border-white/10">
          <h2 className="text-2xl font-bold text-white  mb-6">
            Riddle for Seal #{currentRiddle.id} is Solved!
          </h2>
          <p className="text-xl text-white">The path to the puzzle is open.</p>
          <Link
            to={`/puzzle/${currentRiddle.id}`}
            className="inline-block mt-6 bg-gradient-to-r from-green-800 to-purple-600 hover:from-green-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-xl transform hover:scale-105 transition-all"
          >
            Go to Puzzle #{currentRiddle.id} →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#131826] via-[#1f2937] to-[#111827] relative overflow-hidden px-4">
      {/* Floating shapes */}
      <div className="absolute w-72 h-72 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-60 h-60 bg-gradient-to-tr from-green-500 to-lime-500  rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="relative w-full max-w-2xl p-8 rounded-3xl bg-white/20 backdrop-blur-md shadow-2xl border border-white/10 z-10">
        <div className="text-left mb-4">
          <Link
            to="/hub"
            className="text-sm text-green-300 hover:underline transition-colors"
          >
            ← Back
          </Link>
        </div>
        <h2
          className="text-2xl font-bold text-center bg-gradient-to-r from-green-400 via-lime-400 to-green-500 bg-clip-text text-transparent drop-shadow-lg mb-6"
          // style={{ fontFamily: "'Luckiest Guy', sans" }}
        >
          The Riddle of Seal #{currentRiddle.id}
        </h2>
        <p className="text-xl sm:text-2xl italic leading-relaxed mb-8 text-center text-gray-100">
          "{currentRiddle.riddle}"
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
          <label
            htmlFor="passcode"
            className="block font-bold mb-2 text-center text-white"
          >
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
            className="w-full p-3 text-center text-2xl tracking-[.5em] font-mono border-2 border-white/30 rounded-lg  bg-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
            placeholder="----"
            required
          />
          {error && (
            <p className="text-red-500 font-bold mt-4 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white font-bold py-3 px-6 rounded-xl text-xl shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Unlock Puzzle
          </button>
        </form>
      </div>
    </div>
  );
}
