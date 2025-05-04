import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Home.css';
import CurrencyConverter from "./CurrencyConvertor";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import Carousel from "./Carousel";
import { useNavigate } from "react-router-dom";
import ChatBot from './ChatBot/ChatBot';

export default function ForexCardLandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    // Only redirect from landing page if logged in
    if (window.location.pathname === '/' && token && role) {
      if (role === 'admin') {
        navigate('/admindashboard');
      } else if (role === 'user') {
        navigate('/userdashboard');
      }
    }
  }, [navigate]);

  return (
    <div className="forex-landing-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg p-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <i className="bi bi-currency-exchange me-2"></i>
            <span className="fw-bold">Meta ForexCard</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  <i className="bi bi-star me-1"></i>
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">
                  <i className="bi bi-gear me-1"></i>
                  How It Works
                </a>
              </li>
              <li className="nav-item ms-lg-3">
                <a className="btn btn-outline-light" href="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </a>
              </li>
              <li className="nav-item ms-lg-2">
                <a className="btn btn-light text-primary" href="/register">
                  <i className="bi bi-person-plus me-1"></i>
                  Register
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Carousel */}
      <div className="carousel-section">
        <Carousel />
      </div>

      {/* Currency Converter */}
      <div className="converter-section">
        <div className="container-lg">
          <CurrencyConverter />
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container-lg text-center">
          <h2 className="section-title">Why Choose Our Forex Card?</h2>
          <div className="row g-4">
            {[
              {
                icon: "bi-currency-exchange",
                title: "Multi-Currency Support",
                desc: "Load up to 20 currencies easily.",
                hoverDesc: "Enjoy 20+ currencies on one card — no hassle!"
              },
              {
                icon: "bi-percent",
                title: "Low Conversion Fees",
                desc: "Best rates, lowest charges.",
                hoverDesc: "Save money with ultra-low currency conversion rates."
              },
              {
                icon: "bi-shield-lock-fill",
                title: "Secure Transactions",
                desc: "Bank-grade security protection.",
                hoverDesc: "Your money is safe with multi-layer security."
              },
              {
                icon: "bi-globe-americas",
                title: "Global Acceptance",
                desc: "Spend worldwide at ease.",
                hoverDesc: "Shop and travel across 180+ countries seamlessly."
              }
            ].map((item, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="feature-card">
                  <div className="feature-card-inner">
                    <div className="feature-front">
                      <div className="feature-icon"><i className={`bi ${item.icon}`}></i></div>
                      <h5>{item.title}</h5>
                      <p>{item.desc}</p>
                    </div>
                    <div className="feature-back">
                      <h5>{item.title}</h5>
                      <p>{item.hoverDesc}</p>
                      <a href="#" className="btn-learn-more">Learn More</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container-lg text-center">
          <h2 className="section-title">How It Works</h2>
          <div className="row g-4">
            {[
              { step: "1", title: "Apply Online", desc: "Fill out a quick online application." },
              { step: "2", title: "Activate Your Card", desc: "Activate your card to start using it worldwide." },
              { step: "3", title: "Start Using", desc: "Spend anywhere across the globe." }
            ].map((item, i) => (
              <div className="col-md-4" key={i}>
                <div className="step-card">
                  <div className="step-circle">{item.step}</div>
                  <h5>{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container-lg text-center">
          <h2>Ready to Start Your Journey?</h2>
          <p>Get your ForexCard and travel the world hassle-free!</p>
          <a href="/register" className="cta-button">Apply Now</a>
        </div>
      </section>

      <Testimonials />
      <Faq />
      <ChatBot />

      {/* Footer */}
      <footer id="contact" className="footer-section">
        <div className="container-lg">
          <div className="row gy-4">
            <div className="col-md-3">
              <h5>
                <i className="bi bi-currency-exchange me-2"></i>
                ForexCard
              </h5>
              <p>Secure, reliable, and global Forex Card solutions.</p>
            </div>
            <div className="col-md-3">
              <h6>
                <i className="bi bi-link-45deg me-1"></i>
                Quick Links
              </h6>
              <ul className="footer-links">
                <li><a href="#features">About</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>
                <i className="bi bi-headset me-1"></i>
                Support
              </h6>
              <ul className="footer-links">
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>
                <i className="bi bi-telephone me-1"></i>
                Contact Us
              </h6>
              <p>+91 23456123<br />020-123-4327</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 ForexCard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
