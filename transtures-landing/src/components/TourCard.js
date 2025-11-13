import React, { useState } from 'react';
import { Card, Carousel, Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const TourCard = ({ tour }) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const whatsappMessage = encodeURIComponent(`${t('interested_in_tour')} ${tour.title}... ${t('more_info')}`);
  const whatsappLink = `https://wa.me/50672972591?text=${whatsappMessage}`;

  return (
    <>
      <Card style={{ cursor: 'pointer' }}>
        <Carousel interval={2000} className="card-carousel">
          {tour.images.map((image, index) => (
            <Carousel.Item key={index}>
              <img className="d-block w-100 card-img-fixed-height" src={image} alt={tour.title} />
            </Carousel.Item>
          ))}
        </Carousel>
        <Card.Body>
          <Card.Title>{tour.title}</Card.Title>
          <Card.Text>{tour.description}</Card.Text>
          <Button variant="primary" size="sm" href={whatsappLink} target="_blank" rel="noopener noreferrer">
            {t('book_now')}
          </Button>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{tour.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{tour.description}</p>
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
