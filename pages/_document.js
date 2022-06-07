import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="A webapp where you can play chess."
        />
        <meta name="color-scheme" content="light dark" />
        <link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png" />
        <link rel="mask-icon" href="%PUBLIC_URL%/safari-pinned-tab.svg" color="#000000" />
        <meta name="apple-mobile-web-app-title" content="Checkmate" />
        <meta name="application-name" content="Checkmate" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#3b3b3b" media="(prefers-color-scheme: dark)" />
        <link rel="manifest" href="%PUBLIC_URL%/site.webmanifest" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}