import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ziron/ui"],
  images: {
    qualities: [25, 70, 80],
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
        protocol: "https",
      },
      {
        hostname: "zm-deals-local.s3.us-east-1.amazonaws.com",
        protocol: "https",
      },
      {
        hostname: "ziron-qr-local.s3.ap-south-1.amazonaws.com",
        protocol: "https",
      },
      {
        hostname: "ziron-qr-live.s3.ap-south-1.amazonaws.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
