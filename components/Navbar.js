import React, { useState } from 'react';

import Link from 'next/link'

import Container from 'react-bootstrap/Container';
import RbNavbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import ProfileIndicator from './ProfileIndicator';

// navbar done with snippets from react-bootstrap docs
export default function Navbar() {
    
    const [navbarExpanded, setNavbarExpansion] = useState(false);
    return (
        <RbNavbar expanded={navbarExpanded} expand="sm" bg="dark" variant="dark" sticky="top">
            <Container className="rounded-3">
                <RbNavbar.Brand as={Link} href="/">{process.env.appName}</RbNavbar.Brand>
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
                            <ProfileIndicator onClick={() => setNavbarExpansion(false)}/>
                        </RbNavbar.Text>
                    </Nav>
                </RbNavbar.Collapse>
            </Container>
        </RbNavbar>
    )
}