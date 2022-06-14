import React, { useState } from 'react';
//import ServiceWorkerWrapper from './serviceWorkerWrapper';

import Link from 'next/link'

import Container from 'react-bootstrap/Container';
import RbNavbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

// navbar done with snippets from react-bootstrap docs and https://stackoverflow.com/a/67732995/
 // footer from https://getbootstrap.com/docs/5.1/examples/footers/ - first example


const IS_DEV = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

const APP_NAME = IS_DEV ? 'Checkmate Dev' : 'Checkmate';

export function Navbar() {
    
    const [navbarExpanded, setNavbarExpansion] = useState(false);
    return (
        <RbNavbar expanded={navbarExpanded} expand="sm" bg="dark" variant="dark" sticky="top">
            <Container className="rounded-3">
                <RbNavbar.Brand as={Link} href="/">{APP_NAME}</RbNavbar.Brand>
                <RbNavbar.Toggle onClick={() => setNavbarExpansion(navbarExpanded ? false : "expanded")} aria-controls="responsive-navbar-nav" />
                <RbNavbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    <NavDropdown title="Play" id="play-nav-dropdown">
                        <NavDropdown.Item as={Link} href="/game/new" onClick={() => setNavbarExpansion(false)}>New game</NavDropdown.Item>
                        <NavDropdown.Item as={Link} href="/game/load" onClick={() => setNavbarExpansion(false)}>Load game</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown title="Profile" id="profile-nav-dropdown" className="me-3">
                            <NavDropdown.Item as={Link} href="/profile/stats" onClick={() => setNavbarExpansion(false)}>Stats</NavDropdown.Item>
                            <NavDropdown.Item as={Link} href="/profile/preferences" onClick={() => setNavbarExpansion(false)}>Preferences</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} href="/profile" onClick={() => setNavbarExpansion(false)}>Account</NavDropdown.Item>
                        </NavDropdown>
                        <RbNavbar.Text>
                            Signed in as: <Link href="/profile" onClick={() => setNavbarExpansion(false)}>Nobody</Link>
                        </RbNavbar.Text>
                    </Nav>
                </RbNavbar.Collapse>
            </Container>
        </RbNavbar>
    )
}

export function Footer() {
    return (
        <Container>
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-1S border-top">
          <p className="col-md-4 d-flex align-items-center mb-3 mb-md-0 me-md-auto text-muted">&copy; lol no</p>

          <p className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto text-muted text-decoration-none">
            {APP_NAME}
          </p>

          <p className="col-md-4 d-flex mb-0 align-items-center justify-content-end text-muted">
            
          </p>
        </footer>
      </Container>
    )
}

/*export default function App() {

  return (
    <>
      <ServiceWorkerWrapper/>
      
      <Container id="mainContainer">
        <Outlet />
      </Container>
      
    </>
  );
}*/
