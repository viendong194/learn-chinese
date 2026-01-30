/** @type {import('next').NextConfig} */
const nextConfig = {
  // Đảm bảo không có dòng assetPrefix nào lạ
  images: {
    unoptimized: true,
  }
};

export default nextConfig;