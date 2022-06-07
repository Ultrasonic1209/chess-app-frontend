// pages/_app.js

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';

import '../components/App.css';

import { Navbar, Footer } from '../components/layout'
import { Container, SSRProvider } from 'react-bootstrap';

export default function Checkmate({ Component, pageProps }) {
  return (
    <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
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