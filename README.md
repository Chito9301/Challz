<p align="center">
  <img src="./favicon.ico.jpg" alt="Challz Logo" width="200"/>
</p>

# Challz

Challz es una plataforma moderna de retos sociales tipo TikTok, construida con Next.js y un backend personalizado, desplegada fácilmente en Vercel.

---

## 🚀 Características principales

- Autenticación y registro seguros con backend propio
- Feed dinámico de videos y retos
- Subida y gestión de contenido multimedia
- Interfaz moderna y adaptable a dispositivos móviles

---

## 🛠 Instalación y configuración

### 1. Clona el repositorio

git clone https://github.com/tuusuario/challz.git  
cd challz

### 2. Instala las dependencias

npm install

### 3. Crea tu archivo de variables de entorno

cp .env.example .env.local

Rellena los valores reales en `.env.local` según la configuración de tu backend y frontend.

Ejemplo de variables importantes:

NEXT_PUBLIC_API_URL=http://localhost:4000 # URL del backend en desarrollo

### 4. Inicia el entorno de desarrollo

npm run dev

Abre `http://localhost:3000` en tu navegador para ver la app funcionando.

---

## 🔑 Variables de entorno

Tu archivo `.env.local` debe contener las variables necesarias para la conexión entre frontend y backend. No subas este archivo al repositorio.

Ejemplo para desarrollo:

NEXT_PUBLIC_API_URL=http://localhost:4000

**Importante:** Mantén tu información sensible fuera del repositorio en este archivo local.

---

## 🌐 Despliegue en producción

Este proyecto está preparado para desplegarse en Vercel:

1. Sube tu repositorio a GitHub.  
2. Importa el proyecto en Vercel.  
3. Configura en el panel de Vercel las mismas variables de entorno que usas en `.env.local`.  
4. ¡Listo! La app estará disponible en la URL que te proporcione Vercel.

---

## 📂 Estructura básica del proyecto

- `/frontend` — Aplicación Next.js (frontend)  
- `/backend` — Código y API del servidor backend personalizado  
- `/components` — Componentes reutilizables de UI  
- `/public` — Archivos estáticos, imágenes y logo  

---

## 👥 Créditos y agradecimientos

Desarrollado por **Ivan R. Betancourt**  
Correo: ivanrba0193@gmail.com

Tecnologías usadas:  
- Next.js  
- Backend personalizado con API REST  
- Vercel

---

## 📝 Contribuciones

¿Quieres colaborar o proponer mejoras?  
- Haz un fork del repositorio  
- Crea una rama nueva (`git checkout -b feature/nueva-funcionalidad`)  
- Realiza tus cambios y envía tu Pull Request

---

## 📢 Contacto

Para dudas, reportes de bugs o sugerencias, escribe a ivanrba0193@gmail.com.

---

<div align="center">
  <strong>¡Gracias por usar Challz!</strong>
</div>
