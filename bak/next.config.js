/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.arweave.net",
      },
    ],
    domains: [
      'lh3.googleusercontent.com',
      'raw.githubusercontent.com'
    ],
  },
}

module.exports = nextConfig
