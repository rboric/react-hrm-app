import React, { useState } from "react";
import { Navbar, Nav, NavLink, Container, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function NavbarComp() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/login-admin");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-main-light-t">
      <Container>
        {error && <Alert variant="danger">{error}</Alert>}
        <Navbar.Brand href="#home">
          <img src={require("../assets/logo.png")} alt="LOGO" height="40px" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link className="disabled">
              Logged in as {currentUser.email}
            </Nav.Link>
            {/* <NavLink>
              <Link to="/dashboard">Dashboard</Link>
            </NavLink>
            <NavLink>
              <Link to="/overview" state={"123123"}>
                Overview
              </Link>
            </NavLink> */}
            <NavLink onClick={handleLogout}>Log Out</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
