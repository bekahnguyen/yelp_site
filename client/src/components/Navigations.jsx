import { useState } from "react";
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

//show edit or delete button on regular customer page, conditionally render if "is admin?"
//or
//could build whole new page. CMS. dont worry about style

export default function Navigations({ somm, setSomm }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("logging youout");
    window.localStorage.removeItem("token");
    setSomm({});
    alert("Logged out!");
  };

  const handleSubmit = (event) => {
    navigate(event);
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Paso</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/Account">Account</Nav.Link>
              {!somm ? (
                <NavDropdown title="ADMIN" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/AllUsers">Somms</NavDropdown.Item>
                  <NavDropdown.Item href="/AdminWineries">
                    Wineries
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/AdminReviews">
                    Reviews
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
