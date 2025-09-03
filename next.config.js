/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração de imagens
  images: {
    domains: [
      'takecerto-images-s3.s3.amazonaws.com',
      's3.amazonaws.com',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Otimizações experimentais (removendo optimizeCss que pode causar problemas com critters)
  experimental: {
    scrollRestoration: true,
  },

  // Configuração para evitar problemas com critters
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects se necessário
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig