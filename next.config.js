/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  output: "export",
  assetPrefix: "./", // 👈 Add this line
};

module.exports = nextConfig;
