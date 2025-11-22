import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ziron/ui", "@ziron/auth", "@ziron/utils", "@ziron/validators", "@ziron/db"],

  typedRoutes: true,
  reactCompiler: true,

  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
