import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TourCard from './TourCard';
import { useTranslation } from 'react-i18next';

const Destinations = () => {
  const { t } = useTranslation();

  const tours = [
    {
      title: 'Visita El Volcan Arenal',
      images: [
        'https://via.placeholder.com/400x300?text=Arenal+1',
        'https://via.placeholder.com/400x300?text=Arenal+2',
        'https://via.placeholder.com/400x300?text=Arenal+3',
        'https://via.placeholder.com/400x300?text=Arenal+4',
        'https://via.placeholder.com/400x300?text=Arenal+5',
      ],
      description: 'Detailed information about the Arenal Volcano tour.',
    },
    {
      title: 'Vamos A miami Juntos',
      images: [
        'https://via.placeholder.com/400x300?text=Miami+1',
        'https://via.placeholder.com/400x300?text=Miami+2',
        'https://via.placeholder.com/400x300?text=Miami+3',
        'https://via.placeholder.com/400x300?text=Miami+4',
        'https://via.placeholder.com/400x300?text=Miami+5',
      ],
      description: 'Detailed information about the Miami tour.',
    },
    {
      title: 'De Viaje a Nicaragua',
      images: [
        'https://via.placeholder.com/400x300?text=Nicaragua+1',
        'https://via.placeholder.com/400x300?text=Nicaragua+2',
        'https://via.placeholder.com/400x300?text=Nicaragua+3',
        'https://via.placeholder.com/400x300?text=Nicaragua+4',
        'https://via.placeholder.com/400x300?text=Nicaragua+5',
      ],
      description: 'Detailed information about the Nicaragua tour.',
    },
    {
      title: 'Guatemala te espera',
      images: [
        'https://via.placeholder.com/400x300?text=Guatemala+1',
        'https://via.placeholder.com/400x300?text=Guatemala+2',
        'https://via.placeholder.com/400x300?text=Guatemala+3',
        'https://via.placeholder.com/400x300?text=Guatemala+4',
        'https://via.placeholder.com/400x300?text=Guatemala+5',
      ],
      description: 'Detailed information about the Guatemala tour.',
    },
  ];

  return (
    <section id="destinations" className="py-5">
      <Container>
        <h2 className="text-center mb-4">{t('destinations')}</h2>
        <Row>
          {tours.map((tour, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <TourCard tour={tour} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Destinations;
