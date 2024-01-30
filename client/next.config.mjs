/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

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
