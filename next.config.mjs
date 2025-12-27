/** @type {import('next').NextConfig} */
const nextConfig = {
  // Đảm bảo không có dòng assetPrefix nào lạ
  images: {
    unoptimized: true,
  },
  // Nếu bạn đang dùng App Router
  experimental: {
    runtime: 'edge',
  },
};

export default nextConfig;