import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/ Navbar";
interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
}

interface Project {
  id: number;
  title: string;
  tasks: Task[];
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const token = localStorage.getItem("token");

  const fetchProject = async () => {
    const res = await api.get(`/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProject(res.data);
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await api.post(
      `/projects/${id}/tasks`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTitle("");
    fetchProject();
  };

  const toggleTask = async (task: Task) => {
    await api.put(
      `/tasks/${task.id}`,
      { ...task, isCompleted: !task.isCompleted },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchProject();
  };

  const deleteTask = async (taskId: number) => {
    await api.delete(`/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProject();
  };

  return (
    <>
    <Navbar/>
    <div>
      <h2>{project?.title}</h2>

      <form onSubmit={addTask}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
          required
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {project?.tasks?.map((t) => (
          <li key={t.id}>
            <span
              style={{
                textDecoration: t.isCompleted ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => toggleTask(t)}
            >
              {t.title}
            </span>
            <button onClick={() => deleteTask(t.id)}> Delete </button>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
