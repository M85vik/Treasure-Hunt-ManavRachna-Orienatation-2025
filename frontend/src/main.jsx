import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { TeamProvider } from "./context/TeamContent.jsx";
import { GameProvider } from "./context/GameContext.jsx"; // 1. Import
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TeamProvider>
        <GameProvider>
          {" "}
          {/* 2. Wrap the App */}
          <App />
        </GameProvider>
      </TeamProvider>
    </BrowserRouter>
  </React.StrictMode>
);
