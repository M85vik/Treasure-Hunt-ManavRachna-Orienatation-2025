import React, { createContext, useState, useEffect } from "react";
const initialTeamState = {
  id: null,
  teamName: "",
  numPlayers: 2,
  members: [],
  score: 0,
};
export const TeamContext = createContext();
export const TeamProvider = ({ children }) => {
  const [teamInfo, setTeamInfo] = useState(() => {
    try {
      const saved = window.localStorage.getItem("treasureHuntTeamInfo");
      return saved ? JSON.parse(saved) : initialTeamState;
    } catch {
      return initialTeamState;
    }
  });
  useEffect(() => {
    window.localStorage.setItem(
      "treasureHuntTeamInfo",
      JSON.stringify(teamInfo)
    );
  }, [teamInfo]);
  const updateTeamInfo = (data) => {
    setTeamInfo((prev) => ({ ...prev, ...data }));
  };
  return (
    <TeamContext.Provider value={{ teamInfo, updateTeamInfo }}>
      {children}
    </TeamContext.Provider>
  );
};
