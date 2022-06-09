
module.exports = async (phase, { defaultConfig }) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        ...defaultConfig,

        reactStrictMode: true,
        experimental: {
            newNextLinkBehavior: true /* this is not documented AT ALL. */
        },
        env: {}
    }

    return nextConfig
  }
