/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",  // generates /out folder
  images: {
    unoptimized: true, // make <Image /> work without optimization server
  },
  assetPrefix: "./", // ✅ ensures images/static load from relative path
};

export default nextConfig;