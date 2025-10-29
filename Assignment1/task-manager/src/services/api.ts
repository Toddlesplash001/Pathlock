import axios from "axios";

// Replace with your backend URL
const api = axios.create({
  baseURL: "http://localhost:5275/api", // ✅ matches your .NET backend
});

export default api;
