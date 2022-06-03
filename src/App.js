import React from 'react';
import { Outlet, Link } from "react-router-dom";

import ServiceWorkerWrapper from './serviceWorkerWrapper';

//import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap-dark.min.css';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import './App.css';

export default function App() {
  // footer from https://getbootstrap.com/docs/5.1/examples/footers/ - first example

  return (
    <>
      <ServiceWorkerWrapper/>
      <Navbar expand="sm" bg="dark" variant="dark" sticky="top">
          <Container className="rounded-3">
              <Navbar.Brand as={Link} to="/">Checkmate</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto">
                  <NavDropdown title="Play" id="play-nav-dropdown">
                      <NavDropdown.Item as={Link} to="/game/play">vs. online player</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/game/play">vs. local player</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/game/play">vs. computer</NavDropdown.Item>
                  </NavDropdown>
                  </Nav>
                  <Nav>
                      <NavDropdown title="Profile" id="profile-nav-dropdown" className="me-3">
                              <NavDropdown.Item as={Link} to="/profile/stats">Stats</NavDropdown.Item>
                              <NavDropdown.Item as={Link} to="/profile/preferences">Preferences</NavDropdown.Item>
                              <NavDropdown.Divider />
                              <NavDropdown.Item as={Link} to="#action/3.3">Account</NavDropdown.Item>
                      </NavDropdown>
                      <Navbar.Text>
                          Signed in as: <Link to="/profile">Nobody</Link>
                      </Navbar.Text>
                  </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>
      <Container id="mainContainer">
        <Outlet />
      </Container>
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
    </>
  );
}
