/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para build estático (S3 + CloudFront)
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
