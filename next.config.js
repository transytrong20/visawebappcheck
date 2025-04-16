/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['visa-webapp.transytrong20.workers.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'visa-webapp.transytrong20.workers.dev',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
