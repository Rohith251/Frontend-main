import React, { useState, useRef, useEffect } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const autoPlayTimeout = useRef(null);

  const testimonials = [
    {
      name: "Chinna Rao",
      role: "Frequent Traveler",
      text: "The ForexCard has made my international travels so much easier. No more currency exchange hassles!",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 5
    },
    {
      name: "Rohith",
      role: "Business Professional",
      text: "Managing multiple currencies for my business has never been simpler. Highly recommended!",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 4
    },
    {
      name: "Shivasai",
      role: "Student Abroad",
      text: "As an international student, this card has been a lifesaver for managing my expenses.",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      rating: 5
    },
    {
      name: "Durga",
      role: "Travel Blogger",
      text: "As an Indian traveler, this card has been a game-changer. The multi-currency support is excellent!",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 5
    },
    {
      name: "Vikas",
      role: "Business Owner",
      text: "Perfect for my international business transactions. The low conversion fees are a big plus!",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 5
    },
    {
      name: "Samson",
      role: "Business Owner",
      text: "Perfect for my international business transactions. The low conversion fees are a big plus!",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 5
    },
  ];

  const startAutoPlay = () => {
    if (autoPlayTimeout.current) clearTimeout(autoPlayTimeout.current);
    autoPlayTimeout.current = setTimeout(() => {
      if (isAutoPlaying && !isSwiping) {
        nextSlide();
      }
    }, 5000);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoPlay();
    }
    return () => {
      if (autoPlayTimeout.current) clearTimeout(autoPlayTimeout.current);
    };
  }, [activeIndex, isAutoPlaying, isSwiping]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    setIsSwiping(true);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    
    const touchX = e.touches[0].clientX;
    const diff = touchStartX.current - touchX;
    
    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1;
      const newIndex = (activeIndex + direction + testimonials.length) % testimonials.length;
      setActiveIndex(newIndex);
      setIsSwiping(false);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    setIsAutoPlaying(true);
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setActiveIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i 
        key={index} 
        className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'}`}
      ></i>
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="container-lg">
        <h2 className="section-title1">What Our Customers Say</h2>
        <div 
          className="testimonials-slider"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="swipe-button prev" onClick={prevSlide}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <div 
            className="testimonials-container"
            ref={containerRef}
            style={{
              transform: `translateX(-${activeIndex * 100}%)`
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`testimonial-card ${isSwiping ? 'swiping' : ''} ${
                  index === activeIndex ? 'active' : 'inactive'
                }`}
              >
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-content">
                  <div className="rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="testimonial-text">{testimonial.text}</p>
                  <h5 className="testimonial-name">{testimonial.name}</h5>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="swipe-button next" onClick={nextSlide}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        <div className="navigation-dots">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
