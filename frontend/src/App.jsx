import { Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeSCreen.jsx";
import TeamDetailsScreen from "./components/Team DetailsScreen";
import TeamMembersScreen from "./components/TeamMembersScreen";
import HubScreen from "./components/HubScreen"; // Import new component
import RiddleScreen from "./components/RiddleScreen"; // Import new component
import PuzzleScreen from "./components/PuzzleScreen"; // Import new component
import LeaderboardScreen from "./components/LeaderboardScreen.jsx"; // Import new component
import AboutScreen from "./components/AboutScreen.jsx";
import AdminLoginScreen from "./components/AdminLoginScreen";
import AdminPanelScreen from "./components/AdminPanelScreen";
import ProtectedRoute from "./components/ProtectedRoute"; // We will create this next
function App() {
  return (
    <div className="...">
      <Routes>
        {/* Setup Routes */}
        // <Route path="/" element={<WelcomeScreen />} />
        <Route path="/details" element={<TeamDetailsScreen />} />
        <Route path="/members" element={<TeamMembersScreen />} />
        <Route path="/hub" element={<HubScreen />} />
        <Route path="/riddle/:id" element={<RiddleScreen />} />
        <Route path="/puzzle/:id" element={<PuzzleScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        {/* <-- ADD THIS ROUTE */}
        <Route path="/admin/login" element={<AdminLoginScreen />} />
        <Route
          path="/admin/panel"
          element={
            <ProtectedRoute>
              <AdminPanelScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
