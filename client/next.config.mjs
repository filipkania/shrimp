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
};

export default nextConfig;
