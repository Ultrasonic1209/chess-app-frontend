// pages/_app.js

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';

import '../components/App.css';

import { Navbar, Footer } from '../components/layout'
import { Container, SSRProvider } from 'react-bootstrap';

import SwWrapper from '../components/sw-wrapper';

const IS_DEV = process.env.IS_VERCEL;

const APP_NAME = IS_DEV ? 'Checkmate Dev' : 'Checkmate';

export default function Checkmate({ Component, pageProps }) {
  return (
    <>
        <Head>
          <title>{APP_NAME}</title>
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' />
        </Head>
        <SSRProvider>
            <SwWrapper/>
            <Navbar/>
            <Container id="mainContainer">  
                <Component {...pageProps} />
            </Container>
            <Footer/>
        </SSRProvider>
    </>
  )
}