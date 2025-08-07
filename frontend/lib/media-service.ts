/**
 * Servicio para gestión de medios (Media) en la aplicación.
 * Exporta tipos, funciones para subir, obtener y modificar datos de media.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Tipo que representa posibles valores para el tipo media
export type MediaType = "video" | "image" | "audio" | string;

/**
 * Interfaz exportada del tipo MediaItem, usada para tipar media en toda la app.
 */
export interface MediaItem {
  id: string;
  userId: string;
  username: string;
  userPhotoURL?: string;
  title: string;
  description: string;
  url?: string;             // Url base, opcional para retrocompatibilidad
  mediaUrl?: string;
  thumbnailUrl?: string;
  type: MediaType;
  hashtags: string[];
  likes: number;
  views: number;
  comments: number;
  createdAt: string;       // Fecha en formato ISO string
  updatedAt?: string;
  challengeId?: string;
  challengeTitle?: string;
}

/** Configuración para subida a Cloudinary */
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
  throw new Error("Cloudinary no está configurado correctamente en variables de entorno");
}

/**
 * Sube un archivo a Cloudinary y devuelve URL pública y miniatura (opcional).
 * Útil para separar la subida del registro en backend.
 */
export async function uploadToCloudinary(
  file: File,
  folderPath: string
): Promise<{ secure_url: string; thumbnail_url?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);
  formData.append("folder", folderPath);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Error subiendo archivo a Cloudinary: " + errorText);
  }

  return await res.json();
}

/**
 * Sube media: sube archivo a Cloudinary y registra metadata en backend.
 * Devuelve la URL pública del media subido.
 */
export async function uploadMedia(
  file: File,
  userId: string,
  username: string,
  userPhotoURL?: string,
  metadata?: {
    title?: string;
    description?: string;
    type?: MediaType;
    hashtags?: string[];
    challengeId?: string;
    challengeTitle?: string;
  }
): Promise<string> {
  if (!file) throw new Error("Archivo no proporcionado");

  const folderPath = `${userId}/${metadata?.type || "unknown"}`;
  const uploadResult = await uploadToCloudinary(file, folderPath);

  const mediaUrl = uploadResult.secure_url;

  try {
    await fetch(`${API_URL}/media/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: mediaUrl,
        userId,
        username,
        userPhotoURL,
        ...metadata,
      }),
    });
  } catch (error) {
    console.error("Error registrando metadata de media:", error);
  }

  return mediaUrl;
}

/**
 * Obtiene media trending, ordenada por 'views', 'likes' o 'comments'.
 * @param orderBy campo de orden (opcional, defecto 'views')
 * @param limit cantidad máxima (opcional, defecto 10)
 */
export async function getTrendingMedia(
  orderBy: "views" | "likes" | "comments" = "views",
  limit: number = 10
): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${API_URL}/media/trending?orderBy=${orderBy}&limit=${limit}`);

    if (!res.ok) throw new Error("Error obteniendo trending media");

    return await res.json();
  } catch (error) {
    console.warn("getTrendingMedia fallback vacío:", error);
    return [];
  }
}

/**
 * Obtiene media más reciente.
 * @param limit cantidad máxima (opcional, defecto 10)
 */
export async function getRecentMedia(limit: number = 10): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${API_URL}/media/recent?limit=${limit}`);

    if (!res.ok) throw new Error("Error obteniendo media reciente");

    return await res.json();
  } catch (error) {
    console.warn("getRecentMedia fallback vacío:", error);
    return [];
  }
}

/**
 * Obtiene media de un usuario.
 * @param userId ID del usuario
 */
export async function getUserMedia(userId: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${API_URL}/media/user/${userId}`);

    if (!res.ok) throw new Error("Error obteniendo media de usuario");

    return await res.json();
  } catch (error) {
    console.warn("getUserMedia fallback vacío:", error);
    return [];
  }
}

/**
 * Incrementa estadística (views, likes, comments) de un media.
 */
export async function incrementMediaStats(
  mediaId: string,
  stat: "views" | "likes" | "comments"
): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/media/${mediaId}/increment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stat }),
    });

    if (!res.ok) throw new Error("Error incrementando estadística");
  } catch (error) {
    console.warn(`incrementMediaStats error para media ${mediaId}:`, error);
  }
}

/**
 * Obtiene un media por ID.
 * @param mediaId ID del media
 * @returns MediaItem o null si no existe
 */
export async function fetchMediaById(mediaId: string): Promise<MediaItem | null> {
  try {
    const res = await fetch(`${API_URL}/media/${mediaId}`);

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Error al obtener media por ID");
    }

    const media: MediaItem = await res.json();

    return {
      ...media,
      mediaUrl: media.mediaUrl || media.url,
    };
  } catch (error) {
    throw new Error(`Error en fetchMediaById: ${error}`);
  }
}


