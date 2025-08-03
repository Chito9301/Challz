// app/media/[id]/page.tsx
import React from "react";
import ClientMediaDetail from "./ClientMediaDetail";
import { fetchMediaById, fetchCommentsByMediaId } from "@/lib/api-backend";
import type { MediaItem } from "@/lib/media-service";
import type { Comment } from "@/lib/api-backend";

// Usamos props sin tipado estricto (any) para evitar error de tipo PageProps en Next.js 15
export default async function MediaDetailPage(props: any) {
  const { params } = props;
  const { id } = params;

  const media: MediaItem | null = await fetchMediaById(id);

  if (!media) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Contenido no encontrado
      </div>
    );
  }

  const comments: Comment[] = await fetchCommentsByMediaId(id);

  return <ClientMediaDetail initialMedia={media} initialComments={comments} mediaId={id} />;
}
