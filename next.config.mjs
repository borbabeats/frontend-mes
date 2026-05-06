/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para build estático (S3 + CloudFront)
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Configurar base path para assets funcionarem no S3
  basePath: '',
  assetPrefix: '',
};

export default nextConfig;
