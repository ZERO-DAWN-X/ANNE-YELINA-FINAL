/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['jspdf', 'jspdf-autotable'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
      'rrule': false,
    }
    return config
  },
  images: {
    domains: ['localhost', 'api.anneyelina.com', 'anneyelina.duckdns.org'],
    unoptimized: true
  },
  trailingSlash: true,
  output: 'standalone',
  distDir: 'out'
}

module.exports = nextConfig