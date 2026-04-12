import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: '/grades',
  // Required for static export with images
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: "export",
//   distDir: "out",
//   images: {
//     unoptimized: true,
//   },
// };

// export default nextConfig;