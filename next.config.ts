import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 忽略 TypeScript 檢查
  },
};

export default nextConfig;