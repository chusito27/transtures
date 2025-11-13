import React from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './App.css';

function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <Header />
      <Banner />
      <Container className="mt-5">
        <Row>
          <Col>
            <section id="services">
              <h2>{t('our_services')}</h2>
              <Row>
                <Col md={4}>
                  <Card>
                    {/* TODO: Replace with a real image URL */}
                    <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Educational+Tours" />
                    <Card.Body>
                      <Card.Title>{t('educational_tours')}</Card.Title>
                      <Card.Text>
                        {t('educational_tours_text')}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    {/* TODO: Replace with a real image URL */}
                    <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Family+Trips" />
                    <Card.Body>
                      <Card.Title>{t('family_trips')}</Card.Title>
                      <Card.Text>
                        {t('family_trips_text')}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    {/* TODO: Replace with a real image URL */}
                    <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Luxury+Bus+Tours" />
                    <Card.Body>
                      <Card.Title>{t('luxury_bus_tours')}</Card.Title>
                      <Card.Text>
                        {t('luxury_bus_tours_text')}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </section>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <section id="contact">
              <h2>{t('contact_us')}</h2>
              <p><strong>{t('address')}</strong> Cl. 145 #94-45, Bogotá, Cundinamarca, Colombia</p>
              <p><strong>{t('phone')}</strong> +57 311 4900367</p>
            </section>
          </Col>
        </Row>
      </Container>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}

export default App;
