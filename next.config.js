/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "beige-fit-hedgehog-619.mypinata.cloud",
        port: "",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "static1.srcdn.com",
        port: "",
        pathname: "/wordpress/wp-content/**",
      },
    ],
  },
};

module.exports = nextConfig;
