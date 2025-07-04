import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// We will create these puzzle components in the next steps
// import Puzzle1 from './puzzles/Puzzle1';
// import Puzzle2 from './puzzles/Puzzle2';

function PuzzleScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  // This function will be passed to each puzzle component
  const onPuzzleComplete = () => {
    alert("Puzzle solved! Returning to the Hub.");
    // The actual state update will happen inside the puzzle component itself
    navigate("/hub");
  };

  const renderPuzzle = () => {
    switch (parseInt(id)) {
      case 1:
        // return <Puzzle1 onComplete={onPuzzleComplete} />;
        return <div>Placeholder for Puzzle #1</div>; // Placeholder
      case 2:
        return <div>Placeholder for Puzzle #2</div>;
      case 3:
        return <div>Placeholder for Puzzle #3</div>;
      case 4:
        return <div>Placeholder for Puzzle #4</div>;
      case 5:
        return <div>Placeholder for Puzzle #5</div>;
      case 6:
        return <div>Placeholder for Puzzle #6</div>;
      default:
        return <div>Invalid Puzzle ID.</div>;
    }
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-white/90 rounded-2xl shadow-xl">
      {renderPuzzle()}
    </div>
  );
}

export default PuzzleScreen;
