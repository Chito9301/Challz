// media-service.ts

export type MediaType = "video" | "image" | "audio"

export interface MediaItem {
  id: string
  userId: string
  username: string
  userPhotoURL?: string
  title: string
  description: string
  mediaUrl: string
  thumbnailUrl?: string
  type: MediaType
  hashtags: string[]
  likes: number
  views: number
  comments: number
  createdAt: string // ahora ISO string por uso de MongoDB
  challengeId?: string
  challengeTitle?: string
}

// Cloudinary config: asegúrate de definir bien estas vars en tu entorno
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

if (!CLOUDINARY_UPLOAD_URL || !CLOUDINARY_UPLOAD_PRESET) {
  throw new Error("Cloudinary no está configurado correctamente en variables de entorno")
}

/**
 * Sube un archivo a Cloudinary y devuelve la URL pública.
 */
export async function uploadToCloudinary(file: File, folderPath: string): Promise<{ secure_url: string; thumbnail_url?: string }> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  formData.append("folder", folderPath)

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error("Error subiendo archivo a Cloudinary: " + errorText)
  }

  return await res.json()
}

/**
 * Función para subir media y registrar en base de datos MongoDB a través de backend API.
 * Debes implementar ese endpoint '/api/media' en tu backend.
 */
export async function uploadMedia(
  file: File,
  userId: string,
  username: string,
  userPhotoURL: string | null,
  metadata: {
    title: string
    description: string
    type: MediaType
    hashtags: string[]
    challengeId?: string
    challengeTitle?: string
  }
): Promise<MediaItem> {
  try {
    // Primero subimos el archivo a Cloudinary
    const folderPath = `${userId}/${metadata.type}`
    const uploadResult = await uploadToCloudinary(file, folderPath)

    // Armamos el objeto para enviar al backend
    const mediaData = {
      userId,
      username,
      userPhotoURL: userPhotoURL || undefined,
      title: metadata.title,
      description: metadata.description,
      mediaUrl: uploadResult.secure_url,
      thumbnailUrl: uploadResult.thumbnail_url || uploadResult.secure_url,
      type: metadata.type,
      hashtags: metadata.hashtags,
      likes: 0,
      views: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      challengeId: metadata.challengeId || undefined,
      challengeTitle: metadata.challengeTitle || undefined,
    }

    // Llamamos a la API para guardar en MongoDB
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mediaData),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error("Error registrando media en backend: " + errorText)
    }

    const savedMedia: MediaItem = await res.json()
    return savedMedia
  } catch (error: any) {
    console.error("uploadMedia error:", error)
    throw error
  }
}

/**
 * Obtiene media destacada ordenada por un campo ('views', 'likes' o 'comments')
 */
export async function getTrendingMedia(type: "views" | "likes" | "comments", limitCount = 10): Promise<MediaItem[]> {
  try {
    const res = await fetch(`/api/media/trending?type=${type}&limit=${limitCount}`)
    if (!res.ok) throw new Error("Error obteniendo media destacada")
    return await res.json()
  } catch (error) {
    console.warn("getTrendingMedia fallback empty:", error)
    return []
  }
}

/**
 * Obtiene media más reciente
 */
export async function getRecentMedia(limitCount = 10): Promise<MediaItem[]> {
  try {
    const res = await fetch(`/api/media/recent?limit=${limitCount}`)
    if (!res.ok) throw new Error("Error obteniendo media reciente")
    return await res.json()
  } catch (error) {
    console.warn("getRecentMedia fallback empty:", error)
    return []
  }
}

/**
 * Obtiene media de un usuario en particular
 */
export async function getUserMedia(userId: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(`/api/media/user/${userId}`)
    if (!res.ok) throw new Error("Error obteniendo media de usuario")
    return await res.json()
  } catch (error) {
    console.warn("getUserMedia fallback empty:", error)
    return []
  }
}

/**
 * Incrementa contadores como views, likes, comments
 */
export async function incrementMediaStats(mediaId: string, field: "views" | "likes" | "comments"): Promise<void> {
  try {
    const res = await fetch(`/api/media/${mediaId}/increment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field }),
    })
    if (!res.ok) throw new Error("Error incrementando stats")
  } catch (error) {
    console.warn(`incrementMediaStats error para media ${mediaId}:`, error)
  }
  }
  
