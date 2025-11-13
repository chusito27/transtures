import React from 'react';
import { Nav } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import DestinationsAdmin from './admin/DestinationsAdmin';
import BannersAdmin from './admin/BannersAdmin';
import ServicesAdmin from './admin/ServicesAdmin';
import FinancesAdmin from './admin/FinancesAdmin';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div>
      <div className="sidebar">
        <Nav className="flex-column">
          <Nav.Link as={Link} to="inicio">Inicio</Nav.Link>
          <Nav.Link as={Link} to="destinos">Destinos</Nav.Link>
          <Nav.Link as={Link} to="banners">Banners</Nav.Link>
          <Nav.Link as={Link} to="servicios">Servicios</Nav.Link>
          <Nav.Link as={Link} to="finanzas">Finanzas</Nav.Link>
        </Nav>
      </div>
      <div className="content">
        <Routes>
          <Route path="inicio" element={<h2>Welcome to the Admin Dashboard!</h2>} />
          <Route path="destinos" element={<DestinationsAdmin />} />
          <Route path="banners" element={<BannersAdmin />} />
          <Route path="servicios" element={<ServicesAdmin />} />
          <Route path="finanzas" element={<FinancesAdmin />} />
          <Route path="/" element={<h2>Welcome to the Admin Dashboard!</h2>} /> {/* Default route */}
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
