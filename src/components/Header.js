import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="#">Kediri Technopark</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#top">Home</Nav.Link>
            <Nav.Link href="#services">Services</Nav.Link>
            <Nav.Link href="#produk">Product</Nav.Link>
            <Nav.Link href="#academy">Academy</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#knowledge">Knowledge</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;