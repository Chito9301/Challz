"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MoreVertical,
  Share2,
  Music,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { incrementMediaStats, type MediaItem } from "@/lib/media-service";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/app-icon";
import { postComment, type Comment as CommentType } from "@/lib/api-backend";

/**
 * Props que recibe este componente cliente:
 * - initialMedia: datos iniciales del media (imagen, video, audio...)
 * - initialComments: comentarios iniciales del media
 * - mediaId: id del media para hacer llamadas posteriores
 */
interface ClientMediaDetailProps {
  initialMedia: MediaItem;
  initialComments: CommentType[];
  mediaId: string;
}

/**
 * Definición del tipo User, para que TS reconozca las propiedades usadas
 */
interface User {
  id: string;
  username?: string;
  photoURL?: string;
}

export default function ClientMediaDetail({
  initialMedia,
  initialComments,
  mediaId,
}: ClientMediaDetailProps) {
  const { user } = useAuth() as { user: User | null };
  const router = useRouter();

  const [media, setMedia] = useState<MediaItem | null>(initialMedia);
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (media) {
      try {
        await incrementMediaStats(media.id, "likes");
        setMedia((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
      } catch (error) {
        console.error("Error liking media:", error);
      }
    }
  };

  const handleAddComment = async () => {
    if (!user || !commentText.trim() || !media) return;

    try {
      setSubmitting(true);

      const newComment = await postComment(media.id, {
        userId: user.id,
        username: user.username || "Usuario",
        userPhotoURL: user.photoURL || "",
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      });

      await incrementMediaStats(media.id, "comments");

      setComments((prev) => [newComment, ...prev]);
      setMedia((prev) => (prev ? { ...prev, comments: prev.comments + 1 } : null));
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(
        `Error al enviar comentario: ${
          error instanceof Error ? error.message : error
        }`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimestamp = (isoDate: string) => {
    const now = new Date();
    const commentDate = new Date(isoDate);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400"
                aria-label="Volver al inicio"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Cargando...</h1>
          </div>
        </header>

        <main className="flex-1 pt-16 pb-20">
          <div className="relative h-[calc(100vh-8rem)] bg-zinc-900">
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin-slow">
                <AppIcon size={64} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400"
                aria-label="Volver al inicio"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold">Contenido no encontrado</h1>
          </div>
        </header>

        <main className="flex-1 pt-16 pb-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">El contenido que buscas no está disponible</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">{media.title}</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400"
          aria-label="Más opciones"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 pt-16 pb-20">
        <div className="relative h-[calc(100vh-16rem)] bg-zinc-900">
          {media.type === "image" ? (
            <Image
              src={media.mediaUrl || "/placeholder.svg"}
              alt={media.title}
              fill
              className="object-contain"
              priority
            />
          ) : media.type === "video" ? (
            <video
              src={media.mediaUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-purple-900/20 to-black">
              <div className="text-center p-4">
                <Music className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <p className="text-xl font-bold mb-4">{media.title}</p>
                <audio src={media.mediaUrl} controls className="w-full" autoPlay />
              </div>
            </div>
          )}

          <div className="absolute right-4 top-4 z-10 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/40 backdrop-blur-md"
                onClick={handleLike}
                aria-label="Me gusta"
              >
                <Heart className="h-6 w-6" />
              </Button>
              <span className="text-xs mt-1">{media.likes}</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/40 backdrop-blur-md"
                aria-label="Comentarios"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              <span className="text-xs mt-1">{media.comments}</span>
            </div>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/40 backdrop-blur-md"
                aria-label="Compartir"
              >
                <Share2 className="h-6 w-6" />
              </Button>
              <span className="text-xs mt-1">Compartir</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-purple-500">
              <AvatarImage
                src={media.userPhotoURL || "/placeholder.svg?height=40&width=40"}
                alt={media.username}
              />
              <AvatarFallback>{media.username?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{media.username}</p>
              {media.challengeTitle && (
                <p className="text-xs text-zinc-400">Reto: {media.challengeTitle}</p>
              )}
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700 text-white"
            >
              Seguir
            </Button>
          </div>

          <p className="text-sm mb-3">{media.description}</p>

          {media.hashtags && media.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {media.hashtags.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white border-none text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h3 className="font-medium mb-3">Comentarios ({media.comments})</h3>
          <div className="space-y-4 mb-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.userPhotoURL || `/placeholder.svg?height=32&width=32`}
                      alt={comment.username}
                    />
                    <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{comment.username}</p>
                      <span className="text-xs text-zinc-500">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-zinc-400 hover:text-zinc-300"
                      >
                        Me gusta
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-xs text-zinc-400 hover:text-zinc-300"
                      >
                        Responder
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-400 py-4">
                No hay comentarios aún. ¡Sé el primero en comentar!
              </p>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.photoURL || "/placeholder.svg?height=32&width=32"}
                  alt={user.username || "Usuario"}
                />
                <AvatarFallback>{user.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <Input
                  placeholder="Añadir un comentario..."
                  className="bg-zinc-900 border-zinc-700 pr-20"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  aria-label="Comentario"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleAddComment}
                  disabled={submitting || !commentText.trim()}
                  aria-disabled={submitting || !commentText.trim()}
                  aria-label="Publicar comentario"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    "Publicar"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <Link href="/auth/login">
                <Button
                  variant="link"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Inicia sesión para comentar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

