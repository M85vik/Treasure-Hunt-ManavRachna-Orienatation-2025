import React, { createContext, useState } from "react";
import { riddleData } from "../data/riddleData";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [riddles, setRiddles] = useState(riddleData);

  // Mark a riddle as solved (passcode entered correctly)
  const solveRiddle = (riddleId) => {
    setRiddles((prevRiddles) =>
      prevRiddles.map((riddle) =>
        riddle.id === riddleId ? { ...riddle, isRiddleSolved: true } : riddle
      )
    );
  };

  // Mark a puzzle as completed (the final step)
  const solvePuzzle = (riddleId) => {
    setRiddles((prevRiddles) =>
      prevRiddles.map((riddle) =>
        riddle.id === riddleId ? { ...riddle, isPuzzleSolved: true } : riddle
      )
    );
  };

  // Renamed old function and added a new one
  return (
    <GameContext.Provider value={{ riddles, solveRiddle, solvePuzzle }}>
      {children}
    </GameContext.Provider>
  );
};
