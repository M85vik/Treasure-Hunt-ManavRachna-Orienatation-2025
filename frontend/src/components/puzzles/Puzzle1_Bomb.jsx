import React, { useState, useEffect, useCallback, useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { TeamContext } from "../../context/TeamContent";
import api from "../../api/axiosConfig";

// --- PUZZLE CONFIGURATION ---
const BOMB_CONFIG = {
  riddleId: 1,
  startTime: 300,
  strikesAllowed: 3,
  pointsPerDefusal: 25,
  serialNumber: "A94-ZP1",
  batteryCount: 2,
};

// --- UI SUB-COMPONENTS ---
const Timer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const timeColor =
    timeLeft <= 30 ? "text-red-500 animate-pulse" : "text-lime-400";
  return (
    <div className="bg-black rounded-lg p-4 text-center font-mono">
      <div className={`text-8xl ${timeColor}`}>
        {minutes}:{seconds}
      </div>
    </div>
  );
};
const StrikeIndicator = ({ count, max }) => (
  <div className="flex space-x-2">
    {Array.from({ length: max }).map((_, i) => (
      <div
        key={i}
        className={`w-8 h-2 rounded-full transition-colors ${
          i < count ? "bg-red-500 shadow-red-500/50 shadow-lg" : "bg-gray-600"
        }`}
      ></div>
    ))}
  </div>
);
const GameEndModal = ({ gameState }) => {
  if (gameState === "playing") return null;
  const isWin = gameState === "defused";
  const title = isWin ? "Bomb Defused!" : "Bomb Exploded!";
  const message = isWin
    ? `+${BOMB_CONFIG.pointsPerDefusal} Points!`
    : "Try Again!";
  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-10 rounded-lg text-center border-4 border-gray-600 w-11/12 md:w-auto">
        <h2
          className={`text-5xl md:text-6xl font-bold mb-2 ${
            isWin ? "text-lime-400" : "text-red-500"
          }`}
        >
          {title}
        </h2>
        <p className="text-xl md:text-2xl text-yellow-300 font-semibold">
          {message}
        </p>
      </div>
    </div>
  );
};
const WiresModule = ({ onDefuse, onStrike, isDefused }) => {
  const correctWireIndex = 3;
  const wireColors = ["Red", "Blue", "Yellow", "White", "Black"];
  const colorMap = {
    Red: "bg-red-500",
    Blue: "bg-blue-500",
    Yellow: "bg-yellow-400",
    White: "bg-white",
    Black: "bg-black",
  };
  const [cutWires, setCutWires] = useState([false, false, false, false, false]);
  const handleCut = (index) => {
    if (isDefused || cutWires[index]) return;
    const newCutWires = [...cutWires];
    newCutWires[index] = true;
    setCutWires(newCutWires);
    if (index === correctWireIndex) {
      onDefuse("wires");
    } else {
      onStrike();
    }
  };
  return (
    <div
      className={`p-4 rounded-lg bg-gray-700 border-2 ${
        isDefused ? "border-lime-500" : "border-gray-600"
      }`}
    >
      <h3 className="font-bold text-lg mb-3 text-yellow-300">Wires</h3>
      <div className="space-y-3">
        {wireColors.map((color, i) => (
          <button
            key={i}
            onClick={() => handleCut(i)}
            disabled={isDefused}
            className={`w-full h-8 rounded-md ${colorMap[color]} transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
          >
            {cutWires[i] && (
              <div className="w-full h-1 bg-gray-800 transform rotate-12"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
const KeypadModule = ({ onDefuse, onStrike, isDefused }) => {
  const symbols = ["Ψ", "Φ", "©", "Ω"];
  const solution = ["Φ", "Ψ", "Ω", "©"];
  const [pressed, setPressed] = useState([]);
  useEffect(() => {
    if (pressed.length === solution.length) {
      if (JSON.stringify(pressed) === JSON.stringify(solution)) {
        onDefuse("keypad");
      } else {
        onStrike();
        setPressed([]);
      }
    }
  }, [pressed, onDefuse, onStrike, solution]);
  const handlePress = (symbol) => {
    if (isDefused) return;
    setPressed((prev) => [...prev, symbol]);
  };
  return (
    <div
      className={`p-4 rounded-lg bg-gray-700 border-2 ${
        isDefused ? "border-lime-500" : "border-gray-600"
      }`}
    >
      <h3 className="font-bold text-lg mb-3 text-yellow-300">Keypad</h3>
      <div className="grid grid-cols-2 gap-4">
        {symbols.map((symbol) => (
          <button
            key={symbol}
            onClick={() => handlePress(symbol)}
            disabled={isDefused}
            className="h-20 bg-gray-200 text-gray-800 text-4xl font-bold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            {symbol}
          </button>
        ))}
      </div>
      <div className="bg-gray-900 h-10 mt-2 mx-4 rounded flex items-center justify-center text-2xl font-mono text-lime-400 tracking-widest">
        {pressed.join("")}
      </div>
    </div>
  );
};
const ButtonModule = ({ onDefuse, isDefused }) => {
  const handleClick = () => {
    if (isDefused) return;
    onDefuse("button");
  };
  return (
    <div
      className={`p-4 rounded-lg bg-gray-700 border-2 ${
        isDefused ? "border-lime-500" : "border-gray-600"
      }`}
    >
      <h3 className="font-bold text-lg mb-3 text-yellow-300">The Button</h3>
      <div className="p-4 flex justify-center items-center">
        <button
          onClick={handleClick}
          disabled={isDefused}
          className="w-32 h-32 rounded-full bg-red-600 text-white text-2xl font-bold shadow-lg transform active:scale-95 transition-all disabled:bg-red-900"
        >
          HOLD
        </button>
      </div>
    </div>
  );
};
const Manual = () => (
  <div className="bg-gray-200 text-gray-800 p-4 md:p-8 h-full">
    <div className="max-w-xl mx-auto prose prose-sm md:prose-base font-mono">
      <h2 className="text-gray-900">DEFUSAL MANUAL - TOP SECRET</h2>
      <section>
        <h3>On the Subject of Wires</h3>
        <p>
          A simple configuration. If the last digit of the serial number (1) is
          odd, cut the fourth wire.
        </p>
        <p className="font-bold text-sm">
          Solution: Cut the 4th wire from the top.
        </p>
      </section>
      <section>
        <h3>On the Subject of Keypads</h3>
        <p>
          The symbols are familiar. They must be pressed in the order they
          appeared in the ancient prophecy: first the Circle with a line, then
          the Pitchfork, followed by the Horseshoe, and finally the C in a
          circle.
        </p>
        <p className="font-bold text-sm">
          Solution: Press Φ, then Ψ, then Ω, then ©.
        </p>
      </section>
      <section>
        <h3>On the Subject of The Button</h3>
        <p>
          If the button is Red and says "HOLD", and there are 2 batteries, the
          manual says to press and immediately release the button.
        </p>
        <p className="font-bold text-sm">Solution: Click the button once.</p>
      </section>
    </div>
  </div>
);

// --- MAIN PUZZLE COMPONENT (CORRECTED) ---
export default function Puzzle1_Bomb({ onComplete }) {
  const { solvePuzzle } = useContext(GameContext);
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  const [gameState, setGameState] = useState("playing");
  const [strikes, setStrikes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BOMB_CONFIG.startTime);
  const [defusedModules, setDefusedModules] = useState({
    wires: false,
    keypad: false,
    button: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWinSequence = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    solvePuzzle(BOMB_CONFIG.riddleId);
    try {
      const response = await api.post("/teams/score", {
        teamId: teamInfo.id,
        pointsToAdd: BOMB_CONFIG.pointsPerDefusal,
      });
      updateTeamInfo({ score: response.data.team.score });
    } catch (error) {
      console.error("Failed to save score!", error);
    }
  }, [isSubmitting, solvePuzzle, teamInfo.id, updateTeamInfo]);

  const handleReset = useCallback(() => {
    setGameState("playing");
    setStrikes(0);
    setTimeLeft(BOMB_CONFIG.startTime);
    setDefusedModules({ wires: false, keypad: false, button: false });
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (Object.values(defusedModules).every(Boolean)) {
      setGameState("defused");
    } else if (strikes >= BOMB_CONFIG.strikesAllowed || timeLeft <= 0) {
      setGameState("exploded");
    }
  }, [strikes, timeLeft, defusedModules, gameState]);

  // --- THIS IS THE CORRECTED LOGIC ---
  useEffect(() => {
    if (gameState === "defused") {
      // On a WIN, call the win sequence and navigate away.
      handleWinSequence();
      const timer = setTimeout(() => onComplete(), 4000);
      return () => clearTimeout(timer);
    }

    if (gameState === "exploded") {
      // On a LOSS, show the modal and then reset the puzzle.
      // Crucially, it does NOT call onComplete(), so the user stays on the page.
      const timer = setTimeout(() => handleReset(), 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, onComplete, handleReset, handleWinSequence]);

  const handleStrike = () => {
    if (gameState !== "playing") return;
    setStrikes((s) => s + 1);
  };
  const handleDefuse = (moduleName) => {
    if (gameState !== "playing") return;
    setDefusedModules((prev) => ({ ...prev, [moduleName]: true }));
  };

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
