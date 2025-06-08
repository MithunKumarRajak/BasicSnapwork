"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const savedUser = localStorage.getItem("snapwork_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("snapwork_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - accept any email with password "password123"
    if (password === "password123") {
      const mockUser: User = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        role: "user",
        createdAt: new Date().toISOString(),
      }

      setUser(mockUser)
      localStorage.setItem("snapwork_user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: role as "user" | "worker" | "employer",
      createdAt: new Date().toISOString(),
    }

    setUser(newUser)
    localStorage.setItem("snapwork_user", JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("snapwork_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
