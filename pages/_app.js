// pages/_app.js

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';

import '../components/App.css';

import { Navbar, Footer } from '../components/layout'
import { Container, SSRProvider } from 'react-bootstrap';

import SwWrapper from '../components/sw-wrapper';
import { useEffect } from 'react';

// https://stackoverflow.com/a/52695341
const isInStandaloneMode = () =>
      (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');

export default function Checkmate({ Component, pageProps }) {

  useEffect(() => {
    document.title = "TODO: FIX";

    if (!isInStandaloneMode()) {
      document.title += " | Checkmate";
    }
  })

  return (
    <>
        <Head>
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