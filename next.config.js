/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['visa-webapp.transytrong20.workers.dev', 'pub-d007d74036654473a8d7d9d0a663708b.r2.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'visa-webapp.transytrong20.workers.dev',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-d007d74036654473a8d7d9d0a663708b.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
