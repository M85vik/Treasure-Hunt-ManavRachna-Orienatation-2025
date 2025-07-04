// // src/App.jsx

// // import BombPuzzle from "./components/Bomb_puzzle.jsx";
// import EmojiEnigma from "./components/EmojiEnigma.jsx";
// import MasterThief from "./components/MasterThief.jsx";
// import SpotTheDifference from "./components/SpotTheDifference.jsx";
// import MorsePuzzleGame from "./components/MorsePuzzleGame.jsx";
// import CryptogramPuzzle from "./components/CryptogramPuzzle.jsx";
// import ChemistryQuiz from "./components/ChemistryQuiz.jsx";

// function App() {
//   return (
//     <div>
//       {/* <BombPuzzle /> */}

//       {/* <MasterThief /> */}

//       {/* <EmojiEnigma /> */}

//       {/* <SpotTheDifference /> */}

//       {/* <div className="bg-slate-900 text-white min-h-screen flex items-start justify-center p-4 sm:p-6 font-sans">
//         <MorsePuzzleGame />
//       </div> */}

//       <div className="bg-slate-900 text-white min-h-screen flex items-start justify-center font-sans">
//         <ChemistryQuiz />
//       </div>

//       {/* <div className="bg-slate-900 text-white min-h-screen flex items-start justify-center font-sans">
//         <SpotTheDifference />
//       </div> */}

//       {/* <div className="App">
//         <CryptogramPuzzle />
//       </div> */}
//     </div>
//   );
// }

// export default App;

// import { useState } from "react";
// import WelcomeScreen from "./components/WelcomeSCreen.jsx";
// import TeamDetailsScreen from "./components/Team DetailsScreen.jsx";
// import TeamMembersScreen from "./components/TeamMembersScreen.jsx";

// function App() {
//   // State to manage which screen is currently active
//   const [currentScreen, setCurrentScreen] = useState("welcome"); // 'welcome', 'details', 'members'

//   // State to hold all team information
//   const [teamInfo, setTeamInfo] = useState({
//     teamName: "",
//     numPlayers: 2, // Default to 2 players
//     members: [],
//   });

//   // Function to update team info from child components
//   const updateTeamInfo = (data) => {
//     setTeamInfo((prevInfo) => ({ ...prevInfo, ...data }));
//   };

//   // Function to render the correct screen based on state
//   const renderScreen = () => {
//     switch (currentScreen) {
//       case "welcome":
//         return <WelcomeScreen onNext={() => setCurrentScreen("details")} />;
//       case "details":
//         return (
//           <TeamDetailsScreen
//             teamInfo={teamInfo}
//             updateTeamInfo={updateTeamInfo}
//             onNext={() => setCurrentScreen("members")}
//           />
//         );
//       case "members":
//         return (
//           <TeamMembersScreen
//             teamInfo={teamInfo}
//             updateTeamInfo={updateTeamInfo}
//             onComplete={handleHuntStart}
//           />
//         );
//       default:
//         return <WelcomeScreen onNext={() => setCurrentScreen("details")} />;
//     }
//   };

//   // This is where you would transition to the actual game
//   const handleHuntStart = () => {
//     console.log("Starting the hunt with this data:", teamInfo);
//     alert(`Let the Treasure Hunt begin for Team: ${teamInfo.teamName}!`);
//     // Here you would navigate to the first clue screen
//   };

//   return (
//     // Main container - responsive and centered
//     <div className="min-h-screen bg-amber-50 text-gray-800 flex flex-col items-center justify-center p-4 font-sans bg-[url('/parchment.jpg')] bg-cover bg-center">
//       {renderScreen()}
//     </div>
//   );
// }

// export default App;

// import { Routes, Route } from "react-router-dom";
// import WelcomeScreen from "./components/WelcomeSCreen.jsx";
// import TeamDetailsScreen from "./components/Team DetailsScreen.jsx";
// import TeamMembersScreen from "./components/TeamMembersScreen";
// import GameStartScreen from "./components/GameStartScreen"; // A new component for the final screen

// function App() {
//   return (
//     // Main container - responsive, centered, with background
//     <div className="min-h-screen bg-amber-50 text-gray-800 flex flex-col items-center justify-center p-4 font-sans bg-[url('/parchment.jpg')] bg-cover bg-center">
//       <Routes>
//         {/* Each Route defines a "page" */}
//         <Route path="/" element={<WelcomeScreen />} />
//         <Route path="/details" element={<TeamDetailsScreen />} />
//         <Route path="/members" element={<TeamMembersScreen />} />
//         <Route path="/hunt" element={<GameStartScreen />} />
//         {/* You can add a "Not Found" page later */}
//         {/* <Route path="*" element={<NotFoundScreen />} /> */}
//       </Routes>
//     </div>
//   );
// }

// export default App;

// import { Routes, Route } from "react-router-dom";
// import WelcomeScreen from "./components/WelcomeSCreen.jsx";
// import TeamDetailsScreen from "./components/Team DetailsScreen";
// import TeamMembersScreen from "./components/TeamMembersScreen";
// import HubScreen from "./components/HubScreen"; // Import new component
// import RiddleScreen from "./components/RiddleScreen"; // Import new component

// function App() {
//   return (
//     <div className="min-h-screen bg-amber-50 text-gray-800 flex flex-col items-center justify-center p-4 font-sans bg-[url('/parchment.jpg')] bg-cover bg-center">
//       <Routes>
//         {/* Setup Routes */}
//         <Route path="/" element={<WelcomeScreen />} />
//         <Route path="/details" element={<TeamDetailsScreen />} />
//         <Route path="/members" element={<TeamMembersScreen />} />

//         {/* Game Routes */}
//         <Route path="/hub" element={<HubScreen />} />
//         <Route path="/riddle/:id" element={<RiddleScreen />} />
//         {/* The :id makes this a dynamic route */}
//       </Routes>
//     </div>
//   );
// }

// export default App;

// ... imports

import { Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeSCreen.jsx";
import TeamDetailsScreen from "./components/Team DetailsScreen";
import TeamMembersScreen from "./components/TeamMembersScreen";
import HubScreen from "./components/HubScreen"; // Import new component
import RiddleScreen from "./components/RiddleScreen"; // Import new component
import PuzzleScreen from "./components/PuzzleScreen"; // Import new component

function App() {
  return (
    <div className="...">
      <Routes>
        {/* Setup Routes */}
        // <Route path="/" element={<WelcomeScreen />} />
        // <Route path="/details" element={<TeamDetailsScreen />} />
        // <Route path="/members" element={<TeamMembersScreen />} />
        <Route path="/hub" element={<HubScreen />} />
        <Route path="/riddle/:id" element={<RiddleScreen />} />
        <Route path="/puzzle/:id" element={<PuzzleScreen />} />{" "}
        {/* <-- ADD THIS ROUTE */}
      </Routes>
    </div>
  );
}

export default App;
