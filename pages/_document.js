import { Html, Head, Main, NextScript } from 'next/document'

const APP_NAME = 'Checkmate'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="A webapp where you can play chess."
        />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name="color-scheme" content="light dark" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="application-name" content={APP_NAME} />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#3b3b3b" media="(prefers-color-scheme: dark)" />
        <link rel="manifest" href={process.env.IS_VERCEL ? "/site-dev.webmanifest" : "/site.webmanifest"} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}