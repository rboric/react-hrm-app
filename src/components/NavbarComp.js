import React, {useState }from 'react'
import { Navbar, Nav, Container, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'


export default function NavbarComp() {
  const [error, setError] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
        setError("")

        try {
            await logout()
            navigate("/login")
        } catch {
            setError("Failed to log out")
        }
    }

  return (
    <Navbar collapseOnSelect expand="lg" bg="info">
      <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <Navbar.Brand href="#home"><img src={require("../assets/logo.png")} alt="LOGO" height="40px" /></Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
        </Nav>
        <Nav>
          <Nav.Link className="disabled">Logged in as {currentUser.email}</Nav.Link>
          <Link to="/">Dashboard </Link>
          <Link to="/overview">Overview</Link>
          <Nav.Link onClick={handleLogout}>
          Log Out
          </Nav.Link> 
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
