import React, { useState, useEffect } from 'react';
import './Carousel.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      image: "https://i0.wp.com/www.visawebs.com/wp-content/uploads/2021/06/forex-card.png?fit=1024%2C576&ssl=1",
      title: "Multi-Currency Forex Card",
      description: "One card, multiple currencies - travel the world with ease"
    },
    {
      image: "https://d14a823tufvajd.cloudfront.net/images/hHkPQd9HJk1HUfsqfEuC.png",
      title: "Global Acceptance",
      description: "Accepted at millions of locations worldwide"
    },
    {
      image: "https://www.equentis.com/blog/wp-content/uploads/2023/10/TCS-from-October.jpg",
      title: "Secure Transactions",
      description: "Bank-grade security for your peace of mind"
    },
    {
      image: "https://images.moneycontrol.com/static-mcnews/2023/05/cards-01.jpg",
      title: "Competitive Exchange Rates",
      description: "Get the best rates for your international transactions"
    },
    {
      image: "https://images.jdmagicbox.com/quickquotes/listicle/listicle_1686734088918_rmaqw_847x400.jpg",
      title: "24/7 Support",
      description: "Round-the-clock assistance for your forex needs"
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="carousel-control prev" onClick={prevSlide}>
        <i className="bi bi-chevron-left"></i>
      </button>
      <button className="carousel-control next" onClick={nextSlide}>
        <i className="bi bi-chevron-right"></i>
      </button>
      
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel; 