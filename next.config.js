const child_process = require('child_process')

const withPWA = require('next-pwa')

const ContentSecurityPolicy = `
`

const GIT_BRANCH = process.env.VERCEL_GIT_COMMIT_REF ||= child_process.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const GIT_COMMIT_SHA = process.env.VERCEL_GIT_COMMIT_SHA ||= child_process.execSync('git rev-parse HEAD').toString().trim() // https://stackoverflow.com/a/35778030

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
    },

    {
        key: 'Permissions-Policy', // https://www.permissionspolicy.com/
        value: 'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(), gamepad=(), speaker-selection=(), conversion-measurement=(), focus-without-user-activation=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), sync-script=(), trust-token-redemption=(), window-placement=(), vertical-scroll=()'
    },

    {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    },

    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },

    {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin'
    },

    {
        key: 'Content-Security-Policy',
        value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
    }

]

module.exports = withPWA({
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    swcMinify: true,
    experimental: {
        newNextLinkBehavior: true, /* this is not documented properly AT ALL. */
        optimizeCss: true
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