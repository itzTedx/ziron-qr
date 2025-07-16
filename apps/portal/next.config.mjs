/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@ziron/ui",
    "@ziron/auth",
    "@ziron/utils",
    "@ziron/validators",
    "@ziron/db",
  ],

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
