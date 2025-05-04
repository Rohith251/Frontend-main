import { Link } from 'react-router-dom';
import './Footer.module.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>Global Forex Card</h5>
            <p>Making international travel seamless with our multi-currency solutions.</p>
          </div>
          <div className="col-md-2 mb-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white">Home</Link></li>
              <li><Link to="/login" className="text-white">Login</Link></li>
              <li><Link to="/register" className="text-white">Register</Link></li>
              <li><Link to="#" className="text-white">Rates</Link></li>
              <li><Link to="#" className="text-white">FAQ</Link></li>
            </ul>
          </div>
          <div className="col-md-3 mb-3">
            <h6>Contact Us</h6>
            <p>Email: support@globalforexcard.com</p>
            <p>Phone: +1 (800) 123-4567</p>
          </div>
        </div>
        <div className="text-center pt-3 border-top mt-3">
          <p>&copy; {new Date().getFullYear()} Global Forex Card. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
