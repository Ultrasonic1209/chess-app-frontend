// pages/_app.js

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';
import '../components/App.css';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Toast from '../components/toast';

import { Container, SSRProvider } from 'react-bootstrap';

import SWWrapper from '../components/sw-wrapper';

import { ToastContainer } from 'react-bootstrap';

export default function Checkmate({ Component, pageProps }) {
  return (
    <>
        <Head>
          <title>{process.env.appName}</title>
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' />
        </Head>
        <SSRProvider>
            <SWWrapper/>
            <Navbar/>
            <Container id="mainContainer">
                <ToastContainer id="toastContainer" className="p-3" position='bottom-end'><Toast/></ToastContainer>
                <Component {...pageProps} />
            </Container>
            <Footer/>
        </SSRProvider>
    </>
  )
}