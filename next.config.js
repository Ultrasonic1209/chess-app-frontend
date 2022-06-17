const child_process = require('child_process')

const withPWA = require('next-pwa')

const GIT_BRANCH = process.env.VERCEL_GIT_COMMIT_REF |= child_process.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const GIT_COMMIT_SHA = process.env.VERCEL_GIT_COMMIT_SHA |= child_process.execSync('git rev-parse HEAD').toString().trim() // https://stackoverflow.com/a/35778030

var APP_NAME;

if (process.env.__VERCEL_DEV_RUNNING) {
    APP_NAME = "Checkmate Pre"
} else {
    switch (GIT_BRANCH) {
        case "master":
            APP_NAME = "Checkmate"
            break;
        case "staging":
            APP_NAME = "Checkmate Dev"
            break;
        default:
            APP_NAME = "Checkmate Pre"
    }
}

const date = new Date();

const globalHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
    },

    {
        key: 'last-modified',
        value: date.toUTCString(),
    },

    {
        key: 'x-git-commit-sha',
        value: GIT_COMMIT_SHA
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
    env: {
        appName: APP_NAME,
        lastModified: date.toLocaleString()
    }
})