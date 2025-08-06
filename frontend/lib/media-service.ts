/**
 * Módulo para gestión de medios (Media) en la aplicación.
 * Define tipos, funciones para obtención, manipulación y subida de medios.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

import { getToken } from "./api-backend";

/**
 * Tipo que representa los posibles valores del tipo de media.
 */
export type MediaType = "image" | "video" | "audio" | string;

/**
 * Definición extendida del tipo MediaItem que representa un medio con sus propiedades necesarias para la UI.
 */
export type MediaItem = {
  id: string;
  title: string;
  description?: string;       // Opcional
  url: string;                // URL base
  mediaUrl?: string;          // URL para renderizado (puede coincidir con url)
  thumbnailUrl?: string;      // Miniatura opcional
  userId: string;
  username?: string;          // Nombre del usuario que subió el media
  userPhotoURL?: string;      // Foto del usuario
  createdAt: string;          // ISO string
  updatedAt?: string;
  views: number;
  likes: number;
  comments: number;
  type?: MediaType;           // Tipo de media para condicional en UI
  challengeTitle?: string;
  hashtags?: string[];
};

/**
 * Obtiene la lista de medios de un usuario público (puede ser autenticado o no).
 * @param userId ID del usuario al que consultar los medios
 * @returns Array de objetos MediaItem
 */
export async function getUserMedia(userId: string): Promise<MediaItem[]> {
  const res = await fetch(`${API_URL}/users/${userId}/media`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let errorMsg = "Error al obtener medios del usuario";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const medias: MediaItem[] = await res.json();
  return medias.map((media) => ({
    ...media,
    mediaUrl: media.mediaUrl || media.url,
  }));
}

/**
 * Obtiene la lista de medios trending (populares), opcionalmente filtrando por orden y límite.
 * @param orderBy Campo para ordenar (por ejemplo, "views", "likes")
 * @param limit Cantidad máxima de resultados
 * @returns Array de objetos MediaItem
 */
export async function getTrendingMedia(
  orderBy?: string,
  limit?: number
): Promise<MediaItem[]> {
  let url = `${API_URL}/media/trending`;
  const params = new URLSearchParams();

  if (orderBy) params.append("orderBy", orderBy);
  if (limit) params.append("limit", limit.toString());

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let errorMsg = "Error al obtener trending";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const medias: MediaItem[] = await res.json();
  return medias.map((media) => ({
    ...media,
    mediaUrl: media.mediaUrl || media.url,
  }));
}

/**
 * Incrementa un contador (vista, like, comentario) de un media.
 * @param mediaId string - ID del media
 * @param stat "views" | "likes" | "comments"
 */
export async function incrementMediaStats(
  mediaId: string,
  stat: "views" | "likes" | "comments"
): Promise<void> {
  const res = await fetch(`${API_URL}/media/${mediaId}/increment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stat }),
  });

  if (!res.ok) {
    let errorMsg = "Error al incrementar estadística";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  // No devuelve nada si está OK
}

/**
 * Opcional: Obtener un solo media por id, con mapeo para mediaUrl.
 * @param mediaId ID del medio a obtener
 * @returns objeto MediaItem o null si no existe
 */
export async function fetchMediaById(mediaId: string): Promise<MediaItem | null> {
  const res = await fetch(`${API_URL}/media/${mediaId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    let errorMsg = "Error al obtener media por ID";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const media: MediaItem = await res.json();
  return {
    ...media,
    mediaUrl: media.mediaUrl || media.url,
  };
}

/**
 * Sube un archivo de media (imagen, video, audio...) a Cloudinary y registra metadata adicional.
 * @param file Archivo a subir
 * @param userId ID del usuario que sube el archivo
 * @param username Nombre del usuario
 * @param userPhotoURL URL foto del usuario
 * @param metadata Información extra como título, descripción, tipo, hashtags, challengeId, etc.
 * @returns URL pública del archivo en Cloudinary
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

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
  formData.append("folder", "retos");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Falta configurar NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");

  // Subimos el archivo a Cloudinary
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Error al subir archivo a Cloudinary");
  }

  const data = await res.json();
  const mediaUrl = data.secure_url as string;

  // Opcionalmente: hacer un POST a tu backend para guardar metadata y vincular la media subida
  try {
    await fetch(`${API_URL}/media/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    // Opcional: puedes decidir si lanzar error o no
  }

  return mediaUrl;
}

/**
 * Exporta la URL base de la API para ser usada en otros módulos si se requiere.
 */
export { API_URL };
