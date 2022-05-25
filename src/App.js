import { Outlet, Link } from "react-router-dom";

//import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap-dark.min.css';
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
      <Container>
        <Outlet />
      </Container>
    </>
  );
}