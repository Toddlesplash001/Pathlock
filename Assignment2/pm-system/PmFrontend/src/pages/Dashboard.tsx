import { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "../components/ Navbar";
interface Project {
  id: number;
  title: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");

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
    await api.post(
      "/projects",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    fetchProjects();
  };

  const deleteProject = async (id: number) => {
    const token = localStorage.getItem("token");
    await api.delete(`/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProjects();
  };

  return (
    <div className="min-h-screen w-screen bg-blue-100">
      <Navbar />
      <div className="min-h-screen w-screen flex items-start justify-center bg-blue-100">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">
          <h2 className="text-2xl text-gray-700 font-bold mb-6">Projects</h2>
          <form onSubmit={createProject} className="flex gap-2 mb-4">
            <input
              className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
              placeholder="New Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded px-5 py-2 font-semibold"
              type="submit"
            >
              Add Project
            </button>
          </form>
          <ul>
            {projects.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-2 mb-2"
              >
                <Link
                  className="font-medium text-gray-800"
                  to={`/projects/${p.id}`}
                >
                  {p.title}
                </Link>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="bg-indigo-400 hover:bg-indigo-600 text-white rounded px-4 py-1"
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
