import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow streaming responses from API routes
  experimental: {},
  // Suppress warnings from three.js / R3F
  webpack: (config) => {
    config.externals = config.externals || [];
    return config;
  },
};

export default nextConfig;
