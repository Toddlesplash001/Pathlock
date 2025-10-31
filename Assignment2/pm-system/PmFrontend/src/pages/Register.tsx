import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { username, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-8">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            className="bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            className="bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-8 py-3 font-semibold text-lg"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-gray-500 text-center">
          Already registered?{" "}
          <Link className="text-indigo-500 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
