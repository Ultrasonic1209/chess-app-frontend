// pages/_app.js
import React from 'react';

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';
import '../components/App.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContextProvider } from '../contexts/ToastContext';

import { Container, SSRProvider } from 'react-bootstrap';

export default function Checkmate({ Component, pageProps }) {
  return (
    <>
        <Head>
          <title>{process.env.appName}</title>
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' />
        </Head>
        <SSRProvider>
            <ToastContextProvider>
              <Navbar/>
              <Container id="mainContainer">
                  <Component {...pageProps} />
              </Container>
              <Footer/>
            </ToastContextProvider>
        </SSRProvider>
    </>
  )
}