"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import { ArrowLeft, Plus, Search, Trash2, CheckCircle2, Circle, Calendar, Edit2 } from "lucide-react"
import { format } from "date-fns"

interface Task {
  id: number
  title: string
  description: string
  projectId: number
  dueDate: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

interface Project {
  id: number
  title: string
  description: string
  totalTasks: number
  completedTasks: number
  progressPercentage: number
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState("")
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProject()
    fetchTasks()
  }, [id])

  useEffect(() => {
    let filtered = tasks

    if (filterStatus === "active") {
      filtered = filtered.filter((task) => !task.completed)
    } else if (filterStatus === "completed") {
      filtered = filtered.filter((task) => task.completed)
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredTasks(filtered)
  }, [searchQuery, filterStatus, tasks])

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProject(response.data)
    } catch (err) {
      console.error("Failed to fetch project", err)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/api/tasks/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTasks(response.data)
      setFilteredTasks(response.data)
    } catch (err) {
      console.error("Failed to fetch tasks", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await axios.post(
        "http://localhost:8083/api/tasks",
        {
          title,
          description,
          projectId: Number(id),
          dueDate: dueDate || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setTitle("")
      setDescription("")
      setDueDate("")
      setShowCreateModal(false)
      fetchTasks()
      fetchProject()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task")
    }
  }

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!editingTask) return

    try {
      await axios.put(
        `http://localhost:8083/api/tasks/${editingTask.id}`,
        {
          title,
          description,
          projectId: Number(id),
          dueDate: dueDate || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setTitle("")
      setDescription("")
      setDueDate("")
      setEditingTask(null)
      setShowEditModal(false)
      fetchTasks()
      fetchProject()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task")
    }
  }

  const handleToggleTask = async (taskId: number) => {
    try {
      await axios.patch(`http://localhost:8083/api/tasks/${taskId}/toggle`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchTasks()
      fetchProject()
    } catch (err) {
      console.error("Failed to toggle task", err)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return

    try {
      await axios.delete(`http://localhost:8083/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchTasks()
      fetchProject()
    } catch (err) {
      console.error("Failed to delete task", err)
    }
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description || "")
    setDueDate(task.dueDate || "")
    setShowEditModal(true)
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <div style={{ fontSize: "1.25rem", color: "#a0a0a0" }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Header */}
      <header
        style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #2a2a2a",
          padding: "1rem 2rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "#2a2a2a",
              color: "#d0d0d0",
              border: "1px solid #3a3a3a",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "1rem",
            }}
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>

          {project && (
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "white", marginBottom: "0.5rem" }}>
                {project.title}
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#a0a0a0", marginBottom: "1rem" }}>
                {project.description || "No description"}
              </p>

              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    background: "#0a0a0a",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "#d0d0d0", fontWeight: "500" }}>{project.totalTasks}</span>
                  <span style={{ color: "#a0a0a0" }}>Total Tasks</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    background: "#0a0a0a",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "#d0d0d0", fontWeight: "500" }}>{project.completedTasks}</span>
                  <span style={{ color: "#a0a0a0" }}>Completed</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    background: "#0a0a0a",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "#667eea", fontWeight: "600" }}>{project.progressPercentage.toFixed(0)}%</span>
                  <span style={{ color: "#a0a0a0" }}>Progress</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        {/* Actions Bar */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "250px" }}>
            <Search
              size={18}
              style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)" }}
              color="#a0a0a0"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 0.75rem 0.75rem 2.75rem",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "10px",
                color: "white",
                fontSize: "0.875rem",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              background: "#1a1a1a",
              padding: "0.25rem",
              borderRadius: "10px",
              border: "1px solid #2a2a2a",
            }}
          >
            <button
              onClick={() => setFilterStatus("all")}
              style={{
                padding: "0.5rem 1rem",
                background: filterStatus === "all" ? "#667eea" : "transparent",
                color: filterStatus === "all" ? "white" : "#d0d0d0",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              style={{
                padding: "0.5rem 1rem",
                background: filterStatus === "active" ? "#667eea" : "transparent",
                color: filterStatus === "active" ? "white" : "#d0d0d0",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              style={{
                padding: "0.5rem 1rem",
                background: filterStatus === "completed" ? "#667eea" : "transparent",
                color: filterStatus === "completed" ? "white" : "#d0d0d0",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Completed
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "600",
            }}
          >
            <Plus size={18} />
            New Task
          </button>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
            }}
          >
            <CheckCircle2 size={48} color="#4a4a4a" style={{ margin: "0 auto 1rem" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#d0d0d0", marginBottom: "0.5rem" }}>
              {searchQuery || filterStatus !== "all" ? "No tasks found" : "No tasks yet"}
            </h2>
            <p style={{ color: "#a0a0a0", marginBottom: "1.5rem" }}>
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                }}
              >
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  padding: "1.25rem",
                  display: "flex",
                  alignItems: "start",
                  gap: "1rem",
                }}
              >
                <button
                  onClick={() => handleToggleTask(task.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.25rem",
                    marginTop: "0.125rem",
                  }}
                >
                  {task.completed ? <CheckCircle2 size={24} color="#52c41a" /> : <Circle size={24} color="#4a4a4a" />}
                </button>

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: task.completed ? "#6a6a6a" : "white",
                      textDecoration: task.completed ? "line-through" : "none",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#a0a0a0",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#a0a0a0",
                      }}
                    >
                      <Calendar size={14} />
                      <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => openEditModal(task)}
                    style={{
                      padding: "0.5rem",
                      background: "#2a2a2a",
                      color: "#d0d0d0",
                      border: "1px solid #3a3a3a",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{
                      padding: "0.5rem",
                      background: "#2a2a2a",
                      color: "#ff4d4f",
                      border: "1px solid #3a3a3a",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 50,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "2rem",
              width: "100%",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "white", marginBottom: "1.5rem" }}>
              Create New Task
            </h2>

            <form onSubmit={handleCreateTask}>
              {error && (
                <div
                  style={{
                    background: "#ff4d4f20",
                    border: "1px solid #ff4d4f",
                    color: "#ff4d4f",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="task-title"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#d0d0d0",
                  }}
                >
                  Task Title
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                  }}
                  placeholder="Complete user authentication"
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="task-description"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#d0d0d0",
                  }}
                >
                  Description (Optional)
                </label>
                <textarea
                  id="task-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                  placeholder="Describe the task..."
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="task-duedate"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#d0d0d0",
                  }}
                >
                  Due Date (Optional)
                </label>
                <input
                  id="task-duedate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#2a2a2a",
                    color: "#d0d0d0",
                    border: "1px solid #3a3a3a",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 50,
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "2rem",
              width: "100%",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "white", marginBottom: "1.5rem" }}>Edit Task</h2>

            <form onSubmit={handleEditTask}>
              {error && (
                <div
                  style={{
                    background: "#ff4d4f20",
                    border: "1px solid #ff4d4f",
                    color: "#ff4d4f",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="edit-task-title"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#d0d0d0",
                  }}
                >
                  Task Title
                </label>
                <input
                  id="edit-task-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="edit-task-description"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#d0d0d0",
                  }}
                >
                  Description (Optional)
                </label>
                <textarea
                  id="edit-task-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="edit-task-duedate"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#d0d0d0",
                  }}
                >
                  Due Date (Optional)
                </label>
                <input
                  id="edit-task-duedate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: "#0a0a0a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "#2a2a2a",
                    color: "#d0d0d0",
                    border: "1px solid #3a3a3a",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail
