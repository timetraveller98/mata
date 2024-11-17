"use client";
import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import { Container } from "react-bootstrap";
import { useState } from "react";
import { Button } from "@mui/material";
const NavbarData = () => {
  const [expanded, setExpanded] = useState(false);
  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar
      expand="lg"
      className="sticky-top bg-light"
      expanded={expanded}
      id="navbar"
    >
      <Container fluid>
        <Link href="/" onClick={closeNavbar}>
          <Image
            src="/logo.png"
            className="m-0 p-2 responsive-logo"
            width={70}
            height={130}
            alt="logo"
          />
        </Link>
        <Navbar.Toggle
          className="me-3 text-light"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="text-dark fw-semibold d-flex align-items-center">
            <Link href="/upload" passHref legacyBehavior>
              <Nav.Link
                style={{ textDecoration: "none", fontSize: "15px" }}
                className="mx-1"
                onClick={closeNavbar}
              >
                <Button variant="contained" color="primary">

                  Upload
                </Button>
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarData;
