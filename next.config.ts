import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['mongoose'],
  // Images: Allow external image domains if needed (e.g., S3/CloudFly)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.cloudfly.vn",
      },
    ],
  },
};

export default nextConfig;
