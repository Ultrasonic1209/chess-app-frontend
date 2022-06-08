import React, { useState } from 'react';
//import ServiceWorkerWrapper from './serviceWorkerWrapper';

import Link from 'next/link'

import Container from 'react-bootstrap/Container';
import RbNavbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

// navbar done with snippets from react-bootstrap docs and https://stackoverflow.com/a/67732995/
 // footer from https://getbootstrap.com/docs/5.1/examples/footers/ - first example

export function Navbar() {
    
    const [navbarExpanded, setNavbarExpansion] = useState(false);
    return (
        <RbNavbar expanded={navbarExpanded} expand="sm" bg="dark" variant="dark" sticky="top">
            <Container className="rounded-3">
                <RbNavbar.Brand href="/">{ process.env.public_url }</RbNavbar.Brand>
                <RbNavbar.Toggle onClick={() => setNavbarExpansion(navbarExpanded ? false : "expanded")} aria-controls="responsive-navbar-nav" />
                <RbNavbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    <NavDropdown title="Play" id="play-nav-dropdown">
                        <NavDropdown.Item as={Link} href="/game/play" onClick={() => setNavbarExpansion(false)}>vs. online player</NavDropdown.Item>
                        <Link href="/game/play">
                            <NavDropdown.Item onClick={() => setNavbarExpansion(false)}>vs. local player</NavDropdown.Item>
                        </Link>
                        <Link href="/game/play">
                            <NavDropdown.Item onClick={() => setNavbarExpansion(false)}>vs. computer</NavDropdown.Item>
                        </Link>
                    </NavDropdown>
                    </Nav>
                    <Nav>
                        <NavDropdown title="Profile" id="profile-nav-dropdown" className="me-3">
                            <Link href="/profile/stats">
                                <NavDropdown.Item onClick={() => setNavbarExpansion(false)}>Stats</NavDropdown.Item>
                            </Link>
                            <Link href="/profile/preferences">
                                <NavDropdown.Item onClick={() => setNavbarExpansion(false)}>Preferences</NavDropdown.Item>
                            </Link>
                            <NavDropdown.Divider />
                            <Link href="/profile">
                                <NavDropdown.Item onClick={() => setNavbarExpansion(false)}><a>Account</a></NavDropdown.Item>
                            </Link>
                        </NavDropdown>
                        <RbNavbar.Text>
                            Signed in as: <Link href="/profile"><a onClick={() => setNavbarExpansion(false)}>Nobody</a></Link>
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
            Checkmate
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
