import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom";

import * as serviceWorkerRegistration from './serviceWorkerRegistration';

//import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap-dark.min.css';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

import './App.css';

// Internet Explorer 6-11 check
const isIE = /*@cc_on!@*/false || !!document.documentMode;

const theme = isIE ? "light": "dark"

export default function App() {

  const [isOnline, setOnline] = useState(navigator.onLine);

  function updateOnlineStatus(event) {
    setOnline(navigator.onLine);
  }

  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  const handleUpdate = () => {
    serviceWorkerRegistration.unregister();
    window.location.reload(true); // true is for full refresh, free from cache
  };
  
  // footer from https://getbootstrap.com/docs/5.1/examples/footers/ - first example

  return (
    <>
      <Navbar expand="sm" bg={theme} variant={theme} sticky="top">
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
                      <NavDropdown title="Profile" id="profile-nav-dropdown" className="mx-3">
                              <NavDropdown.Item as={Link} to="/profile/stats">Stats</NavDropdown.Item>
                              <NavDropdown.Item as={Link} to="/profile/preferences">Preferences</NavDropdown.Item>
                              <NavDropdown.Divider />
                              <NavDropdown.Item as={Link} to="#action/3.3">Account</NavDropdown.Item>
                      </NavDropdown>
                      <Navbar.Text>
                          Signed in as: <Link to="/">Nobody</Link>
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
          <p className="col-md-4 mb-0 text-muted">&copy; lol no</p>

          <p className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            Checkmate
          </p>

          <ul className="nav col-md-4 justify-content-end">
            <Button
              variant="outline-secondary"
              disabled={!isOnline}
              onClick={isOnline ? handleUpdate : null}  
            >
              {isOnline ? 'Update' : 'Offline'}
            </Button>
          </ul>
        </footer>
      </Container>

    </>
  );
}

serviceWorkerRegistration.register();