import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/ Navbar";

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  tasks: Task[];
}

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const token = localStorage.getItem("token");

  const fetchProject = async () => {
    const res = await api.get(`/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProject(res.data);
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: { title: string; dueDate?: string } = { title };
    if (dueDate) {
      taskData.dueDate = dueDate;
    }

    await api.post(`/projects/${id}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTitle("");
    setDueDate("");
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
      <div className="flex justify-center items-start pt-24 pb-12">
        <div className="flex flex-col gap-8 w-full max-w-2xl">
          {/* Card 1: Project Information */}
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              {project?.title}
            </h2>
            {project?.description && (
              <p className="text-gray-600 text-base leading-relaxed">
                {project.description}
              </p>
            )}
            {!project?.description && (
              <p className="text-gray-400 italic">No description provided.</p>
            )}
          </div>

          {/* Card 2: Tasks */}
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-700 mb-6">Tasks</h3>

            {/* Add Task Form */}
            <form onSubmit={addTask} className="flex flex-col gap-4 mb-6">
              <input
                className="bg-gray-100 text-gray-800 placeholder-gray-400 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
                required
              />
              {/* Due Date Input - Optional field for setting task deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  className="w-full bg-gray-100 text-gray-800 rounded-lg px-6 py-3 text-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300 transition"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-8 py-3 font-semibold text-lg">
                Add Task
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
                  className="flex items-center gap-4 bg-blue-50 mb-3 rounded-lg px-5 py-3"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={t.isCompleted}
                    onChange={() => toggleTask(t)}
                    className="w-5 h-5 cursor-pointer accent-indigo-500"
                  />

                  {/* Task Content */}
                  <div className="flex-1">
                    <span
                      className={`text-lg block ${
                        t.isCompleted
                          ? "line-through text-gray-400"
                          : "text-gray-800 font-medium"
                      }`}
                    >
                      {t.title}
                    </span>
                    {t.dueDate && (
                      <span className="text-sm text-gray-500">
                        Due: {new Date(t.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="bg-indigo-400 hover:bg-indigo-600 text-white rounded px-4 py-1 text-base font-medium"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
