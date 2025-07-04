import React, { createContext, useState } from "react";

export const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teamInfo, setTeamInfo] = useState({
    id: null, // <-- ADD THIS to store the database ID
    teamName: "",
    numPlayers: 2,
    members: [],
    score: 0, // <-- ADD THIS to track score on the frontend
  });

  const updateTeamInfo = (data) => {
    setTeamInfo((prevInfo) => ({ ...prevInfo, ...data }));
  };

  return (
    <TeamContext.Provider value={{ teamInfo, updateTeamInfo }}>
      {children}
    </TeamContext.Provider>
  );
};
