import { type NextConfig } from "next";
import config from "@/config/default.json";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: config.blogBaseURL,
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
