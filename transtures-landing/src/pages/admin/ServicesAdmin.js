import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const servicesCollectionRef = collection(db, 'services');

  const getServices = useCallback(async () => {
    const data = await getDocs(servicesCollectionRef);
    setServices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [servicesCollectionRef]);

  useEffect(() => {
    getServices();
  }, [getServices]);

  const handleShowModal = (service = null) => {
    setCurrentService(service);
    setTitle(service ? service.title : '');
    setDescription(service ? service.description : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentService(null);
    setTitle('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentService) {
      const serviceDoc = doc(db, 'services', currentService.id);
      await updateDoc(serviceDoc, { title, description });
    } else {
      await addDoc(servicesCollectionRef, { title, description });
    }
    getServices();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const serviceDoc = doc(db, 'services', id);
    await deleteDoc(serviceDoc);
    getServices();
  };

  return (
    <Container>
      <h1>Services Admin</h1>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Service
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.title}</td>
              <td>{service.description}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(service)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(service.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentService ? 'Edit Service' : 'Add Service'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {currentService ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ServicesAdmin;
