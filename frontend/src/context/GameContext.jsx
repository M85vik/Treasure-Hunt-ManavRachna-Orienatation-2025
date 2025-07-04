import React, { createContext, useState, useEffect } from "react";
import { riddleData } from "../data/riddleData";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // --- THIS IS THE FIX ---
  // Same localStorage pattern for the game progress.
  const [riddles, setRiddles] = useState(() => {
    try {
      const savedRiddles = window.localStorage.getItem(
        "treasureHuntGameProgress"
      );
      return savedRiddles ? JSON.parse(savedRiddles) : riddleData;
    } catch (error) {
      console.error("Error parsing game progress from localStorage", error);
      return riddleData;
    }
  });

  // --- THIS IS THE OTHER PART OF THE FIX ---
  // Save progress whenever the riddles state changes.
  useEffect(() => {
    window.localStorage.setItem(
      "treasureHuntGameProgress",
      JSON.stringify(riddles)
    );
  }, [riddles]);

  const solveRiddle = (riddleId) => {
    setRiddles((prevRiddles) =>
      prevRiddles.map((riddle) =>
        riddle.id === riddleId ? { ...riddle, isRiddleSolved: true } : riddle
      )
    );
  };

  const solvePuzzle = (riddleId) => {
    setRiddles((prevRiddles) =>
      prevRiddles.map((riddle) =>
        riddle.id === riddleId ? { ...riddle, isPuzzleSolved: true } : riddle
      )
    );
  };

  return (
    <GameContext.Provider value={{ riddles, solveRiddle, solvePuzzle }}>
      {children}
    </GameContext.Provider>
  );
};
