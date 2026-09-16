import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "carapi.teensclub.mn",
      },
      {
        protocol: "https",
        hostname: "*.teensclub.mn",
      },
    ],
  },
};

export default nextConfig;
