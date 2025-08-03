// app/media/[id]/page.tsx
import React from "react";
import ClientMediaDetail from "./ClientMediaDetail";
import { fetchMediaById, fetchCommentsByMediaId } from "@/lib/api-backend";
import type { MediaItem } from "@/lib/media-service";
import type { Comment } from "@/lib/api-backend";

type Params = { params: { id: string } };

export default async function MediaDetailPage({ params }: Params) {
  const { id } = params;

  const media: MediaItem | null = await fetchMediaById(id);
  if (!media) {
    // Aquí puedes usar la página 404 o redirección
    return <div className="min-h-screen flex items-center justify-center text-white bg-black">Contenido no encontrado</div>;
  }

  const comments: Comment[] = await fetchCommentsByMediaId(id);

  return <ClientMediaDetail initialMedia={media} initialComments={comments} mediaId={id} />;
}
