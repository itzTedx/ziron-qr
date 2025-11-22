import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ziron/ui", "@ziron/auth", "@ziron/utils", "@ziron/validators", "@ziron/db", "@ziron/api"],

  images: {
    qualities: [25, 80],
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
        protocol: "https",
      },
    ],
  },
  typedRoutes: true,
  reactCompiler: true,

  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
