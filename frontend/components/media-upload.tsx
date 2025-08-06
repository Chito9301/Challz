"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ImageIcon, Mic, Loader2, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { uploadMedia, type MediaType } from "@/lib/media-service";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MediaUploadProps {
  challengeId?: string;
  challengeTitle?: string;
  onSuccess?: () => void;
}

/**
 * Componente para subir un medio (video, imagen o audio).
 * Gestiona preview, selección de archivo, tipo de medio y envío.
 */
export default function MediaUpload({ challengeId, challengeTitle, onSuccess }: MediaUploadProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Estado para tipo de medio ("video" | "image" | "audio")
  const [mediaType, setMediaType] = useState<MediaType>("video");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  // Referencia al input file para reiniciar en limpieza
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Maneja cambio de archivo. Lee preview si es imagen.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(""); // Limpia error al cambiar
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validar tipo del archivo según mediaType
      if (
        (mediaType === "image" && selectedFile.type.startsWith("image/")) ||
        (mediaType === "video" && selectedFile.type.startsWith("video/")) ||
        (mediaType === "audio" && selectedFile.type.startsWith("audio/"))
      ) {
        setFile(selectedFile);

        if (mediaType === "image") {
          const reader = new FileReader();
          reader.onload = (event) => {
            setPreview(event.target?.result as string);
          };
          reader.readAsDataURL(selectedFile);
        } else {
          setPreview(null);
        }
      } else {
        setError(`El archivo no coincide con el tipo de medio seleccionado (${mediaType}).`);
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  // Maneja la subida del medio, validando campos y enviando el archivo.
  const handleUpload = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!file) {
      setError("Por favor selecciona un archivo para subir.");
      return;
    }

    if (!title.trim()) {
      setError("Por favor ingresa un título.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      // Procesa hashtags en array, asegurando formato con #
      const hashtagArray = hashtags
        .split(/[,\s]+/)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
        .filter((tag) => tag.length > 1);

      // Llama a la función uploadMedia con los parámetros correctos
      await uploadMedia(
        file,
        user.id,
        user.username || "Usuario",
        user.photoURL,
        {
          title,
          description,
          type: mediaType,
          hashtags: hashtagArray,
          challengeId,
          challengeTitle,
        }
      );

      // Limpia form tras subida exitosa
      setFile(null);
      setPreview(null);
      setTitle("");
      setDescription("");
      setHashtags("");

      if (onSuccess) {
        onSuccess();
      }

      router.push("/profile");
    } catch (err) {
      console.error("Error uploading media:", err);
      setError("Ocurrió un error al subir el archivo. Por favor intenta de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  // Activa el input file oculto para seleccionar archivo.
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Limpia el archivo seleccionado y su preview.
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError("");
  };

  return (
    <div className="space-y-6">
      {/* Selector de tipo de media */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-zinc-900 rounded-lg p-1">
          <button
            onClick={() => {
              setMediaType("video");
              clearFile();
            }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              mediaType === "video"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-zinc-400"
            }`}
            type="button"
          >
            <Camera className="h-4 w-4 mr-2" />
            Video
          </button>
          <button
            onClick={() => {
              setMediaType("image");
              clearFile();
            }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              mediaType === "image"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-zinc-400"
            }`}
            type="button"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Foto
          </button>
          <button
            onClick={() => {
              setMediaType("audio");
              clearFile();
            }}
            className={`flex items-center px-4 py-2 rounded-lg ${
              mediaType === "audio"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "text-zinc-400"
            }`}
            type="button"
          >
            <Mic className="h-4 w-4 mr-2" />
            Audio
          </button>
        </div>
      </div>

      {/* Vista previa o selector de archivo */}
      {file ? (
        <div className="relative border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center">
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
            type="button"
            aria-label="Eliminar archivo seleccionado"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {preview && mediaType === "image" ? (
            <div className="relative h-64 w-full">
              <Image src={preview} alt="Preview" fill className="object-contain" />
            </div>
          ) : (
            <div className="py-8">
              <p className="font-medium break-words">{file.name}</p>
              <p className="text-sm text-zinc-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:bg-zinc-900/50 transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              triggerFileInput();
            }
          }}
          aria-label={`Seleccionar archivo de tipo ${mediaType}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={
              mediaType === "video"
                ? "video/*"
                : mediaType === "image"
                ? "image/*"
                : "audio/*"
            }
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center">
            {mediaType === "video" && <Camera className="h-12 w-12 text-zinc-500 mb-4" />}
            {mediaType === "image" && <ImageIcon className="h-12 w-12 text-zinc-500 mb-4" />}
            {mediaType === "audio" && <Mic className="h-12 w-12 text-zinc-500 mb-4" />}

            <h3 className="font-medium mb-2">
              {mediaType === "video" ? "Sube tu video" : mediaType === "image" ? "Sube tu foto" : "Sube tu audio"}
            </h3>
            <p className="text-zinc-500 text-sm mb-4">Arrastra y suelta o haz clic para seleccionar</p>
            <Button className="bg-zinc-800 hover:bg-zinc-700" type="button">
              Seleccionar {mediaType === "video" ? "Video" : mediaType === "image" ? "Foto" : "Audio"}
            </Button>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && <div className="bg-red-900/20 text-red-300 p-3 rounded-md text-sm">{error}</div>}

      {/* Campos de texto: título, descripción, hashtags */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="text-sm text-zinc-400 mb-1 block">
            Título
          </label>
          <Input
            id="title"
            placeholder="Título de tu publicación"
            className="bg-zinc-900 border-zinc-700"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm text-zinc-400 mb-1 block">
            Descripción
          </label>
          <Textarea
            id="description"
            placeholder="Describe tu publicación..."
            className="bg-zinc-900 border-zinc-700 resize-none"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError("");
            }}
          />
        </div>

        <div>
          <label htmlFor="hashtags" className="text-sm text-zinc-400 mb-1 block">
            Hashtags
          </label>
          <Input
            id="hashtags"
            placeholder="#challz #creatividad"
            className="bg-zinc-900 border-zinc-700"
            value={hashtags}
            onChange={(e) => {
              setHashtags(e.target.value);
              setError("");
            }}
          />
        </div>
      </div>

      {/* Botón publicar */}
      <Button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        type="button"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          "Publicar"
        )}
      </Button>
    </div>
  );
}
