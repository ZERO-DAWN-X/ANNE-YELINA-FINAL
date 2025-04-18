module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://anneyelina.netlify.app',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://anneyelina.netlify.app/server-sitemap.xml',
    ],
  },
} 