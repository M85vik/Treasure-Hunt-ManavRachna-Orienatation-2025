import React, { createContext, useState, useEffect } from "react";
import { riddleData } from "../data/riddleData";
export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [riddles, setRiddles] = useState(() => {
    try {
      const saved = window.localStorage.getItem("treasureHuntGameProgress");
      return saved ? JSON.parse(saved) : riddleData;
    } catch {
      return riddleData;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(
      "treasureHuntGameProgress",
      JSON.stringify(riddles)
    );
  }, [riddles]);
  const solveRiddle = (riddleId) => {
    setRiddles((p) =>
      p.map((r) => (r.id === riddleId ? { ...r, isRiddleSolved: true } : r))
    );
  };
  const solvePuzzle = (riddleId) => {
    setRiddles((p) =>
      p.map((r) => (r.id === riddleId ? { ...r, isPuzzleSolved: true } : r))
    );
  };
  return (
    <GameContext.Provider value={{ riddles, solveRiddle, solvePuzzle }}>
      {children}
    </GameContext.Provider>
  );
};
