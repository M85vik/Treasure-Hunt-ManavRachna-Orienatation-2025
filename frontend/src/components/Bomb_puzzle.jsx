// src/components/Bomb_puzzle.jsx

import React, { useState, useEffect, useCallback } from "react";
import "../App.css";
// --- CONFIGURATION ---
const BOMB_CONFIG = {
  serialNumber: "A94-ZP1",
  batteryCount: 2,
  startTime: 300,
  pointsPerDefusal: 25,
};

const MODULES = {
  wires: "wires",
  keypad: "keypad",
  button: "button",
};

// --- HELPER COMPONENTS ---

const Strike = ({ isLit }) => (
  <div
    className={`w-8 h-2 rounded-full transition-colors ${
      isLit ? "bg-red-500 shadow-red-500/50 shadow-lg" : "bg-gray-600"
    }`}
  ></div>
);

const Timer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const timeColor =
    timeLeft <= 30 ? "text-red-500 animate-pulse" : "text-green-400";

  return (
    <div className="bg-black rounded-lg p-4 text-center font-mono">
      <div className={`text-8xl ${timeColor}`}>
        {minutes}:{seconds}
      </div>
    </div>
  );
};

const GameEndModal = ({ gameState }) => {
  if (gameState === "playing") return null;

  const isWin = gameState === "defused";
  const title = isWin ? "Bomb Defused!" : "Bomb Exploded!";
  const message = isWin
    ? `+${BOMB_CONFIG.pointsPerDefusal} Points!`
    : "Try Again!";

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 p-10 rounded-lg text-center border-4 border-gray-600 w-11/12 md:w-auto">
        <h2
          className={`text-5xl md:text-6xl font-bold mb-2 ${
            isWin ? "text-green-400" : "text-red-400"
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

// --- BOMB MODULE COMPONENTS ---
const WiresModule = ({ onDefuse, onStrike, isDefused }) => {
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
    if (index === 3) {
      onDefuse(MODULES.wires);
    } else {
      onStrike();
    }
  };

  return (
    <div
      className={`module-box ${
        isDefused ? "border-green-500" : "border-gray-600"
      }`}
    >
      <h3 className="module-title">Wires</h3>
      <div className="p-4 space-y-3">
        {wireColors.map((color, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            <button
              onClick={() => handleCut(i)}
              disabled={isDefused}
              className={`w-full h-8 rounded-md ${colorMap[color]} transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100`}
            >
              {cutWires[i] && (
                <div className="w-full h-1 bg-gray-700 transform rotate-12"></div>
              )}
            </button>
            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
          </div>
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
    if (pressed.length === 4) {
      if (JSON.stringify(pressed) === JSON.stringify(solution)) {
        onDefuse(MODULES.keypad);
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
      className={`module-box ${
        isDefused ? "border-green-500" : "border-gray-600"
      }`}
    >
      <h3 className="module-title">Keypad</h3>
      <div className="p-4 grid grid-cols-2 gap-4">
        {symbols.map((symbol) => (
          <button
            key={symbol}
            onClick={() => handlePress(symbol)}
            disabled={isDefused}
            className="h-20 bg-gray-200 text-gray-800 text-4xl font-bold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:hover:bg-gray-200"
          >
            {symbol}
          </button>
        ))}
      </div>
      <div className="bg-gray-900 h-10 mt-2 mx-4 rounded flex items-center justify-center text-2xl font-mono text-green-400 tracking-widest">
        {pressed.join("")}
      </div>
    </div>
  );
};

const ButtonModule = ({ onDefuse, isDefused }) => {
  const handleClick = () => {
    if (isDefused) return;
    onDefuse(MODULES.button);
  };
  return (
    <div
      className={`module-box ${
        isDefused ? "border-green-500" : "border-gray-600"
      }`}
    >
      <h3 className="module-title">The Button</h3>
      <div className="p-4 flex justify-center items-center">
        <button
          onClick={handleClick}
          disabled={isDefused}
          className="w-32 h-32 rounded-full bg-red-600 text-white text-2xl font-bold shadow-lg transform active:scale-95 transition-all disabled:bg-red-900 disabled:opacity-70"
        >
          HOLD
        </button>
      </div>
    </div>
  );
};

// --- MAIN BOMB PUZZLE COMPONENT ---
export default function BombPuzzle() {
  const [gameState, setGameState] = useState("playing");
  const [strikes, setStrikes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BOMB_CONFIG.startTime);
  const [playerScore, setPlayerScore] = useState(0);
  const [defusedModules, setDefusedModules] = useState({
    [MODULES.wires]: false,
    [MODULES.keypad]: false,
    [MODULES.button]: false,
  });

  const handleReset = useCallback(() => {
    setGameState("playing");
    setStrikes(0);
    setTimeLeft(BOMB_CONFIG.startTime);
    setDefusedModules({ wires: false, keypad: false, button: false });
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (strikes >= 3 || timeLeft <= 0) {
      setGameState("exploded");
    } else if (Object.values(defusedModules).every(Boolean)) {
      setGameState("defused");
      setPlayerScore((prevScore) => prevScore + BOMB_CONFIG.pointsPerDefusal);
    }
  }, [strikes, timeLeft, defusedModules, gameState]);

  useEffect(() => {
    if (gameState === "defused" || gameState === "exploded") {
      const resetTimer = setTimeout(() => {
        handleReset();
      }, 3000);
      return () => clearTimeout(resetTimer);
    }
  }, [gameState, handleReset]);

  const handleStrike = () => {
    if (gameState !== "playing") return;
    setStrikes((s) => s + 1);
  };
  const handleDefuse = (module) => {
    if (gameState !== "playing") return;
    setDefusedModules((prev) => ({ ...prev, [module]: true }));
  };

  return (
    <main className="bg-gray-900 text-white min-h-screen font-sans">
      <GameEndModal gameState={gameState} />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gray-800 p-4 md:p-8 border-r-4 border-gray-600">
          <div className="max-w-xl mx-auto">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-yellow-400">
                Bomb Control
              </h1>
              <div className="bg-gray-900 px-4 py-2 rounded-lg text-center">
                <span className="text-sm text-gray-400">SCORE</span>
                <p className="text-2xl font-bold text-green-400">
                  {playerScore}
                </p>
              </div>
              <div className="flex space-x-2">
                <Strike isLit={strikes > 0} />
                <Strike isLit={strikes > 1} />
                <Strike isLit={strikes > 2} />
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
        <div className="w-full md:w-1/2 bg-gray-200 text-gray-800 p-4 md:p-8">
          <div className="max-w-xl mx-auto prose prose-sm md:prose-base font-mono">
            <h2 className="text-gray-900">DEFUSAL MANUAL - TOP SECRET</h2>
            {/* ... Manual sections remain the same ... */}
            <section>
              <h3>On the Subject of Wires</h3>
              <ul>
                <li>
                  If the last wire is black and the last digit of the serial
                  number is odd, cut the fourth wire.
                </li>
                <li>
                  Otherwise, if there is exactly one red wire and more than one
                  yellow wire, cut the first wire.
                </li>
                <li>
                  Otherwise, if there are no black wires, cut the second wire.
                </li>
                <li>Otherwise, cut the first wire.</li>
              </ul>
            </section>
            <section>
              <h3>On the Subject of Keypads</h3>
              <p>
                Find the column containing all four symbols. Press them in the
                order shown for that column.
              </p>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th>Col 1</th>
                    <th>Col 2</th>
                    <th>Col 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>☺</td>
                    <td>©</td>
                    <td>★</td>
                  </tr>
                  <tr>
                    <td>Ψ</td>
                    <td>Ω</td>
                    <td>λ</td>
                  </tr>
                  <tr>
                    <td>¿</td>
                    <td>Φ</td>
                    <td>©</td>
                  </tr>
                  <tr>
                    <td>Ω</td>
                    <td>Ψ</td>
                    <td>Φ</td>
                  </tr>
                  <tr className="font-bold border-t-2 border-gray-400">
                    <td colSpan="3">Press Order:</td>
                  </tr>
                  <tr>
                    <td>1. Ψ</td>
                    <td>1. Φ</td>
                    <td>1. ★</td>
                  </tr>
                  <tr>
                    <td>2. ¿</td>
                    <td>2. Ψ</td>
                    <td>2. λ</td>
                  </tr>
                  <tr>
                    <td>3. ☺</td>
                    <td>3. Ω</td>
                    <td>3. Φ</td>
                  </tr>
                  <tr>
                    <td>4. Ω</td>
                    <td>4. ©</td>
                    <td>4. ©</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs mt-2">
                *Symbols for reference: Ψ (Pitchfork), Φ (Circle w/ line), © (C
                in circle), Ω (Horseshoe)*
              </p>
            </section>
            <section>
              <h3>On the Subject of The Button</h3>
              <ul>
                <li>
                  If the button is Blue and says "ABORT": Press and hold.
                  Release when timer has a 4.
                </li>
                <li>
                  If there is more than 1 battery and the button says
                  "DETONATE": Press and immediately release.
                </li>
                <li>
                  If the button is Red and says "HOLD": Press and immediately
                  release.
                </li>
                <li>
                  In all other cases: Press and hold. Release when timer has a
                  1.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
