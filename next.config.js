/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    domains: ['visa-webapp.milenafonseca998.workers.dev', 'pub-9482cacc79b74257911fbde91923bc6a.r2.dev'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'visa-webapp.milenafonseca998.workers.dev',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-9482cacc79b74257911fbde91923bc6a.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
