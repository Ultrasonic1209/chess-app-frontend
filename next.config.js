const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = async (phase, { defaultConfig }) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        reactStrictMode: true,
        experimental: {
            newNextLinkBehavior: true /* this is not documented AT ALL. */
        },
        env: {}
    }

    if (phase === PHASE_DEVELOPMENT_SERVER) {
        nextConfig.env = {
            PUBLIC_URL: "http://127.0.0.1:3000/"
        }
    } else {
        nextConfig.env = {
            PUBLIC_URL: process.env.CF_PAGES_URL
        }
    }

    return nextConfig
  }
