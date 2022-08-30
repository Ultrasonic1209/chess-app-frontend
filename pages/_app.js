import "preact/debug";
import React from 'react';

import Head from 'next/head';

import '../components/bootstrap-dark.min.css';
import '../components/App.css';

import Layout from '../components/layout'

export default function Checkmate({ Component, pageProps }) {
  return (
    <>
        <Head>
          <title>{process.env.appName}</title>
          <meta name='viewport' content='initial-scale=1.0, maximum-scale=5.0, width=device-width, shrink-to-fit=no' />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </>
  )
}