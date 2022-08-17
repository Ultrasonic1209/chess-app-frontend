// pages/_app.js
import React from 'react';

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';
import '../components/App.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContextProvider } from '../contexts/ToastContext';
import { OnlineStatusProvider } from '../contexts/OnlineStatus';

import { Container, SSRProvider } from 'react-bootstrap';

export default function Checkmate({ Component, pageProps }) {
  return (
    <>
        <Head>
          <title>{process.env.appName}</title>
          <meta name='viewport' content='initial-scale=1.0, maximum-scale=1.0, width=device-width, shrink-to-fit=no, user-scalable=no' />
        </Head>
        <SSRProvider>
          <OnlineStatusProvider>
            <ToastContextProvider>
              <Navbar/>
              <Container id="mainContainer">
                  <Component {...pageProps} />
              </Container>
              <Footer/>
            </ToastContextProvider>
          </OnlineStatusProvider>
        </SSRProvider>
    </>
  )
}