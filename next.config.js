/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  output: "export",             
  assetPrefix: "./out/",           
  trailingSlash: true          
};

module.exports = nextConfig;
