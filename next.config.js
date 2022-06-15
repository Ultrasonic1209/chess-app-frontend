const withPWA = require('next-pwa')

const globalHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
    },

    {
        key: 'last-modified',
        value: new Date().toUTCString(),
    }
]

module.exports = withPWA({
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    experimental: {
        newNextLinkBehavior: true /* this is not documented AT ALL. */
    },
    pwa: {
        dest: 'public',
        sw: 'service-worker.js',
        dynamicStartUrl: true,
        //cacheOnFrontEndNav: true,
        reloadOnOnline: false,
        register: false,
        skipWaiting: false,
        publicExcludes: [
            '!_headers'
        ]
    },
    async headers() { // for vercel
        return [
          {
            source: '/:path*',
            headers: globalHeaders
          }
        ]
    },
    env: {}
})