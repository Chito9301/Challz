const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true // No optimiza imágenes, útil si usas CDN
  },
  // Evita el warning de Cross Origin en dev
  allowedDevOrigins: [
    'http://10.127.84.98', // Tu IP local
    'http://localhost:3000' // También localhost
  ],
  // Configuración de TypeScript: fallar el build si hay errores
  typescript: {
    ignoreBuildErrors: false // Si hay errores TS, detiene el build
  },
  // Configuración de ESLint: fallar si hay errores
  eslint: {
    dirs: ['pages', 'components', 'lib', 'hooks'], // Carpetas donde correr ESLint
    ignoreDuringBuilds: false // Detiene el build si hay errores ESLint
  },
  webpack(config) {
    // Alias para importaciones absolutas con '@'
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'frontend')
    };
    return config;
  }
};

module.exports = nextConfig;
