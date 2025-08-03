"use client"

import React, { createContext, useContext, useState } from "react"
import { registerUser, loginUser, saveToken, getToken } from "@/lib/api-backend"

interface AuthBackendContextType {
  user: { id: string; username: string; email: string } | null
  loading: boolean
  signUp: (username: string, email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthBackendContext = createContext<AuthBackendContextType>({
  user: null,
  loading: false,
  signUp: async () => {},
  signIn: async () => {},
  logout: () => {},
})

export const useAuthBackend = () => useContext(AuthBackendContext)

export const AuthBackendProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const signUp = async (username: string, email: string, password: string) => {
    setLoading(true)
    try {
      await registerUser({ username, email, password })
      // Opcional: auto-login después de registro
      await signIn(email, password)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { token, user } = await loginUser({ email, password })
      saveToken(token)
      setUser(user)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    saveToken("")
    setUser(null)
  }

  return (
    <AuthBackendContext.Provider value={{ user, loading, signUp, signIn, logout }}>
      {children}
    </AuthBackendContext.Provider>
  )
}
