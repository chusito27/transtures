import React, { useState } from 'react';
import { Card, Carousel, Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const TourCard = ({ tour }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card onClick={handleShow} style={{ cursor: 'pointer' }}>
        <Carousel interval={2000}>
          {tour.images.map((image, index) => (
            <Carousel.Item key={index}>
              <img className="d-block w-100" src={image} alt={tour.title} />
            </Carousel.Item>
          ))}
        </Carousel>
        <Card.Body>
          <Card.Title>{t(tour.title)}</Card.Title>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t(tour.title)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t(tour.description)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TourCard;
