// Página de configuración de entorno para Cloudinary (modo demo/informativo)
// Aquí se explica qué variables de entorno son necesarias y cómo configurar Cloudinary para subir medios

import { AppIcon } from "@/components/app-icon"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ExternalLink, Database, Shield } from "lucide-react"
import Link from "next/link"

export default function EnvSetupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Contenedor ampliado para mejor visualización */}
        <div className="w-full max-w-2xl space-y-8">
          {/* Logo y título */}
          <div className="flex flex-col items-center text-center">
            <AppIcon size={80} />
            <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Challz
            </h1>
            <p className="mt-2 text-zinc-400">Configuración de Cloudinary</p>
          </div>

          {/* Alerta modo demo */}
          <Alert className="bg-amber-900/20 border-amber-900 text-amber-300" role="alert">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>
              La aplicación está funcionando en modo demo. Para habilitar todas las funciones, configura Cloudinary.
            </AlertDescription>
          </Alert>

          {/* Variables de entorno requeridas para Cloudinary */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Database className="h-5 w-5 mr-2 text-purple-400" aria-hidden="true" />
              Variables de Entorno Requeridas
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              Para que la aplicación funcione correctamente con Cloudinary, necesitas configurar las siguientes variables de entorno:
            </p>

            {/* Listado dinámico para mejor mantenimiento */}
            <div className="space-y-4 mb-6">
              {[
                "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
                "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
                "NEXT_PUBLIC_API_BASE_URL", // Backend API url para manejar subida, si aplica
              ].map((variable) => (
                <div key={variable} className="bg-zinc-800 p-3 rounded-md">
                  <code className="text-xs text-purple-300">{variable}</code>
                </div>
              ))}
            </div>

            <p className="text-sm text-zinc-400 mb-4">
              Puedes obtener estas variables desde el panel de control de Cloudinary al crear un nuevo proyecto/servicio.
            </p>

            {/* Enlace oficial a Cloudinary */}
            <Link href="https://cloudinary.com/console" target="_blank" rel="noopener noreferrer" passHref>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mb-4" aria-label="Ir al panel de control de Cloudinary">
                <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                Ir al Panel de Cloudinary
              </Button>
            </Link>
          </div>

          {/* Configuración recomendada o notas para backend o frontend */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-400" aria-hidden="true" />
              Consideraciones y configuración
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              Asegúrate de que tu backend API acepte y gestione correctamente las solicitudes de subida a Cloudinary utilizando estas variables.  
              En el frontend, usa las variables públicas para configurar las URLs de subida y acceso a los recursos.
            </p>

            <h3 className="text-lg font-bold mb-3">Pasos recomendados:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
              <li>Crea una cuenta en Cloudinary y configura un proyecto.</li>
              <li>Configura un <code>upload preset</code> para la subida directa o proxy via backend.</li>
              <li>Agrega tus variables de entorno a `.env` con el prefijo <code>NEXT_PUBLIC_</code> para el frontend.</li>
              <li>Implementa la lógica en backend para validar y procesar las subidas.</li>
              <li>Adapta tus componentes frontend para usar la nueva arquitectura y endpoints.</li>
            </ol>
          </div>

          {/* Botón para regresar a la app */}
          <div className="text-center">
            <Link href="/">
              <Button variant="link" className="text-purple-400 hover:text-purple-300" aria-label="Volver a la aplicación">
                Volver a la Aplicación
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
