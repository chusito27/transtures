import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { t } = useTranslation();

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
    <Container fluid className="p-4">
      <h1 className="mb-4">{t('services_admin')}</h1>
      <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
        {t('add_service')}
      </Button>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>{t('title')}</th>
            <th>{t('description')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.title}</td>
              <td>{service.description}</td>
              <td>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleShowModal(service)}>
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

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{currentService ? t('edit_service') : t('add_service')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t('title')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enter_title')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('description')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={t('enter_description')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                {currentService ? t('update') : t('add')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ServicesAdmin;
