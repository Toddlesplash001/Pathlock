import React, { useState, useEffect } from "react";
import api from "./services/api";
type Task = {
  id: number;
  description: string;
  isCompleted: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks"); // ✅ Changed: fetching from backend
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // ➕ Add a new task to backend
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await api.post("/tasks", {
        // ✅ Changed: send task to backend
        description: newTask.trim(),
        isCompleted: false,
      });
      setTasks([...tasks, response.data]); // ✅ Updated: append backend response
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // 🔁 Toggle completion status on backend
  const handleToggle = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      const response = await api.put(`/tasks/${id}`, {
        // ✅ Changed: update backend task
        ...task,
        isCompleted: !task.isCompleted,
      });
      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // ❌ Delete task from backend
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`); // ✅ Changed: delete from backend
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 flex justify-center items-center gap-2">
          🗒️ My Task Manager
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-start py-8 px-4 bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="bg-white shadow-lg rounded-xl w-full sm:max-w-2xl p-6 mx-auto">
          {/* Add Task Section */}
          <div className="flex mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task description..."
              className="flex-1 bg-white border border-gray-300 rounded-l-md px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleAddTask}
              className="bg-indigo-500 text-white px-6 py-3 rounded-r-md font-medium hover:bg-indigo-600 transition active:scale-95"
            >
              Add
            </button>
          </div>

          {/* Task List */}
          <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
            {tasks.length === 0 && (
              <p className="text-gray-500 text-center py-4">No tasks yet.</p>
            )}
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggle(task.id)}
                    className="w-5 h-5 text-indigo-500 focus:ring-indigo-400 cursor-pointer accent-indigo-500"
                  />
                  <span
                    className={`text-lg ${
                      task.isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.description}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-lg transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-3 bg-white shadow-inner">
        © {new Date().getFullYear()} Task Manager
      </footer>
    </div>
  );
}
