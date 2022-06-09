// pages/_app.js

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';

import '../components/App.css';

import { Navbar, Footer } from '../components/layout'
import { Container, SSRProvider } from 'react-bootstrap';

import SWWrapper from '../components/sw-wrapper';

const IS_DEV = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

const APP_NAME = IS_DEV ? 'Checkmate Dev' : 'Checkmate';

export default function Checkmate({ Component, pageProps }) {
  return (
    <>
        <Head>
          <title>{APP_NAME}</title>
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' />
        </Head>
        <SSRProvider>
            <SWWrapper/>
            <Navbar/>
            <Container id="mainContainer">  
                <Component {...pageProps} />
            </Container>
            <Footer/>
        </SSRProvider>
    </>
  )
}