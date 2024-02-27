import { API_URL } from "./lib/api.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  output: "export",
  trailingSlash: true,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/inbox",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];

    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      }
    ]
  }
};

export default nextConfig;
