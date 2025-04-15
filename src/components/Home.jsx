import { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    axios.get("http://localhost:5000/tasks").then((res) => setTasks(res.data));
  }, []);

  // Add Task
  const addTask = async () => {
    if (!title.trim()) return;
    const res = await axios.post("http://localhost:5000/tasks", {
      title,
      completed: false,
    });
    setTasks([...tasks, res.data]);
    setTitle("");
  };

  // Delete Task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setTasks(tasks.filter((task) => task._id !== id));
  };

  // Toggle Complete
  const toggleTask = async (id, completed) => {
    const res = await axios.put(`http://localhost:5000/tasks/${id}`, {
      completed: !completed,
    });
    setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
  };

  // Start Editing
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditedText(task.title);
  };

  // Save Edit
  const saveEdit = async (id) => {
    if (!editedText.trim()) return;
    const res = await axios.put(`http://localhost:5000/tasks/${id}`, {
      title: editedText,
    });
    setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    setEditingId(null);
    setEditedText("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          📝 Task Manager
        </h1>

        {/* Add Task Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={title}
            placeholder="Add a new task"
            onChange={(e) => setTitle(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-gray-100 flex justify-between items-center p-3 rounded mb-2"
          >
            {/* Edit Mode */}
            {editingId === task._id ? (
              <div className="flex items-center w-full gap-2">
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(task._id)}
                  className="flex-grow p-2 border border-black rounded"
                />
                <button
                  onClick={() => saveEdit(task._id)}
                  className="text-green-600"
                >
                  <FaCheck />
                </button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-grow text-lg ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                  onClick={() => toggleTask(task._id, task.completed)}
                >
                  {task.title}
                </span>

                <div className="flex gap-3 ml-2">
                  <button
                    onClick={() => startEditing(task)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
