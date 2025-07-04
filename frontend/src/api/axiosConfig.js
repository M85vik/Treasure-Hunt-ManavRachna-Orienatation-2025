import axios from "axios";

// Create an instance of axios
const api = axios.create({
  // Use the Vite environment variable for the base URL
  // During development, this will be '/api' to use the proxy.
  // For production, you would set VITE_API_URL to your deployed backend's URL.
  baseURL: "http://192.168.196.49:3001/api" || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
