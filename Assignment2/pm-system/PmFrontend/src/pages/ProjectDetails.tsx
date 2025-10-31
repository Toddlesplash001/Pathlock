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
    <div className="min-h-screen w-screen bg-blue-100">
      <Navbar />
      <div className="flex justify-center items-start pt-24">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">
          <h2 className="text-2xl font-bold text-gray-700 mb-8">
            {project?.title}
          </h2>
          {/* Add Task */}
          <form onSubmit={addTask} className="flex gap-4 mb-6">
            <input
              className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New Task"
              required
            />
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-8 py-3 font-semibold text-lg">
              Add
            </button>
          </form>
          {/* Tasks List */}
          <ul>
            {project?.tasks && project.tasks.length === 0 && (
              <li className="text-gray-400 italic py-4">No tasks yet.</li>
            )}
            {project?.tasks?.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between bg-blue-50 mb-2 rounded-lg px-5 py-3"
              >
                <span
                  onClick={() => toggleTask(t)}
                  className={`cursor-pointer text-lg ${
                    t.isCompleted
                      ? "line-through text-gray-400"
                      : "text-gray-800 font-medium"
                  }`}
                >
                  {t.title}
                </span>
                <div>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="bg-indigo-400 hover:bg-indigo-600 text-white rounded px-4 py-1 text-base font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
