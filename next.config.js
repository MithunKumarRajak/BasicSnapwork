/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.svg"],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  // Add redirects to ensure pages API routes forward to app API routes
  async redirects() {
    return [
      {
        source: "/api/jobs/:path*",
        destination: "/api/jobs/:path*",
        permanent: false,
      },
      {
        source: "/api/services/:path*",
        destination: "/api/services/:path*",
        permanent: false,
      },
      {
        source: "/api/users/:path*",
        destination: "/api/users/:path*",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
