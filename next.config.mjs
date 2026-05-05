/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removido output: "export" para permitir páginas dinâmicas
  // Usaremos modo standalone para deploy em container serverless
  output: "standalone",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
