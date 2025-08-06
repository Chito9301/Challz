"use client"

import React from "react"
import { ArrowLeft, Heart, Share2, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

/**
 * Página de detalle de reto.
 * 
 * Nota importante para Next.js 15:
 * El componente se exporta como async y recibe params como Promise,
 * por eso se hace await para obtener el id parámetro.
 */
export default async function RetoPage({ params }: { params: Promise<{ id: string }> }) {
  // Desestructuramos 'id' tras resolver la promesa params
  const { id } = await params

  // Aquí podrías agregar lógica para traer datos reales del reto por ID futuramente, llamando API o base de datos.

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header fijo con botón para volver y botón de compartir */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/80 backdrop-blur-md border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-zinc-400" aria-label="Volver al inicio">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Detalles del Reto</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-zinc-400" aria-label="Compartir">
          <Share2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Contenido principal con padding para evitar el header fijo */}
      <main className="flex-1 pt-16 pb-20">
        {/* Banner con imagen de fondo y info */}
        <div className="relative h-64 bg-gradient-to-b from-purple-900/20 to-black">
          <Image
            src="/placeholder.svg?height=400&width=800"
            alt="Reto banner"
            fill
            className="object-cover opacity-50"
            priority // para carga prioritaria del banner
          />
          {/* Overlay de gradiente para suavizar texto sobre imagen */}
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          {/* Información textual del reto */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Badge className="mb-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">RETO DESTACADO</Badge>
            <h2 className="text-2xl font-bold mb-1">
              Crea un video bailando con tu canción favorita de los 90s
            </h2>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Users className="h-4 w-4" />
              <span>238 participantes</span>
            </div>
          </div>
        </div>

        {/* Sección de contenido debajo del banner */}
        <div className="p-4">
          {/* Progreso y tiempo restante */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-zinc-400">Tiempo restante</p>
              <p className="font-medium">14 horas</p>
            </div>
            {/* Corrección: Elimina 'indicatorClassName' que no existe */}
            <Progress
              value={30}
              className="w-1/2 h-2 bg-zinc-700 [&_[role=progressbar]]:bg-purple-500"
              aria-label="Progress del reto"
            />
          </div>

          {/* Descripción del reto */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Descripción</h3>
            <p className="text-sm text-zinc-400">
              Muestra tus mejores pasos de baile con una canción nostálgica de los años 90. ¡Sorprende a todos con tu
              creatividad y estilo! Puedes elegir cualquier canción de esa década que te traiga buenos recuerdos o que
              simplemente te encante.
            </p>
          </div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-zinc-800 hover:bg-zinc-700 text-white border-none">#challz</Badge>
            <Badge className="bg-zinc-800 hover:bg-zinc-700 text-white border-none">#baile90s</Badge>
            <Badge className="bg-zinc-800 hover:bg-zinc-700 text-white border-none">#musica</Badge>
            <Badge className="bg-zinc-800 hover:bg-zinc-700 text-white border-none">#nostalgia</Badge>
          </div>

          {/* Botones para aceptar o guardar reto */}
          <div className="flex gap-4 mb-8">
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Aceptar Reto
            </Button>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Guardar
            </Button>
          </div>

          {/* Información del creador */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Creado por</h3>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-purple-500">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@challz" />
                  <AvatarFallback>CH</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Challz Oficial</p>
                  <p className="text-xs text-zinc-400">@challz</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Seguir
              </Button>
            </div>
          </div>

          {/* Pestañas para respuestas y populares */}
          <Tabs defaultValue="responses" className="w-full">
            <TabsList className="w-full bg-zinc-900 border-b border-zinc-800 rounded-none h-12">
              <TabsTrigger
                value="responses"
                className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Respuestas
              </TabsTrigger>
              <TabsTrigger
                value="popular"
                className="flex-1 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Populares
              </TabsTrigger>
            </TabsList>

            {/* Contenido pestaña "Respuestas" */}
            <TabsContent value="responses" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Link href={`/respuesta/${item}`} key={item} className="block">
                    <div className="rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                      <div className="aspect-square relative">
                        <Image
                          src={`/placeholder.svg?height=200&width=200`}
                          alt={`Response ${item}`}
                          fill
                          className="object-cover"
                          priority={item === 1} // para la primera imagen cargar antes
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
                          <Heart className="h-3 w-3 text-red-400" />
                          <span className="text-xs">{Math.floor(Math.random() * 1000)}</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src="/placeholder.svg?height=20&width=20" alt="@user" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <p className="text-xs truncate">@usuario{item}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* Contenido pestaña "Populares" */}
            <TabsContent value="popular" className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {[6, 5, 4, 3, 2, 1].map((item) => (
                  <Link href={`/respuesta/${item}`} key={item} className="block">
                    <div className="rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800">
                      <div className="aspect-square relative">
                        <Image
                          src={`/placeholder.svg?height=200&width=200`}
                          alt={`Popular response ${item}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
                          <Heart className="h-3 w-3 text-red-400" />
                          <span className="text-xs">{Math.floor(Math.random() * 1000) + 500}</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src="/placeholder.svg?height=20&width=20" alt="@user" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <p className="text-xs truncate">@popular{item}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
