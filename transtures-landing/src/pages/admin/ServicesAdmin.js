import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false); // Keep for edit functionality
  const [currentService, setCurrentService] = useState(null); // Keep for edit functionality
  const [title, setTitle] = useState(''); // Keep for edit functionality
  const [description, setDescription] = useState(''); // Keep for edit functionality
  const [images, setImages] = useState(''); // Keep for edit functionality
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  const servicesCollectionRef = collection(db, 'services');

  const getServices = useCallback(async () => {
    const data = await getDocs(servicesCollectionRef);
    setServices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [servicesCollectionRef]);

  useEffect(() => {
    getServices();
  }, [getServices]);

  const handleAddServiceClick = () => {
    navigate('/admin/servicios/add'); // Navigate to the new AddService page
  };

  const handleEditServiceClick = (service) => {
    // For now, we'll just navigate to the add page, but later this will be an edit page
    navigate(`/admin/servicios/edit/${service.id}`);
  };

  const handleDelete = async (id) => {
    const serviceDoc = doc(db, 'services', id);
    await deleteDoc(serviceDoc);
    getServices();
  };

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">{t('services_admin')}</h1>
      <Button variant="primary" className="mb-3" onClick={handleAddServiceClick}>
        {t('add_service')}
      </Button>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>{t('title')}</th>
            <th>{t('description')}</th>
            <th>{t('images')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.title}</td>
              <td>{service.description}</td>
              <td>
                {service.images.map((img, idx) => (
                  <img key={idx} src={img} alt="service" style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }} />
                ))}
              </td>
              <td>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditServiceClick(service)}>
                  {t('edit')}
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(service.id)}>
                  {t('delete')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ServicesAdmin;