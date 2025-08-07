/**
 * Servicio combinado para gestión de medios (Media).
 * Combina definición de tipos y funciones antiguas y actuales,
 * añadiendo tipos exportados, funciones de subida a Cloudinary por separado,
 * y funciones para obtener trending, recientes, de usuarios, y para incrementar stats.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type MediaType = "video" | "image" | "audio" | string;

/**
 * Tipo MediaItem (exportado), según versión antigua pero extendida.
 */
export interface MediaItem {
  id: string;
  userId: string;
  username: string;
  userPhotoURL?: string;
  title: string;
  description: string;
  url?: string;             // añadido opcional para retrocompatibilidad
  mediaUrl?: string;
  thumbnailUrl?: string;
  type: MediaType;
  hashtags: string[];
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  updatedAt?: string;
  challengeId?: string;
  challengeTitle?: string;
}

/** Cloudinary configuración (variables de entorno obligatorias) */
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
  throw new Error("Cloudinary no está configurado correctamente en variables de entorno");
}

/**
 * Función para subir archivos a Cloudinary (separada para mayor control).
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
 * Función para subir media: sube a Cloudinary y registra en backend.
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

  // Subir archivo a Cloudinary usando función separada
  const uploadResult = await uploadToCloudinary(file, folderPath);

  const mediaUrl = uploadResult.secure_url;

  // Registrar metadata en backend
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
 * Obtiene la lista de medios trending (populares), opcionalmente filtrando por orden y límite.
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
 * Obtiene la lista de medios más recientes (función del archivo antiguo).
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
 * Obtiene la lista de medios de un usuario en particular.
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
 * Incrementa un contador (vista, like, comentario) de un media.
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
 * Opcional: Obtener un sólo media por ID con mapeo para mediaUrl.
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

