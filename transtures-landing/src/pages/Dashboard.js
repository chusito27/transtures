import React from 'react';
import { Nav } from 'react-bootstrap';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div>
      <div className="sidebar">
        <Nav className="flex-column">
          <Nav.Link>Inicio</Nav.Link>
          <Nav.Link>Destinos</Nav.Link>
          <Nav.Link>Banners</Nav.Link>
          <Nav.Link>Servicios</Nav.Link>
          <Nav.Link>Finanzas</Nav.Link>
        </Nav>
      </div>
      <div className="content">
        <h1>Dashboard</h1>
        {/* Content for the selected module will be rendered here */}
      </div>
    </div>
  );
};

export default Dashboard;
