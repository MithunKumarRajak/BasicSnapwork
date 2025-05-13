/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["placeholder.com"],
    unoptimized: true,
  },
  experimental: {
    // Disable static generation for now to avoid build errors
    // with MongoDB connection
    disableStaticGeneration: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
