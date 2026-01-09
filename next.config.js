/** @type {import('next').NextConfig} */
const nextConfig = {
  // Multi-Zone Configuration: Rewrite requests to the remote app
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite /remote and /remote/* to the remote app
        {
          source: "/remote",
          destination: "http://localhost:3001/remote",
        },
        {
          source: "/remote/:path*",
          destination: "http://localhost:3001/remote/:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;
