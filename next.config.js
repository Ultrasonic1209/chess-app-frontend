module.exports = async (phase, { defaultConfig }) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        legacyBehavior: false
        distDir: 'build',
    }
    return nextConfig
  }
