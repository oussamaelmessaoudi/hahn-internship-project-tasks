"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import { Plus, Search, LogOut, FolderOpen, CheckCircle2, Clock } from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  userId: number
  createdAt: string
  updatedAt: string
  totalTasks: number
  completedTasks: number
  progressPercentage: number
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredProjects(filtered)
    }
  }, [searchQuery, projects])

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8082/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProjects(response.data)
      setFilteredProjects(response.data)
    } catch (err) {
      console.error("Failed to fetch projects", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await axios.post(
        "http://localhost:8082/api/projects",
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setTitle("")
      setDescription("")
      setShowCreateModal(false)
      fetchProjects()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
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
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "10px",
            }}
          >
            <FolderOpen size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "700", color: "white" }}>Task Manager</h1>
            <p style={{ fontSize: "0.875rem", color: "#a0a0a0" }}>Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
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
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
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
              placeholder="Search projects..."
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
            New Project
          </button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
            }}
          >
            <FolderOpen size={48} color="#4a4a4a" style={{ margin: "0 auto 1rem" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#d0d0d0", marginBottom: "0.5rem" }}>
              {searchQuery ? "No projects found" : "No projects yet"}
            </h2>
            <p style={{ color: "#a0a0a0", marginBottom: "1.5rem" }}>
              {searchQuery ? "Try a different search term" : "Create your first project to get started"}
            </p>
            {!searchQuery && (
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
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#667eea"
                  e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a2a"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <div style={{ display: "flex", alignItems: "start", gap: "1rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "48px",
                      height: "48px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "10px",
                      flexShrink: 0,
                    }}
                  >
                    <FolderOpen size={24} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "white",
                        marginBottom: "0.25rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#a0a0a0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.description || "No description"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      background: "#0a0a0a",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    }}
                  >
                    <Clock size={14} color="#a0a0a0" />
                    <span style={{ color: "#d0d0d0", fontWeight: "500" }}>{project.totalTasks}</span>
                    <span style={{ color: "#a0a0a0" }}>tasks</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.75rem",
                      background: "#0a0a0a",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                    }}
                  >
                    <CheckCircle2 size={14} color="#52c41a" />
                    <span style={{ color: "#d0d0d0", fontWeight: "500" }}>{project.completedTasks}</span>
                    <span style={{ color: "#a0a0a0" }}>done</span>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>Progress</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#667eea" }}>
                      {project.progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      background: "#0a0a0a",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${project.progressPercentage}%`,
                        background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
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
              Create New Project
            </h2>

            <form onSubmit={handleCreateProject}>
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
                  htmlFor="title"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#d0d0d0",
                  }}
                >
                  Project Title
                </label>
                <input
                  id="title"
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
                  placeholder="My Awesome Project"
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="description"
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
                  id="description"
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
                  placeholder="Describe your project..."
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
