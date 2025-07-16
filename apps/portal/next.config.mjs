/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@ziron/ui",
    "@ziron/auth",
    "@ziron/utils",
    "@ziron/validators",
  ],

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
