import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hard-coded credentials. In a real app, these would come from a secure source.
const ADMIN_USER_ID = "admin" || import.meta.env.VITE_ADMIN_id;
const ADMIN_PASSCODE = "1234" || import.meta.env.VITE_ADMIN_pass;

export default function AdminLoginScreen() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId === ADMIN_USER_ID && passcode === ADMIN_PASSCODE) {
      window.localStorage.setItem("isAdminAuthenticated", "true");
      navigate("/admin/panel");
    } else {
      setError("Invalid User ID or Passcode.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#131826] via-[#232946] to-[#0f2027] w-full">
      <div className="w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/40 text-white">
        <div className="flex flex-col items-center mb-6">
          <span className="text-5xl mb-2">🔒</span>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500  text-center mb-2 drop-shadow-lg">
            Admin Access
          </h1>
          <p className="text-sm text-gray-300 mb-2">Restricted Area</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-bold text-gray-200 mb-2"
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-white placeholder-gray-400 transition"
              placeholder="Enter admin user ID"
              autoComplete="username"
            />
          </div>
          <div>
            <label
              htmlFor="passcode"
              className="block text-sm font-bold text-gray-200 mb-2"
            >
              Passcode
            </label>
            <input
              type="password"
              id="passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              maxLength="4"
              className="w-full p-3 bg-gray-800/80 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none text-white placeholder-gray-400 transition"
              placeholder="4-digit passcode"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-gray-900 font-bold py-3 rounded-lg text-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
