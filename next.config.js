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
            PUBLIC_URL: "/"
        }
    } else {
        nextConfig.env = {
            PUBLIC_URL: "/" // todo: sort this out somehow
        }
    }

    return nextConfig
  }
