/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  output: "export",             
  assetPrefix: "./portfolio-website/",
  basePath: "/portfolio-website",          
  trailingSlash: true          
};

module.exports = nextConfig;
