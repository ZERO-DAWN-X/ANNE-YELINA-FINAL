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
    domains: ['anneyelina.duckdns.org', 'localhost'],
    unoptimized: true
  },
  output: 'export',
  distDir: 'out',
  env: {
    NEXT_PUBLIC_UPLOAD_URL: 'http://anneyelina.duckdns.org/uploads'
  }
}

module.exports = nextConfig