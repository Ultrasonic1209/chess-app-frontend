const withPWA = require('next-pwa')

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
    "headers": { // for vercel
        "Last-Modified": new Date().toUTCString()
    },
    env: {}
})