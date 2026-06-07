/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // output: export apenas no build de produção (S3 + CloudFront)
  ...(isProd && { output: "export" }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;
