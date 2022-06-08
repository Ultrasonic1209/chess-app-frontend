module.exports = async (phase, { defaultConfig }) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        experimental: {
            newNextLinkBehavior: true /* this is not documented AT ALL. */
        }
    }
    return nextConfig
  }
