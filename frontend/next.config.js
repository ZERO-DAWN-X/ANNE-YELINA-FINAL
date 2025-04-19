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
    domains: ['localhost', 'anneyelina.duckdns.org'],
    unoptimized: true
  },
  output: 'export',
  trailingSlash: true,
  distDir: 'out'
}

module.exports = nextConfig