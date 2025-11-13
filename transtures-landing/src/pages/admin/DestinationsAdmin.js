import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const DestinationsAdmin = () => {
  const [destinations, setDestinations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDestination, setCurrentDestination] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState(''); // Comma separated image URLs
  const { t } = useTranslation();

  const destinationsCollectionRef = collection(db, 'destinations');

  const getDestinations = useCallback(async () => {
    const data = await getDocs(destinationsCollectionRef);
    setDestinations(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [destinationsCollectionRef]);

  useEffect(() => {
    getDestinations();
  }, [getDestinations]);

  const handleShowModal = (destination = null) => {
    setCurrentDestination(destination);
    setTitle(destination ? destination.title : '');
    setDescription(destination ? destination.description : '');
    setImages(destination ? destination.images.join(', ') : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDestination(null);
    setTitle('');
    setDescription('');
    setImages('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imagesArray = images.split(',').map((img) => img.trim());
    if (currentDestination) {
      const destinationDoc = doc(db, 'destinations', currentDestination.id);
      await updateDoc(destinationDoc, { title, description, images: imagesArray });
    } else {
      await addDoc(destinationsCollectionRef, { title, description, images: imagesArray });
    }
    getDestinations();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const destinationDoc = doc(db, 'destinations', id);
    await deleteDoc(destinationDoc);
    getDestinations();
  };

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">{t('destinations_admin')}</h1>
      <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
        {t('add_destination')}
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
          {destinations.map((destination) => (
            <tr key={destination.id}>
              <td>{destination.title}</td>
              <td>{destination.description}</td>
              <td>
                {destination.images.map((img, idx) => (
                  <img key={idx} src={img} alt="destination" style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }} />
                ))}
              </td>
              <td>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleShowModal(destination)}>
                  {t('edit')}
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(destination.id)}>
                  {t('delete')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{currentDestination ? t('edit_destination') : t('add_destination')}</Modal.Title>
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
            <Form.Group className="mb-3">
              <Form.Label>{t('images')} ({t('comma_separated_urls')})</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enter_image_urls')}
                value={images}
                onChange={(e) => setImages(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                {currentDestination ? t('update') : t('add')}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DestinationsAdmin;
