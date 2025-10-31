import { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "../components/ Navbar";
import axios, { AxiosError } from "axios";

interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt?: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const fetchProjects = async () => {
    try {
      setFetchError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setFetchError("Authentication token not found. Please login again.");
        return;
      }

      const res = await api.get<Project[]>("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(res.data || []);
    } catch (err: unknown) {
      console.error("Failed to fetch projects:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setFetchError("Your session has expired. Please login again.");
          localStorage.removeItem("token");
        } else {
          setFetchError("Failed to load projects. Please try again later.");
        }
      } else {
        setFetchError("Unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const validateForm = () => {
    if (!title.trim()) return setError("Project title is required"), false;
    if (title.trim().length < 3)
      return setError("Project title must be at least 3 characters long"), false;
    if (title.trim().length > 100)
      return setError("Project title must be less than 100 characters"), false;
    if (description.length > 500)
      return setError("Description must be less than 500 characters"), false;
    return true;
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const projectData = { title, description: description.trim() || undefined };
      await api.post("/projects", projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Project created successfully!");
      setTitle("");
      setDescription("");
      await fetchProjects();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: unknown) {
      console.error("Failed to create project:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401)
          setError("Your session has expired. Please login again.");
        else
          setError(
            err.response?.data?.message ||
              "Failed to create project. Please try again."
          );
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage("Project deleted successfully!");
      await fetchProjects();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: unknown) {
      console.error("Failed to delete project:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401)
          setError("Your session has expired. Please login again.");
        else
          setError(
            err.response?.data?.message ||
              "Failed to delete project. Please try again."
          );
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-screen bg-blue-100">
      <Navbar />
      <div className="flex justify-center items-start pt-24 pb-12">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-8">Projects</h2>

          {fetchError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {fetchError}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={createProject} className="flex flex-col gap-4 mb-6">
            <input
              className="bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Title"
              disabled={loading}
              maxLength={100}
            />
            <div className="relative">
              <textarea
                className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition resize-none disabled:bg-gray-200"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 500)
                    setDescription(e.target.value);
                }}
                placeholder="Project Description (Optional)"
                rows={3}
                disabled={loading}
              />
              <span className="absolute bottom-2 right-4 text-sm text-gray-400">
                {description.length}/500
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-lg px-8 py-3 font-semibold text-lg transition"
            >
              {loading ? "Creating..." : "Add Project"}
            </button>
          </form>

          {/* Project List */}
          <ul>
            {projects.length === 0 && (
              <li className="text-gray-400 italic py-4">
                No projects yet. Create one to get started!
              </li>
            )}
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between bg-blue-50 mb-3 rounded-lg px-5 py-4"
              >
                <div className="flex-1">
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-lg font-semibold text-indigo-600 hover:text-indigo-700 block"
                  >
                    {p.title}
                  </Link>
                  {p.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  {p.createdAt && (
                    <span className="text-xs text-gray-400 mt-2 block">
                      Created: {formatDate(p.createdAt)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="bg-indigo-400 hover:bg-indigo-600 text-white rounded px-4 py-2 text-base font-medium ml-4"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
