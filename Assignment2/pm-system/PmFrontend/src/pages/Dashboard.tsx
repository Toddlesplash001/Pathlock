import { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "../components/ Navbar";

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

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const projectData: { title: string; description?: string } = { title };
    if (description.trim()) {
      projectData.description = description;
    }

    await api.post("/projects", projectData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    setTitle("");
    setDescription("");
    fetchProjects();
  };

  const deleteProject = async (id: number) => {
    const token = localStorage.getItem("token");
    await api.delete(`/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects();
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="min-h-screen w-screen bg-blue-100">
      <Navbar />
      <div className="flex justify-center items-start pt-24">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-8">Projects</h2>

          {/* Create Project Form */}
          <form onSubmit={createProject} className="flex flex-col gap-4 mb-6">
            <input
              className="bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Title"
              required
            />

            <div className="relative">
              <textarea
                className="w-full bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition resize-none"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setDescription(e.target.value);
                  }
                }}
                placeholder="Project Description (Optional, max 500 characters)"
                rows={3}
              />
              <span className="absolute bottom-2 right-4 text-sm text-gray-400">
                {description.length}/500
              </span>
            </div>

            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-8 py-3 font-semibold text-lg"
            >
              Add Project
            </button>
          </form>

          {/* Projects List */}
          <ul>
            {projects.length === 0 && (
              <li className="text-gray-400 italic py-4">No projects yet.</li>
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
