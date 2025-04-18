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
    domains: ['localhost', 'api.anneyelina.com'],
    unoptimized: true
  },
  trailingSlash: true,
  output: 'export',
  distDir: 'out'
}

module.exports = nextConfig