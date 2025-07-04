import React, { useContext } from "react";
import { TeamContext } from "../context/TeamContent";

function GameStartScreen() {
  const { teamInfo } = useContext(TeamContext);

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-center">
      <span className="text-6xl mb-4 inline-block">🎉</span>
      <h1 className="text-3xl font-bold text-amber-900">
        Get Ready, Team "{teamInfo.teamName}"!
      </h1>
      <p className="text-gray-600 mt-4 mb-6">
        Your adventure is about to begin. The first clue is just a click away...
      </p>
      <h3 className="font-bold text-lg text-gray-800">Your Crew:</h3>
      <ul className="list-none p-0 my-4 space-y-1">
        {teamInfo.members.map((member, index) => (
          <li key={index} className="text-gray-700 text-lg">
            {member}
          </li>
        ))}
      </ul>
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-transform"
        onClick={() => alert("First clue would appear here!")}
      >
        Show First Clue
      </button>
    </div>
  );
}

export default GameStartScreen;
