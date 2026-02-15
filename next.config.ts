import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Required for Docker; Vercel ignores this and uses its own build pipeline
  reactCompiler: true,
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
