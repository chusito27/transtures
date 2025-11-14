import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form, Image } from 'react-bootstrap'; // Import Image
import { db } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import axios from 'axios'; // Import axios

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]); // New state for image files
  const [imagePreviews, setImagePreviews] = useState([]); // New state for image previews
  const [availability, setAvailability] = useState(''); // New state for availability
  const [loadingImageUpload, setLoadingImageUpload] = useState(false); // New state for image upload loading
  const { t } = useTranslation();

  const IMGBB_API_KEY = 'c3c967bfcb3d9af7f562173450c95ce1'; // imgBB API Key

  const servicesCollectionRef = collection(db, 'services');

  const getServices = useCallback(async () => {
    const data = await getDocs(servicesCollectionRef);
    setServices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [servicesCollectionRef]);

  useEffect(() => {
    getServices();
  }, [getServices]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) { // Max 3 images
      alert(t('max_3_images'));
      return;
    }
    setSelectedFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading image to imgBB:', error);
      alert(t('image_upload_failed', { fileName: file.name }));
      return null;
    }
  };

  const handleShowModal = (service = null) => {
    setCurrentService(service);
    setTitle(service ? service.title : '');
    setDescription(service ? service.description : '');
    setAvailability(service ? service.availability : ''); // Set availability
    setImagePreviews(service && service.images ? service.images : []); // Set image previews for existing images
    setSelectedFiles([]); // Clear selected files for new upload
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentService(null);
    setTitle('');
    setDescription('');
    setAvailability('');
    setSelectedFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingImageUpload(true);
    let imageUrls = currentService && currentService.images ? [...currentService.images] : [];

    try {
      if (selectedFiles.length > 0) {
        const uploadedUrls = [];
        for (const file of selectedFiles) {
          const url = await uploadImageToImgBB(file);
          if (url) {
            uploadedUrls.push(url);
          }
        }
        imageUrls = uploadedUrls; // Replace existing images with new uploads
      }

      if (imageUrls.length === 0 && selectedFiles.length > 0) {
        alert(t('no_images_uploaded'));
        setLoadingImageUpload(false);
        return;
      }

      if (currentService) {
        const serviceDoc = doc(db, 'services', currentService.id);
        await updateDoc(serviceDoc, { title, description, availability, images: imageUrls });
      } else {
        await addDoc(servicesCollectionRef, { title, description, availability, images: imageUrls });
      }
      getServices();
      handleCloseModal();
    } catch (error) {
      console.error('Error adding/updating service:', error);
      alert(t('error_adding_service'));
    } finally {
      setLoadingImageUpload(false);
    }
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
            <th>{t('availability')}</th>
            <th>{t('images')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.title}</td>
              <td>{service.description}</td>
              <td>{service.availability}</td>
              <td>
                {service.images && service.images.map((img, idx) => (
                  <img key={idx} src={img} alt="service" style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }} />
                ))}
              </td>
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
            <Form.Group className="mb-3">
              <Form.Label>{t('availability')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('enter_availability')}
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>{t('select_images')} ({t('up_to_3')})</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">
                {t('image_upload_note_3')}
              </Form.Text>
            </Form.Group>

            {imagePreviews.length > 0 && (
              <div className="mb-3">
                <h5>{t('image_previews')}</h5>
                <div className="d-flex flex-wrap">
                  {imagePreviews.map((src, index) => (
                    <Image key={index} src={src} thumbnail style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px', marginBottom: '10px' }} />
                  ))}
                </div>
              </div>
            )}

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={loadingImageUpload}>
                {loadingImageUpload ? t('uploading_images') : (currentService ? t('update') : t('add'))}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ServicesAdmin;
