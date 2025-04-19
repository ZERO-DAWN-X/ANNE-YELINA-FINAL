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
    domains: [
      'localhost',
      'anneyelina.duckdns.org'
    ],
    unoptimized: true
  },
  trailingSlash: true,
  output: 'export',
  distDir: 'out',
  async redirects() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_UPLOADS_URL}/:path*`,
        permanent: true,
      },
    ];
  }
}

module.exports = nextConfig