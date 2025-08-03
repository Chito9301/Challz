// app/media/[id]/page.tsx
import React from "react";
import ClientMediaDetail from "./ClientMediaDetail";
import { fetchMediaById, fetchCommentsByMediaId } from "@/lib/api-backend";
import type { MediaItem } from "@/lib/media-service";
import type { Comment } from "@/lib/api-backend";

// Usa esta interfaz estándar que Next.js 15 espera:
interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function MediaDetailPage({ params }: PageProps) {
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
