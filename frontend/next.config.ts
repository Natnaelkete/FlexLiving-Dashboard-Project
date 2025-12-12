import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Silence Turbopack error by providing an empty config
  // The webpack config below is only for dev mode (Docker polling)
  turbopack: {},
  webpack: (config, context) => {
    if (context.dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
