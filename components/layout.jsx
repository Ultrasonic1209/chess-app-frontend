import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContextProvider } from '../contexts/ToastContext';
import { OnlineStatusProvider } from '../contexts/OnlineStatus';

import { Container, SSRProvider } from 'react-bootstrap';

import Link from 'next/link';

export default function Layout({ children }) {
    return (
        <SSRProvider>
          <OnlineStatusProvider>
            <ToastContextProvider>
              <Navbar/>
              <Container id="mainContainer">
                <noscript>
                    <p>
                        Your browser is not able to run Javascript on this website.
                        To use Checkmate, please <Link href={"https://www.enable-javascript.com/"}>enable javascript.</Link>
                    </p>
                </noscript>
                {children}
              </Container>
              <Footer/>
            </ToastContextProvider>
          </OnlineStatusProvider>
        </SSRProvider>
    )
  }