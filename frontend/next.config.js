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
  output: 'standalone',
  distDir: '.next',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://anneyelina.duckdns.org'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
      }
    ]
  }
}

module.exports = nextConfig