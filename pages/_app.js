// pages/_app.js

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';

import '../components/App.css';

import { Navbar, Footer } from '../components/layout'
import { Container, SSRProvider } from 'react-bootstrap';


// todo: https://github.com/shadowwalker/next-pwa/blob/master/examples/lifecycle/pages/index.js
export default function Checkmate({ Component, pageProps }) {
  return (
    <>
        <Head>
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' />
        </Head>
        <SSRProvider>
            <Navbar/>
            <Container id="mainContainer">  
                <Component {...pageProps} />
            </Container>
            <Footer/>
        </SSRProvider>
    </>
  )
}