import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();

  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="https://destinosviajeros.com/wp-content/uploads/formidable/117/logo-606.jpg"
            width="100"
            height="auto"
            className="d-inline-block align-top"
            alt="Transtures Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">{t('home')}</Nav.Link>
            <Nav.Link href="#services">{t('services')}</Nav.Link>
            <Nav.Link href="#contact">{t('contact')}</Nav.Link>
          </Nav>
          <Nav className="ms-auto d-flex align-items-center">
            <LanguageSwitcher />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
