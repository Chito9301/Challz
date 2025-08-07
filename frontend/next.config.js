const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@radix-ui/react-context-menu": path.resolve(
        __dirname,
        "src/components/ui/wrappers/context-menu.tsx"
      ),
      // Agrega más alias de wrappers si los tienes, por ejemplo:
      // "@radix-ui/react-accordion": path.resolve(__dirname, "src/components/ui/wrappers/accordion.tsx"),
    };
    return config;
  },
};

module.exports = nextConfig;
