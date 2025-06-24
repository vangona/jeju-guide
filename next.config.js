/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  typescript: {
    // 마이그레이션 중 타입 에러 무시
    ignoreBuildErrors: true,
  },
  eslint: {
    // 마이그레이션 중 ESLint 에러 무시
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig;