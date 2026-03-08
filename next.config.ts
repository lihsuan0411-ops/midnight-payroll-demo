/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 讓 Vercel 在部署時忽略 ESLint 錯誤
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 讓 Vercel 在部署時忽略 TypeScript 錯誤
    ignoreBuildErrors: true,
  },
};

export default nextConfig;