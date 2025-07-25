import axios from "axios";

// Create an instance of axios
const api = axios.create({
  // Use the Vite environment variable for the base URL
  // During development, this will be '/api' to use the proxy.
  // For production, you would set VITE_API_URL to your deployed backend's URL.
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
