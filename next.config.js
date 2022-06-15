const withPWA = require('next-pwa')

console.log(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA)

const globalHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
    },

    {
        key: 'last-modified',
        value: new Date().toUTCString(),
    },

    {
        key: 'x-git-commit-sha',
        value: require('child_process').execSync('git rev-parse HEAD').toString().trim() // https://stackoverflow.com/a/35778030
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