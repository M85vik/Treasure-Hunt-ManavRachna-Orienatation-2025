import React, { createContext, useState, useEffect } from "react";

export const TeamContext = createContext();

// Define the initial state structure
const initialTeamState = {
  id: null,
  teamName: "",
  numPlayers: 2,
  members: [],
  score: 0,
};

export const TeamProvider = ({ children }) => {
  // --- THIS IS THE FIX ---
  // When initializing state, try to load it from localStorage.
  // If it's not there, use the initial empty state.
  const [teamInfo, setTeamInfo] = useState(() => {
    try {
      const savedTeamInfo = window.localStorage.getItem("treasureHuntTeamInfo");
      return savedTeamInfo ? JSON.parse(savedTeamInfo) : initialTeamState;
    } catch (error) {
      console.error("Error parsing team info from localStorage", error);
      return initialTeamState;
    }
  });

  // --- THIS IS THE OTHER PART OF THE FIX ---
  // This effect runs every time teamInfo changes, saving it to localStorage.
  useEffect(() => {
    window.localStorage.setItem(
      "treasureHuntTeamInfo",
      JSON.stringify(teamInfo)
    );
  }, [teamInfo]);

  const updateTeamInfo = (data) => {
    setTeamInfo((prevInfo) => ({ ...prevInfo, ...data }));
  };

  return (
    <TeamContext.Provider value={{ teamInfo, updateTeamInfo }}>
      {children}
    </TeamContext.Provider>
  );
};
