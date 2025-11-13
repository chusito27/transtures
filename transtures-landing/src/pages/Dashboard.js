import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="bg-light">
          <Nav className="flex-column">
            <Nav.Link>Inicio</Nav.Link>
            <Nav.Link>Destinos</Nav.Link>
            <Nav.Link>Banners</Nav.Link>
            <Nav.Link>Servicios</Nav.Link>
            <Nav.Link>Finanzas</Nav.Link>
          </Nav>
        </Col>
        <Col md={10}>
          <h1>Dashboard</h1>
          {/* Content for the selected module will be rendered here */}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
