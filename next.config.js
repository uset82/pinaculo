/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  eslint: {
    // Permit build on Netlify even if there are lint errors; CI lint runs separately
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  webpack: (config, { isServer }) => {
    // Optimize client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
