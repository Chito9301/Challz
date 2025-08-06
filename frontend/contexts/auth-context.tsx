"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Tipo que define la estructura del usuario
 */
export interface User {
  id: string;
  username: string;
  email: string;
  photoURL?: string; // Añadido para evitar error en MediaUpload
  // Puedes agregar otros campos que tu backend envíe aquí
}

/**
 * Define el tipo completo del contexto de autenticación
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;          // Carga inicial o solicitud en progreso
  isConfigured: boolean;     // Indica que la carga inicial terminó (user ya está definido o null)
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider del contexto de autenticación
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);         // Proceso activo de carga
  const [isConfigured, setIsConfigured] = useState(false); // Proceso inicial finalizado

  // Al montar, intenta obtener el usuario actual desde API
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
        setIsConfigured(true);  // Indicamos que la carga inicial terminó
      }
    }
    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    const data = await res.json();
    setUser(data.user);
  };

  const signUp = async (username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al registrarse");
    }

    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al solicitar cambio de contraseña");
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
    formData.append("folder", "tu_carpeta");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Error al subir imagen a Cloudinary");

    const data = await res.json();
    return data.secure_url;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isConfigured, signIn, signUp, logout, resetPassword, uploadImage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de autenticación.
 * Lanza error si se usa fuera del Provider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
