// https://purgecss.com/guides/next.html
module.exports = {
    "plugins": [
      [
        '@fullhuman/postcss-purgecss',
        {
            content: [
                './pages/**/*.{js,jsx,ts,tsx}',
                './components/**/*.{js,jsx,ts,tsx}'
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
            safelist: ["html", "body"],
            rejected: true
        }
      ],
      "postcss-flexbugs-fixes",
      [
        "postcss-preset-env",
        {
          "autoprefixer": {
            "flexbox": "no-2009"
          },
          "stage": 3,
          "features": {
            "custom-properties": false
          }
        }
      ]
    ]
  }
