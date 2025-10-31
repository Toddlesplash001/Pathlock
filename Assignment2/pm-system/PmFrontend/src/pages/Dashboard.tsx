import { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

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
    <div>
      <h2>Projects</h2>
      <form onSubmit={createProject}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Project Title"
          required
        />
        <button type="submit">Add Project</button>
      </form>

      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${p.id}`}>{p.title}</Link>
            <button onClick={() => deleteProject(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
