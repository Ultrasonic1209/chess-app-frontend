// pages/_app.js

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';
import '../components/App.css';

import Navbar from '../components/navbar';
import Footer from '../components/footer';

import { Container, SSRProvider } from 'react-bootstrap';

import SWWrapper from '../components/sw-wrapper';
import { StrictMode } from 'react';

export default function Checkmate({ Component, pageProps }) {
  return (
    <StrictMode>
        <Head>
          <title>{process.env.appName}</title>
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
    </StrictMode>
  )
}