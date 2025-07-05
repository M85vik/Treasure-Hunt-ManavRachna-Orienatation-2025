// import React, { useState, useEffect, useCallback, useContext } from "react";
// import { GameContext } from "../../context/GameContext";
// import { TeamContext } from "../../context/TeamContent";
// import api from "../../api/axiosConfig";

// // --- PUZZLE CONFIGURATION ---
// const PUZZLE_CONFIG = {
//   riddleId: 4,
//   pointsPerWin: 25,
// };

// // --- DYNAMIC PUZZLE ENGINE (USING YOUR PROVIDED RULES AND EMOJIS) ---
// const EMOJI_POOL = ["🚀", "☀️", "🔑", "❤️", "⚙️", "💎", "⏰", "⚡️"];
// const DECRYPTION_RULES = [
//   "🚀 (Rocket): Its value is its position in the sequence (1, 2, 3, or 4).",
//   "☀️ (Sun): If the sequence contains a ❤️, its value is 5. Otherwise, its value is 8.",
//   "🔑 (Key): Its value is the number of sides on the shape next to the keypad (a Hexagon).",
//   "❤️ (Heart): Its value is the LAST digit of your current SCORE. (If score is 0, value is 0).",
//   "⚙️ (Gear): Its value is the number of 'mechanical' emojis (🚀, ⚙️, ⏰) in the sequence.",
//   "💎 (Diamond): Its value is always 3.",
//   "⏰ (Clock): Its value is the FIRST digit of your current SCORE. (If score is 0, value is 0).",
//   "⚡️ (Lightning): Its value is the total count of 'energy' emojis (☀️, ⚡️) in the sequence.",
// ];

// const calculateDigit = (emoji, index, sequence, score) => {
//   const scoreStr = score.toString();
//   switch (emoji) {
//     case "🚀":
//       return index + 1;
//     case "☀️":
//       return sequence.includes("❤️") ? 5 : 8;
//     case "🔑":
//       return 6; // Hexagon has 6 sides
//     case "❤️":
//       return parseInt(scoreStr.slice(-1), 10);
//     case "⚙️":
//       return sequence.filter((e) => ["🚀", "⚙️", "⏰"].includes(e)).length;
//     case "💎":
//       return 3;
//     case "⏰":
//       return parseInt(scoreStr[0], 10) || 0;
//     case "⚡️":
//       return sequence.filter((e) => ["☀️", "⚡️"].includes(e)).length;
//     default:
//       return 0;
//   }
// };

// const generateNewPuzzle = (score) => {
//   const newSequence = [...EMOJI_POOL]
//     .sort(() => 0.5 - Math.random())
//     .slice(0, 4);
//   const newSolution = newSequence
//     .map((emoji, index) =>
//       calculateDigit(emoji, index, newSequence, score).toString()
//     )
//     .join("");
//   return { sequence: newSequence, solution: newSolution };
// };

// // --- UI SUB-COMPONENTS ---
// const GameEndModal = ({ gameState, score }) => {
//   if (gameState === "playing") return null;
//   const isWin = gameState === "solved";
//   const title = isWin ? "Code Decrypted!" : "System Error!";
//   const message = isWin
//     ? `+${PUZZLE_CONFIG.pointsPerWin} Points Transferred!`
//     : "Incorrect. Resetting system...";

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
//       <div className="bg-gray-800 p-8 rounded-lg text-center border-4 border-gray-700 w-full max-w-sm">
//         <h2
//           className={`text-4xl sm:text-5xl font-bold mb-2 ${
//             isWin ? "text-lime-400" : "text-red-500"
//           }`}
//         >
//           {title}
//         </h2>
//         <p className="text-lg sm:text-xl text-yellow-300 font-semibold">
//           {message}
//         </p>
//         {isWin && (
//           <p className="text-slate-300 text-base mt-2">
//             New Team Score:{" "}
//             <span className="font-bold text-white">{score}</span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- MAIN PUZZLE COMPONENT ---
// export default function Puzzle4_EmojiEnigma({ onComplete }) {
//   const { solvePuzzle } = useContext(GameContext);
//   const { teamInfo, updateTeamInfo } = useContext(TeamContext);

//   const [gameState, setGameState] = useState("playing");
//   const [userInput, setUserInput] = useState("");
//   const [feedback, setFeedback] = useState("Enter the 4-digit code.");
//   const [enigma, setEnigma] = useState({ sequence: [], solution: "" });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleReset = useCallback((currentScore) => {
//     setGameState("playing");
//     setUserInput("");
//     setEnigma(generateNewPuzzle(currentScore));
//     setFeedback("New enigma loaded. Decrypt the sequence.");
//   }, []);

//   useEffect(() => {
//     handleReset(teamInfo.score);
//   }, [handleReset, teamInfo.score]);

//   useEffect(() => {
//     if (gameState === "solved") {
//       const timer = setTimeout(() => onComplete(), 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [gameState, onComplete]);

//   const handleSubmit = async () => {
//     if (gameState !== "playing" || userInput.length !== 4 || isSubmitting)
//       return;

//     if (userInput !== enigma.solution) {
//       setGameState("failed");
//       setFeedback("Access Denied. Code incorrect.");
//       setTimeout(() => handleReset(teamInfo.score), 3000);
//       return;
//     }

//     setIsSubmitting(true);
//     setFeedback("Access Granted. Awarding points...");

//     try {
//       const response = await api.post("/teams/score", {
//         teamId: teamInfo.id,
//         pointsToAdd: PUZZLE_CONFIG.pointsPerWin,
//       });
//       updateTeamInfo({ score: response.data.team.score });
//       solvePuzzle(PUZZLE_CONFIG.riddleId);
//       setGameState("solved");
//     } catch (error) {
//       console.error("Failed to save score!", error);
//       setFeedback("Connection error! Please try again.");
//       setIsSubmitting(false);
//     }
//   };

//   const handleKeyPress = (digit) => {
//     if (userInput.length < 4 && gameState === "playing") {
//       setUserInput(userInput + digit);
//     }
//   };

//   return (
//     <div className="bg-gray-900 text-white min-h-screen font-sans w-full p-4 sm:p-6 lg:p-8">
//       <GameEndModal gameState={gameState} score={teamInfo.score} />
//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//         {/* Left Column: The Vault Interface */}
//         <div className="lg:col-span-3 bg-gray-800 p-4 sm:p-6 rounded-lg border-4 border-gray-700">
//           <header className="mb-4">
//             <h1 className="text-3xl sm:text-4xl font-bold text-lime-400">
//               Puzzle 4: Emoji Enigma
//             </h1>
//             <p className="text-gray-400">Sequence and solution are dynamic!</p>
//           </header>

//           <div className="bg-black p-4 my-6 rounded-xl shadow-inner flex justify-around items-center">
//             {enigma.sequence.map((emoji, index) => (
//               <span key={index} className="text-5xl sm:text-6xl md:text-7xl">
//                 {emoji}
//               </span>
//             ))}
//           </div>

//           <div className="flex items-stretch gap-4">
//             <div className="hidden sm:flex items-center justify-center p-4 bg-gray-900 rounded-lg">
//               <svg
//                 className="w-12 h-12 md:w-16 md:h-16 text-yellow-400"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M12 2.5l7.794 4.5v9L12 20.5l-7.794-4.5v-9L12 2.5z" />
//               </svg>
//             </div>
//             <div className="flex-grow bg-black rounded-lg p-2 sm:p-4">
//               <div className="h-14 sm:h-16 w-full bg-gray-700 rounded-md mb-4 flex items-center justify-center text-4xl sm:text-5xl font-mono text-lime-300 tracking-widest">
//                 {userInput || "----"}
//               </div>
//               <div className="grid grid-cols-3 gap-2">
//                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, "CLR", 0, "ENT"].map((key) => (
//                   <button
//                     key={key}
//                     onClick={() => {
//                       if (gameState !== "playing") return;
//                       if (key === "CLR") setUserInput("");
//                       else if (key === "ENT") handleSubmit();
//                       else handleKeyPress(key.toString());
//                     }}
//                     className={`p-3 sm:p-4 rounded-md text-xl sm:text-2xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-lime-400 ${
//                       key === "CLR" ? "bg-red-800 hover:bg-red-700" : ""
//                     } ${
//                       key === "ENT" ? "bg-green-800 hover:bg-green-700" : ""
//                     } ${
//                       typeof key === "number" || key === 0
//                         ? "bg-gray-600 hover:bg-gray-500"
//                         : ""
//                     }`}
//                   >
//                     {key}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column: Status and Rules */}
//         <div className="lg:col-span-2 space-y-8">
//           <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border-2 border-gray-700">
//             <h2 className="text-2xl font-semibold mb-3 text-lime-400">
//               Status Panel
//             </h2>
//             <div className="bg-black p-4 rounded-md font-mono flex flex-wrap justify-between items-center gap-4">
//               <div>
//                 <p className="text-sm text-gray-400">TEAM SCORE</p>
//                 <p className="text-3xl text-green-400">{teamInfo.score}</p>
//               </div>
//               <p className="p-2 rounded-md text-center font-semibold text-sm sm:text-base bg-gray-700 text-gray-300">
//                 {feedback}
//               </p>
//             </div>
//           </div>
//           <div className="bg-black p-4 sm:p-6 rounded-lg border-2 border-lime-500 font-mono h-fit">
//             <h2 className="text-2xl font-semibold mb-4 text-lime-400">
//               Rules.txt
//             </h2>
//             <ul className="list-disc list-inside space-y-3 text-lime-300 text-xs sm:text-sm">
//               {DECRYPTION_RULES.map((rule, index) => (
//                 <li key={index}>{rule}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback, useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { TeamContext } from "../../context/TeamContent";
import api from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
// --- PUZZLE CONFIGURATION ---
const PUZZLE_CONFIG = {
  riddleId: 4,
  pointsPerWin: 25,
};

// --- DYNAMIC PUZZLE ENGINE (WITH NEW, CLEARER RULES) ---
const EMOJI_POOL = ["🚀", "☀️", "🔑", "❤️", "⚙️", "💎", "⏰", "⚡️"];

// --- UPDATED RULES.TXT DISPLAY ---
const DECRYPTION_RULES = [
  "🚀 (Rocket): Its value is its position in the sequence (1, 2, 3, or 4).",
  "☀️ (Sun): If the sequence contains a ❤️, its value is 5. Otherwise, its value is 8.",
  "🔑 (Key): Its value is the number of sides on the shape next to the keypad (a Hexagon).",
  "❤️ (Heart): Its value is always 7.",
  "⚙️ (Gear): If in the first two slots, its value is 2. If in the last two, its value is 8.", // <-- NEW RULE TEXT
  "💎 (Diamond): Its value is always 3.",
  "⏰ (Clock): Its value is always 9.",
  "⚡️ (Lightning): Its value is the number of unique emojis shown in the sequence.", // <-- NEW RULE TEXT
];

// --- UPDATED CALCULATION LOGIC ---
const calculateDigit = (emoji, index, sequence) => {
  switch (emoji) {
    case "🚀":
      return index + 1;
    case "☀️":
      return sequence.includes("❤️") ? 5 : 8;
    case "🔑":
      return 6;
    case "❤️":
      return 7;
    // --- NEW LOGIC FOR GEAR ---
    case "⚙️":
      return index < 2 ? 2 : 8; // If index is 0 or 1, return 2. Else, return 8.
    case "💎":
      return 3;
    case "⏰":
      return 9;
    // --- NEW LOGIC FOR LIGHTNING ---
    case "⚡️":
      return new Set(sequence).size; // The size of a Set is the count of unique items.
    default:
      return 0;
  }
};

const generateNewPuzzle = () => {
  const newSequence = [...EMOJI_POOL]
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  const newSolution = newSequence
    .map((emoji, index) => calculateDigit(emoji, index, newSequence).toString())
    .join("");
  return { sequence: newSequence, solution: newSolution };
};

// --- UI SUB-COMPONENTS ---
const GameEndModal = ({ gameState, score }) => {
  if (gameState === "playing") return null;
  const isWin = gameState === "solved";
  const title = isWin ? "Code Decrypted!" : "System Error!";
  const message = isWin
    ? `+${PUZZLE_CONFIG.pointsPerWin} Points Transferred!`
    : "Incorrect. Resetting system...";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg text-center border-4 border-gray-700 w-full max-w-sm">
        <h2
          className={`text-4xl sm:text-5xl font-bold mb-2 ${
            isWin ? "text-lime-400" : "text-red-500"
          }`}
        >
          {title}
        </h2>
        <p className="text-lg sm:text-xl text-yellow-300 font-semibold">
          {message}
        </p>
        {isWin && (
          <p className="text-slate-300 text-base mt-2">
            New Team Score:{" "}
            <span className="font-bold text-white">{score}</span>
          </p>
        )}
      </div>
    </div>
  );
};

// --- MAIN PUZZLE COMPONENT ---
export default function Puzzle4_EmojiEnigma() {
  const navigate = useNavigate();
  const onComplete = () => {
    navigate("/hub");
  };
  const { solvePuzzle } = useContext(GameContext);
  const { teamInfo, updateTeamInfo } = useContext(TeamContext);

  const [gameState, setGameState] = useState("playing");
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("Enter the 4-digit code.");
  const [enigma, setEnigma] = useState({ sequence: [], solution: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = useCallback(() => {
    setGameState("playing");
    setUserInput("");
    setEnigma(generateNewPuzzle());
    setFeedback("New enigma loaded. Decrypt the sequence.");
  }, []);

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  useEffect(() => {
    if (gameState === "solved") {
      const timer = setTimeout(() => {
        navigate("/hub");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, onComplete]);

  const handleSubmit = async () => {
    if (gameState !== "playing" || userInput.length !== 4 || isSubmitting)
      return;

    if (userInput !== enigma.solution) {
      setGameState("failed");
      setFeedback("Access Denied. Code incorrect.");
      // setTimeout(() => handleReset(), 3000);
      setTimeout(() => {
        navigate("/hub");
      }, 1000);
      return;
    }

    setGameState("solved");
    setFeedback("Access Granted. Awarding points...");
    setIsSubmitting(true);
    solvePuzzle(PUZZLE_CONFIG.riddleId);

    try {
      const response = await api.post("/teams/score", {
        teamId: teamInfo.id,
        pointsToAdd: PUZZLE_CONFIG.pointsPerWin,
      });
      updateTeamInfo({ score: response.data.team.score });
    } catch (error) {
      console.error("Background score update failed:", error);
    }
  };

  const handleKeyPress = (digit) => {
    if (userInput.length < 4 && gameState === "playing") {
      setUserInput(userInput + digit);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans w-full p-4">
      <GameEndModal gameState={gameState} score={teamInfo.score} />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* --- LEFT COLUMN / MAIN CONTENT --- */}
        <div className="lg:col-span-3 bg-gray-800 p-4 sm:p-6 rounded-lg border-4 border-gray-700 flex flex-col gap-6">
          <header>
            <h1 className="text-3xl sm:text-4xl font-bold text-lime-400">
              Puzzle 4: Emoji Enigma
            </h1>
            <p className="text-gray-400">The sequence is randomly generated.</p>
          </header>
          <div className="bg-black p-4 rounded-xl shadow-inner flex justify-around items-center">
            {enigma.sequence.map((emoji, index) => (
              <span key={index} className="text-5xl sm:text-6xl">
                {emoji}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            <div className="flex-grow bg-black rounded-lg p-4">
              <div className="h-16 w-full bg-gray-700 rounded-md mb-4 flex items-center justify-center text-4xl font-mono text-lime-300 tracking-widest">
                {userInput || "----"}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key.toString())}
                    disabled={gameState !== "playing"}
                    className="p-4 rounded-md text-xl font-bold bg-gray-600 hover:bg-gray-500 transition-colors disabled:opacity-50"
                  >
                    {key}
                  </button>
                ))}
                <button
                  onClick={() => setUserInput("")}
                  disabled={gameState !== "playing"}
                  className="p-4 rounded-md text-xl font-bold bg-red-800 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  CLR
                </button>
                <button
                  onClick={() => handleKeyPress("0")}
                  disabled={gameState !== "playing"}
                  className="p-4 rounded-md text-xl font-bold bg-gray-600 hover:bg-gray-500 transition-colors disabled:opacity-50"
                >
                  0
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={gameState !== "playing" || userInput.length !== 4}
                  className="p-4 rounded-md text-xl font-bold bg-green-800 hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  ENT
                </button>
              </div>
            </div>
            <div className="flex sm:flex-col items-center justify-center p-4 bg-gray-900 rounded-lg shrink-0">
              <span className="text-gray-400 font-mono text-sm sm:mb-2 sm:mr-0 mr-2">
                CLUE
              </span>
              <svg
                className="w-16 h-16 text-yellow-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.5l7.794 4.5v9L12 20.5l-7.794-4.5v-9L12 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN / SIDEBAR --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border-2 border-gray-700">
            <h2 className="text-2xl font-semibold mb-3 text-lime-400">
              Status Panel
            </h2>
            <div className="bg-black p-4 rounded-md font-mono flex justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-400">TEAM SCORE</p>
                <p className="text-3xl text-green-400">{teamInfo.score}</p>
              </div>
              <p className="p-2 rounded-md text-center font-semibold text-sm bg-gray-700 text-gray-300 flex-1">
                {feedback}
              </p>
            </div>
          </div>
          <div className="bg-black p-4 sm:p-6 rounded-lg border-2 border-lime-500 font-mono h-fit">
            <h2 className="text-2xl font-semibold mb-4 text-lime-400">
              Rules.txt
            </h2>
            <ul className="list-disc list-inside space-y-3 text-lime-300 text-xs sm:text-sm">
              {DECRYPTION_RULES.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
