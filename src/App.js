import { Outlet } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

const darkMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)

const theme = darkMode ? "dark": "light"

export default function App() {
  return (
    <>
      <Navbar expand="sm" bg={theme} variant={theme} sticky="top">
          <Container className="rounded-3">
              <Navbar.Brand href="/">Chess App</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto">
                  <NavDropdown title="Play" id="collasible-nav-dropdown">
                      <NavDropdown.Item href="#action/3.1">vs. online player</NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.2">vs. local player</NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.3">vs. computer</NavDropdown.Item>
                  </NavDropdown>
                  </Nav>
                  <Nav>
                      <NavDropdown title="Profile" id="collasible-nav-dropdown" className="mx-3">
                          <NavDropdown.Item href="/profile/stats">Stats</NavDropdown.Item>
                          <NavDropdown.Item href="/profile/preferences">Preferences</NavDropdown.Item>
                          <NavDropdown.Divider />
                          <NavDropdown.Item href="#action/3.3">Account</NavDropdown.Item>
                      </NavDropdown>
                      <Navbar.Text>
                          Signed in as: <a href="#login">Nobody</a>
                      </Navbar.Text>
                  </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}