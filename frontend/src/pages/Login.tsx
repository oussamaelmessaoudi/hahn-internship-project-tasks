"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Lock } from "lucide-react"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        padding: "1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "16px",
              marginBottom: "1rem",
            }}
          >
            <Lock size={32} color="white" />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "white", marginBottom: "0.5rem" }}>Welcome Back</h1>
          <p style={{ color: "#a0a0a0" }}>Sign in to manage your projects</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ background: "#1a1a1a", padding: "2rem", borderRadius: "12px", border: "1px solid #2a2a2a" }}
        >
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
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#d0d0d0",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="you@example.com"
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#d0d0d0",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#a0a0a0" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
