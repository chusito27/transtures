import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AddDestination = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const IMGBB_API_KEY = 'c3c967bfcb3d9af7f562173450c95ce1';

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert(t('max_5_images'));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = [];
      for (const file of selectedFiles) {
        const url = await uploadImageToImgBB(file);
        if (url) {
          imageUrls.push(url);
        }
      }

      if (imageUrls.length === 0 && selectedFiles.length > 0) {
        alert(t('no_images_uploaded'));
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'destinations'), {
        title,
        description,
        images: imageUrls,
        createdAt: new Date(),
      });

      alert(t('destination_added_successfully'));
      navigate('/admin/destinos');
    } catch (error) {
      console.error('Error adding destination:', error);
      alert(t('error_adding_destination'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">{t('add_new_destination')}</h1>
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
          <Form.Label>{t('select_images')} ({t('up_to_5')})</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <Form.Text className="text-muted">
            {t('image_upload_note')}
          </Form.Text>
        </Form.Group>

        {imagePreviews.length > 0 && (
          <div className="mb-3">
            <h5>{t('image_previews')}</h5>
            <Row>
              {imagePreviews.map((src, index) => (
                <Col xs={6} md={4} lg={2} key={index} className="mb-3">
                  <Image src={src} thumbnail fluid />
                </Col>
              ))}
            </Row>
          </div>
        )}

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? t('adding_destination') : t('add_destination')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/admin/destinos')} disabled={loading}>
            {t('cancel')}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddDestination;
