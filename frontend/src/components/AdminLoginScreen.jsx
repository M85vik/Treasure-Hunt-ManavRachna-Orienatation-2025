import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hard-coded credentials. In a real app, these would come from a secure source.
const ADMIN_USER_ID = "admin";
const ADMIN_PASSCODE = "1234";

export default function AdminLoginScreen() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId === ADMIN_USER_ID && passcode === ADMIN_PASSCODE) {
      // On successful login, set the flag in localStorage
      window.localStorage.setItem("isAdminAuthenticated", "true");
      // Navigate to the protected admin panel
      navigate("/admin/panel");
    } else {
      setError("Invalid User ID or Passcode.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-gray-800/90 p-8 rounded-2xl shadow-2xl text-white">
      <h1 className="text-3xl font-bold text-center text-yellow-300 mb-6">
        Admin Access
      </h1>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label
            htmlFor="userId"
            className="block text-sm font-bold text-gray-300 mb-2"
          >
            User ID
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="passcode"
            className="block text-sm font-bold text-gray-300 mb-2"
          >
            Passcode
          </label>
          <input
            type="password"
            id="passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            maxLength="4"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg text-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}
