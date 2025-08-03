// Servicio centralizado para obtener y gestionar media (retos/archivos/estadísticas) desde el backend.
// Todas las llamadas usan la variable de entorno para la URL base y token JWT guardado.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

import { getToken } from "./api-backend";

/**
 * Obtiene la lista de medios de un usuario público (puede ser autenticado o no)
 * @param userId ID del usuario al que consultar los medios
 * @returns Array de objetos media
 */
export async function getUserMedia(userId: string) {
  // Este endpoint suele no requerir autenticación
  const res = await fetch(`${API_URL}/users/${userId}/media`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    let errorMsg = "Error al obtener medios del usuario";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

/**
 * Obtiene la lista de medios trending (populares)
 * @returns Array de objetos media
 */
export async function getTrendingMedia() {
  const res = await fetch(`${API_URL}/media/trending`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    let errorMsg = "Error al obtener trending";
    try {
      const data = await res.json();
      errorMsg = data.error || data.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

/**
 * Incrementa un contador (vista, like, comentario) de un media.
 * @param mediaId string - ID del media
 * @param stat "views" | "likes" | "comments"
 */
export async function incrementMediaStats(mediaId: string, stat: "views" | "likes" | "comments") {
  const res = await fetch(`${API_URL}/media/${mediaId}/increment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
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
 * Sube un archivo de media (imagen, video, audio...) a Cloudinary.
 * Puede usarse desde el frontend directamente o llamar a un endpoint backend que procese la subida.
 * @param file archivo a subir
 * @returns string URL pública del archivo en Cloudinary
 */
export async function uploadMedia(file: File): Promise<string> {
  // Aquí subimos directamente a Cloudinary, pero podrías hacer un POST a tu backend
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
  formData.append("folder", "retos");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error("Error al subir archivo a Cloudinary");

  const data = await res.json();
  return data.secure_url;
}


