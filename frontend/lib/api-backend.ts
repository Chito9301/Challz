const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("Falta la variable de entorno NEXT_PUBLIC_API_URL (ruta base del backend)");
}

const TOKEN_KEY = "auth_token";

/** Guarda token JWT en almacenamiento local */
export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Obtiene el token JWT guardado */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** Elimina el token, p. ej. al hacer logout */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Función central para hacer peticiones al backend.
 * Añade token si la ruta requiere autenticación.
 * Lanza error con mensaje adecuado si la respuesta no es OK.
 *
 * @param endpoint Ruta del endpoint relativo a API_URL (ej: "/auth/login").
 * @param options Opciones de fetch.
 * @param authRequired Si es true, incluye el token en header Authorization.
 * @returns JSON parseado del response, o null si status 204.
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  authRequired: boolean = false
): Promise<any> {
  const url = `${API_URL}${endpoint}`;
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authRequired) {
    const token = getToken();
    if (!token) throw new Error("No autenticado");
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let errorMsg = "Error desconocido";
    try {
      const data = await res.json();
      // El backend debería responder con { error: "...", message: "..." } idealmente
      errorMsg = data.error || data.message || errorMsg;
    } catch {
      // La respuesta no pudo interpretarse como JSON, dejamos mensaje genérico
    }
    throw new Error(errorMsg);
  }

  // Código 204 significa "No Content"
  if (res.status === 204) {
    return null;
  }

  return res.json();
}

// --- Funciones específicas para endpoints comunes ---

/**
 * Login de usuario.
 * @param email 
 * @param password 
 * @returns Objeto con token y datos de usuario (según backend)
 */
export async function login(email: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Registro de usuario nuevo.
 * @param user Objeto usuario { username, email, password }
 * @returns Datos o confirmación del usuario.
 */
export async function registerUser(user: { username: string; email: string; password: string }) {
  return apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

/**
 * Logout del usuario (si backend lo soporta).
 */
export async function logout() {
  return apiFetch("/auth/logout", {
    method: "POST",
  }, true);
}

/**
 * Obtiene perfil del usuario autenticado.
 */
export async function getUserProfile() {
  return apiFetch("/user/profile", { method: "GET" }, true);
}

/**
 * Obtiene media por id.
 * @param id id del media
 */
export async function fetchMediaById(id: string) {
  return apiFetch(`/media/${id}`, { method: "GET" }, false);
}

/**
 * Obtiene comentarios de media específico.
 * @param mediaId id del media
 */
export async function fetchCommentsByMediaId(mediaId: string) {
  return apiFetch(`/media/${mediaId}/comments`, { method: "GET" }, false);
}

/**
 * Añade comentario a un medio.
 */
export async function postComment(
  mediaId: string,
  comment: {
    userId: string;
    username: string;
    userPhotoURL?: string;
    text: string;
    createdAt: string;
  }
) {
  return apiFetch(
    `/media/${mediaId}/comments`,
    {
      method: "POST",
      body: JSON.stringify(comment),
    },
    true
  );
}

/**
 * Obtiene medios de un usuario.
 * @param userId id del usuario
 */
export async function getUserMedia(userId: string) {
  return apiFetch(`/users/${userId}/media`, { method: "GET" }, false);
}

/**
 * Obtiene media trending.
 */
export async function getTrendingMedia() {
  return apiFetch(`/media/trending`, { method: "GET" }, false);
}

// Puedes agregar más funciones específicas a tu API según lo necesites.

