import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DestinationsAdmin = () => {
  const [destinations, setDestinations] = useState([]);
  const [showModal, setShowModal] = useState(false); // Keep for edit functionality
  const [currentDestination, setCurrentDestination] = useState(null); // Keep for edit functionality
  const [title, setTitle] = useState(''); // Keep for edit functionality
  const [description, setDescription] = useState(''); // Keep for edit functionality
  const [images, setImages] = useState(''); // Keep for edit functionality
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  const destinationsCollectionRef = collection(db, 'destinations');

  const getDestinations = useCallback(async () => {
    const data = await getDocs(destinationsCollectionRef);
    setDestinations(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [destinationsCollectionRef]);

  useEffect(() => {
    getDestinations();
  }, [getDestinations]);

  const handleAddDestinationClick = () => {
    navigate('/admin/destinos/add'); // Navigate to the new AddDestination page
  };

  const handleEditDestinationClick = (destination) => {
    // For now, we'll just navigate to the add page, but later this will be an edit page
    navigate(`/admin/destinos/edit/${destination.id}`);
  };

  const handleDelete = async (id) => {
    const destinationDoc = doc(db, 'destinations', id);
    await deleteDoc(destinationDoc);
    getDestinations();
  };

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">{t('destinations_admin')}</h1>
      <Button variant="primary" className="mb-3" onClick={handleAddDestinationClick}>
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
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEditDestinationClick(destination)}>
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
    </Container>
  );
};

export default DestinationsAdmin;
