const path = require('path');

const nextConfig = {
  images: {
    unoptimized: true
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'frontend'),
    };
    return config;
  }
};

module.exports = nextConfig;
