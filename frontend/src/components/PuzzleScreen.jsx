import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Import all your puzzle components
import Puzzle1_Bomb from "./puzzles/Puzzle1_Bomb";
import Puzzle2_Chemistry from "./puzzles/Puzzle2_Chemistry";
import Puzzle3_Cryptogram from "./puzzles/Puzzle3_Cryptogram";
import Puzzle4_EmojiEnigma from "./puzzles/Puzzle4_EmojiEnigma";
import Puzzle5_MasterThief from "./puzzles/Puzzle5_MasterThief";
import Puzzle6_MorseCode from "./puzzles/Puzzle6_MorseCode";

export default function PuzzleScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  // This function is passed to each puzzle component to call upon successful completion.
  const onPuzzleComplete = () => {
    navigate("/hub");
  };

  // This function selects which puzzle to render based on the URL ID.
  const renderPuzzle = () => {
    switch (parseInt(id)) {
      case 1:
        return <Puzzle1_Bomb />;
      case 2:
        return <Puzzle2_Chemistry onComplete={onPuzzleComplete} />;
      case 3:
        return <Puzzle3_Cryptogram onComplete={onPuzzleComplete} />;
      case 4:
        return <Puzzle4_EmojiEnigma onComplete={onPuzzleComplete} />;
      case 5:
        return <Puzzle5_MasterThief onComplete={onPuzzleComplete} />;
      case 6:
        return <Puzzle6_MorseCode onComplete={onPuzzleComplete} />;
      default:
        // A fallback for invalid puzzle IDs.
        return (
          <div className="text-center p-8 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-red-600">Error</h1>
            <p className="text-gray-700 mt-2">
              Puzzle with ID "{id}" not found.
            </p>
            <button
              onClick={() => navigate("/hub")}
              className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Return to Hub
            </button>
          </div>
        );
    }
  };

  return (
    // The main container is made relative to position the back button.
    <div className="w-full h-full relative">
      {/* Universal "Exit" button for all puzzles */}
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/hub"
          className="bg-black/50 hover:bg-black/80 text-white font-bold py-2 px-4 rounded-lg backdrop-blur-sm transition-colors"
        >
          ← Exit to Hub
        </Link>
      </div>

      {/* The container that renders the selected puzzle */}
      <div className="w-full h-full flex items-center justify-center">
        {renderPuzzle()}
      </div>
    </div>
  );
}
