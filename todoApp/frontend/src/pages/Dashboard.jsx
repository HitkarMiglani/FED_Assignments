import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
    } catch (error) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post("/api/tasks", {
        title: newTaskTitle.trim(),
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
      setError("");
    } catch (error) {
      setError("Failed to add task");
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === "pending" ? "completed" : "pending";
      const response = await axios.put(`/api/tasks/${taskId}`, {
        status: newStatus,
      });

      setTasks(
        tasks.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (error) {
      setError("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      setError("Failed to delete task");
    }
  };

  const editTask = async (taskId, newTitle) => {
    const title = newTitle.trim();
    if (!title) return;

    try {
      const response = await axios.put(`/api/tasks/${taskId}`, {
        title,
      });

      setTasks(
        tasks.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (error) {
      setError("Failed to update task");
    }
  };

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="container">
      <div className="dashboard-header">
        <div className="card">
          <h1>My Tasks</h1>
          <p>Welcome to your personal todo dashboard, {user?.username}!</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{pendingTasks.length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completedTasks.length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {tasks.length > 0
              ? Math.round((completedTasks.length / tasks.length) * 100)
              : 0}
            %
          </div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add new task form */}
      <div className="card">
        <h3>✨ Add New Task</h3>
        <form onSubmit={addTask}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="What do you need to do today?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : "+ Add Task"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center">Loading tasks...</div>
      ) : (
        <>
          {/* Pending Tasks */}
          <div className="card">
            <h3>⏳ Pending Tasks ({pendingTasks.length})</h3>
            {pendingTasks.length === 0 ? (
              <p>No pending tasks. Great job!</p>
            ) : (
              pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleStatus={toggleTaskStatus}
                  onDelete={deleteTask}
                  onEdit={editTask}
                />
              ))
            )}
          </div>

          {/* Completed Tasks */}
          <div className="card">
            <h3>✅ Completed Tasks ({completedTasks.length})</h3>
            {completedTasks.length === 0 ? (
              <p>No completed tasks yet.</p>
            ) : (
              completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleStatus={toggleTaskStatus}
                  onDelete={deleteTask}
                  onEdit={editTask}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

const TaskItem = ({ task, onToggleStatus, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(task.id, editTitle);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  return (
    <div className="task-item">
      <div className="task-content">
        {isEditing ? (
          <input
            type="text"
            className="form-control"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleEdit();
              }
              if (e.key === "Escape") {
                handleCancel();
              }
            }}
            autoFocus
          />
        ) : (
          <>
            <div className="task-title">{task.title}</div>
            <span className={`task-status status-${task.status}`}>
              {task.status}
            </span>
          </>
        )}
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button className="btn btn-success" onClick={handleEdit}>
              ✅ Save
            </button>
            <button className="btn btn-outline" onClick={handleCancel}>
              ❌ Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-primary"
              onClick={() => onToggleStatus(task.id, task.status)}
            >
              {task.status === "pending" ? "✅ Complete" : "↩️ Undo"}
            </button>
            <button
              className="btn btn-warning"
              onClick={() => setIsEditing(true)}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(task.id)}
            >
              🗑️ Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
