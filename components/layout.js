import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContextProvider } from '../contexts/ToastContext';
import { OnlineStatusProvider } from '../contexts/OnlineStatus';

import { Container, SSRProvider, Modal } from 'react-bootstrap';

import Link from 'next/link';

export default function Layout({ children }) {
    return (
        <SSRProvider>
          <OnlineStatusProvider>
            <ToastContextProvider>
              <Navbar/>
              <Container id="mainContainer">
                <noscript>
                    <Modal
                        show={true}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header>
                        <Modal.Title>Javascript is disabled</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        Your browser is not able to run Javascript on this website.
                        To use Checkmate, please <Link href={"https://www.enable-javascript.com/"}>enable javascript.</Link>
                        </Modal.Body>
                    </Modal>
                </noscript>
                {children}
              </Container>
              <Footer/>
            </ToastContextProvider>
          </OnlineStatusProvider>
        </SSRProvider>
    )
  }