import React from 'react';
import { Carousel, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Banner.css';

const Banner = () => {
  const { t } = useTranslation();

  return (
    <div className="banner-container">
      <Carousel className="banner-carousel">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/banners/atanas-malamov-4jgWVpKHO_4-unsplash.jpg"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/banners/sterling-lanier-WDBqiHt3tNo-unsplash.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/banners/zdenek-machacek-XUFMiGkv-60-unsplash.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
      <div className="banner-caption-overlay">
        <h3>{t('book_your_next_trip')}</h3>
        <a href="https://wa.me/50672972591" target="_blank" rel="noopener noreferrer">
          <Button variant="primary">{t('book_now')}</Button>
        </a>
      </div>
    </div>
  );
};

export default Banner;
