import React, { useState, useEffect, useCallback } from 'react';
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

  const getBanners = useCallback(async () => {
    const data = await getDocs(bannersCollectionRef);
    setBanners(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [bannersCollectionRef]);

  useEffect(() => {
    getBanners();
  }, [getBanners]);

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
    <Container fluid className="p-4">
      <h1 className="mb-4">Banners Admin</h1>
      <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
        Add Banner
      </Button>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="bg-light">
          <tr>
            <th>Image URL</th>
            <th>Alt Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.id}>
              <td>
                <img src={banner.imageUrl} alt={banner.altText} style={{ width: '100px', height: 'auto', objectFit: 'cover' }} />
              </td>
              <td>{banner.altText}</td>
              <td>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleShowModal(banner)}>
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(banner.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-light">
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
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                {currentBanner ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BannersAdmin;
