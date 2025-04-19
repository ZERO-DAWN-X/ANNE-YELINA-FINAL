/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['jspdf', 'jspdf-autotable'],
  images: {
    domains: ['anneyelina.duckdns.org', 'localhost'],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
      'rrule': false,
    }
    return config
  },
  env: {
    NEXT_PUBLIC_UPLOAD_URL: 'http://anneyelina.duckdns.org/uploads',
    NEXT_PUBLIC_API_URL: 'http://anneyelina.duckdns.org'
  },
  trailingSlash: true,
  output: 'export',
  distDir: 'out'
}

module.exports = nextConfig