const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

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

        plugins: [
            "postcss-flexbugs-fixes",
            [
                '@fullhuman/postcss-purgecss',
                {
                  content: [
                      './pages/**/*.{js,jsx,ts,tsx}',
                      './components/**/*.{js,jsx,ts,tsx}'
                  ],
                  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
                  safelist: ["html", "body"]
                }
            ]
        ],

        env: {}
    }

    if (phase === PHASE_DEVELOPMENT_SERVER) {
        nextConfig.env = {
            PUBLIC_URL: ""
        }
    } else {
        nextConfig.env = {
            PUBLIC_URL: "" // todo: sort this out somehow
        }
    }

    return nextConfig
  }
