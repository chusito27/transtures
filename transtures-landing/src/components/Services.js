import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import TourCard from './TourCard';

const Services = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      const data = await getDocs(collection(db, 'services'));
      setServices(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };
    getServices();
  }, []);

  return (
    <section id="services" className="py-5 bg-dark-gray text-white">
      <Container>
        <h2 className="text-center mb-4">{t('our_services')}</h2>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">{t('loading')}</span>
            </Spinner>
          </div>
        ) : (
          <Row>
            {services.map((service, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <TourCard tour={service} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default Services;
