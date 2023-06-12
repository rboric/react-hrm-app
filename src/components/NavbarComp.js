import React, { useState } from "react";
import {
  Navbar,
  Nav,
  NavLink,
  Container,
  Alert,
  NavDropdown,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function NavbarComp() {
  const [error, setError] = useState("");
  const { currentUser, logout, admin } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="navbar-container">
      <Container>
        {error && <Alert variant="danger">{error}</Alert>}
        <Navbar.Brand href="#home">
          <img src={require("../assets/logo.png")} alt="LOGO" height="40px" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <NavLink className="disabled">
              Logged in as {currentUser.email}
            </NavLink>
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            {admin && (
              <NavDropdown title="Overview" id="nav-dropdown">
                <NavDropdown.Item as={Link} to="/salary">
                  Salary and payroll
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/worker-list">
                  Worker list
                </NavDropdown.Item>
              </NavDropdown>
            )}
            <Nav.Link as={Link} to="/archive">
              Archive
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
            <NavLink onClick={handleLogout}>Log Out</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
