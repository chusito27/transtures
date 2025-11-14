import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import WhatsAppButton from '../components/WhatsAppButton';
import Footer from '../components/Footer';
import TourCard from '../components/TourCard'; // Import TourCard
import Services from '../components/Services';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'; // Import Spinner
import { useTranslation } from 'react-i18next';
import { db } from '../firebase'; // Import db from firebase
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions

const Home = () => {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDestinations = async () => {
      const data = await getDocs(collection(db, 'destinations'));
      setDestinations(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };
    getDestinations();
  }, []);

  return (
    <div className="App">
      <Header />
      <Banner />
      <section id="destinations" className="py-5">
        <Container>
          <h2 className="text-center mb-4">{t('destinations')}</h2>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">{t('loading')}</span>
              </Spinner>
            </div>
          ) : (
            <Row>
              {destinations.map((tour, index) => (
                <Col md={6} lg={4} key={index} className="mb-4">
                  <TourCard tour={tour} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
      <Services />
      <section id="contact" className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-4">{t('contact_us')}</h2>
          <Row className="justify-content-center">
            <Col md={6} lg={4} className="text-center">
              <p><strong>{t('phone')}:</strong> 8806-9887</p>
              <p><strong>{t('whatsapp')}:</strong> 7297-2591</p>
              <p><strong>{t('email')}:</strong> transtures.sa@gmail.com</p>
            </Col>
          </Row>
        </Container>
      </section>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Home;


