"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

interface User {
  userId: number
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
      }
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const response = await axios.post("http://localhost:8081/api/auth/login", {
      email,
      password,
    })

    const { token: authToken, userId, email: userEmail, name } = response.data
    const userData = { userId, email: userEmail, name }

    localStorage.setItem("token", authToken)
    localStorage.setItem("user", JSON.stringify(userData))

    setToken(authToken)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await axios.post("http://localhost:8081/api/auth/register", {
      name,
      email,
      password,
    })

    const { token: authToken, userId, email: userEmail, name: userName } = response.data
    const userData = { userId, email: userEmail, name: userName }

    localStorage.setItem("token", authToken)
    localStorage.setItem("user", JSON.stringify(userData))

    setToken(authToken)
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
