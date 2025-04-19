/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
    domains: ['anneyelina.duckdns.org', 'localhost'],
    unoptimized: true
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_UPLOAD_URL: 'http://anneyelina.duckdns.org/uploads'
  },
  // Add these to ensure proper asset handling
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  reactStrictMode: true,
}

module.exports = nextConfig