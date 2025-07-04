import React, { useState, useEffect, useCallback, useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { TeamContext } from "../../context/TeamContent";
import api from "../../api/axiosConfig";

const BOMB_CONFIG = {
  riddleId: 1,
  startTime: 300,
  strikesAllowed: 3,
  pointsPerDefusal: 25,
  serialNumber: "A94-ZP1",
  batteryCount: 2,
};

// --- UI SUB-COMPONENTS (Timer, StrikeIndicator, etc.) can remain the same ---

export default function Puzzle1_Bomb({ onComplete }) {
  const { solvePuzzle } = useContext(GameContext);
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  const [gameState, setGameState] = useState("playing"); // 'playing', 'defused', 'exploded'
  const [strikes, setStrikes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BOMB_CONFIG.startTime);
  const [defusedModules, setDefusedModules] = useState({
    wires: false,
    keypad: false,
    button: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Core Game Logic ---
  useEffect(() => {
    if (gameState !== "playing") return;

    // Check for a win condition
    if (Object.values(defusedModules).every(Boolean)) {
      setGameState("defused");
      return;
    }
    // Check for a loss condition
    if (strikes >= BOMB_CONFIG.strikesAllowed || timeLeft <= 0) {
      setGameState("exploded");
      return;
    }
    // Timer countdown
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [gameState, strikes, timeLeft, defusedModules]);

  // --- THIS IS THE NEW, SIMPLIFIED NAVIGATION & SCORING LOGIC ---
  useEffect(() => {
    // This effect runs only when the game is won or lost.
    if (gameState === "defused") {
      // 1. If WIN, mark puzzle as solved and save score.
      const handleWin = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        solvePuzzle(BOMB_CONFIG.riddleId); // Mark as complete on frontend
        try {
          const response = await api.post("/teams/score", {
            teamId: teamInfo.id,
            pointsToAdd: BOMB_CONFIG.pointsPerDefusal,
          });
          updateTeamInfo({ score: response.data.team.score });
        } catch (error) {
          console.error("Failed to save score!", error);
        }
      };
      handleWin();
    }

    // 2. REGARDLESS of win or loss, if the game is over, navigate back to the hub.
    if (gameState === "defused" || gameState === "exploded") {
      const timer = setTimeout(() => {
        onComplete(); // Go back to the hub
      }, 4000); // Wait 4 seconds to show the modal
      return () => clearTimeout(timer);
    }
  }, [
    gameState,
    isSubmitting,
    onComplete,
    solvePuzzle,
    teamInfo.id,
    updateTeamInfo,
  ]);

  const handleStrike = () => setStrikes((s) => s + 1);
  const handleDefuse = (moduleName) =>
    setDefusedModules((prev) => ({ ...prev, [moduleName]: true }));

  return (
    <div className="bg-gray-900 text-white w-full font-sans">
      <GameEndModal gameState={gameState} />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gray-800 p-4 md:p-8 border-r-4 border-gray-600">
          <div className="max-w-xl mx-auto">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-yellow-300">
                Puzzle 1: Bomb Defusal
              </h1>
              <div className="text-center">
                <span className="text-sm text-gray-400">STRIKES</span>
                <StrikeIndicator
                  count={strikes}
                  max={BOMB_CONFIG.strikesAllowed}
                />
              </div>
            </header>
            <Timer timeLeft={timeLeft} />
            <div className="bg-gray-700 p-4 rounded-lg my-6 font-mono text-center">
              <p>
                Serial #:{" "}
                <span className="text-yellow-300">
                  {BOMB_CONFIG.serialNumber}
                </span>
              </p>
              <p>
                Batteries:{" "}
                <span className="text-yellow-300">
                  {BOMB_CONFIG.batteryCount}
                </span>
              </p>
            </div>
            <div className="space-y-6">
              <WiresModule
                onDefuse={handleDefuse}
                onStrike={handleStrike}
                isDefused={defusedModules.wires}
              />
              <KeypadModule
                onDefuse={handleDefuse}
                onStrike={handleStrike}
                isDefused={defusedModules.keypad}
              />
              <ButtonModule
                onDefuse={handleDefuse}
                isDefused={defusedModules.button}
              />
            </div>
          </div>
        </div>
        <Manual />
      </div>
    </div>
  );
}
