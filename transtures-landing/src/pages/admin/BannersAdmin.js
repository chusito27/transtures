import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const BannersAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');

  const bannersCollectionRef = collection(db, 'banners');

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    const data = await getDocs(bannersCollectionRef);
    setBanners(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleShowModal = (banner = null) => {
    setCurrentBanner(banner);
    setImageUrl(banner ? banner.imageUrl : '');
    setAltText(banner ? banner.altText : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentBanner(null);
    setImageUrl('');
    setAltText('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentBanner) {
      const bannerDoc = doc(db, 'banners', currentBanner.id);
      await updateDoc(bannerDoc, { imageUrl, altText });
    } else {
      await addDoc(bannersCollectionRef, { imageUrl, altText });
    }
    getBanners();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const bannerDoc = doc(db, 'banners', id);
    await deleteDoc(bannerDoc);
    getBanners();
  };

  return (
    <Container>
      <h1>Banners Admin</h1>
      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Banner
      </Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Image URL</th>
            <th>Alt Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.id}>
              <td>{banner.imageUrl}</td>
              <td>{banner.altText}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(banner)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(banner.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentBanner ? 'Edit Banner' : 'Add Banner'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alt Text</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter alt text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {currentBanner ? 'Update' : 'Add'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BannersAdmin;
