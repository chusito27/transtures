import React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import DestinationsAdmin from './admin/DestinationsAdmin';
import BannersAdmin from './admin/BannersAdmin';
import ServicesAdmin from './admin/ServicesAdmin';
import FinancesAdmin from './admin/FinancesAdmin';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin'); // Redirect to admin login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar bg="dark" variant="dark" className="dashboard-navbar">
        <Navbar.Brand href="#home" className="ms-3">Admin Dashboard</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-light" onClick={handleLogout} className="me-3">Logout</Button>
        </Navbar.Collapse>
      </Navbar>
      <div className="d-flex">
        <div className="sidebar">
          <Nav className="flex-column">
                      <Nav.Link onClick={() => navigate('/admin/inicio')}>Inicio</Nav.Link>
                      <Nav.Link onClick={() => navigate('/admin/destinos')}>Destinos</Nav.Link>
                      <Nav.Link onClick={() => navigate('/admin/banners')}>Banners</Nav.Link>
                      <Nav.Link onClick={() => navigate('/admin/servicios')}>Servicios</Nav.Link>
                      <Nav.Link onClick={() => navigate('/admin/finanzas')}>Finanzas</Nav.Link>          </Nav>
        </div>
        <div className="content flex-grow-1">
          <Routes key={location.pathname}> {/* Add key prop here */}
            <Route path="inicio" element={<h2>Welcome to the Admin Dashboard!</h2>} />
            <Route path="destinos" element={<DestinationsAdmin />} />
            <Route path="banners" element={<BannersAdmin />} />
            <Route path="servicios" element={<ServicesAdmin />} />
            <Route path="finanzas" element={<FinancesAdmin />} />
            <Route path="/" element={<h2>Welcome to the Admin Dashboard!</h2>} /> {/* Default route */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
