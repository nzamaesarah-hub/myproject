import type { NextConfig } from "next";

const apiServer = process.env.EXPRESS_API_URL || "http://127.0.0.1:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${apiServer}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
