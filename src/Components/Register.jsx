import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import instance from '../axios';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Full Name Validation
    const nameRegex = /^[A-Z][a-zA-Z\s]*$/;
    if (!nameRegex.test(form.name)) {
      toast.error('Full Name must start with a capital letter and contain only alphabets.');
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Password Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      toast.error('Password must be at least 8 characters, with 1 uppercase letter, 1 special character, and 1 number.');
      return;
    }

    // Confirm Password Match
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // If all validations pass
    try {
      const { name, email, password } = form;
      await instance.post('/user/addUser', { name, email, password });

      toast.success('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Registration failed! Please try again.');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row g-0 w-100">
        {/* Left Info Panel */}
        <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center p-4 bg-white">
          <div className="text-center mx-auto" style={{ maxWidth: '350px' }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Signup Illustration"
              className="img-fluid mb-3"
              style={{ height: '150px' }}
            />
            <h3 className="fw-bold text-primary mb-2">Welcome to ForexCard</h3>
            <p className="text-muted mb-3">
              Manage your global spending effortlessly. Safe, simple, and smart.
            </p>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 mb-1 d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-globe fs-5 text-primary"></i>
                </div>
                <p className="mb-0 small text-muted">Global Access</p>
              </div>
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 mb-1 d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-shield-lock fs-5 text-primary"></i>
                </div>
                <p className="mb-0 small text-muted">Secure</p>
              </div>
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 mb-1 d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-lightning-charge fs-5 text-primary"></i>
                </div>
                <p className="mb-0 small text-muted">Fast</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-2 p-md-4">
          <div className="card shadow border-0 rounded-3 w-100" style={{ maxWidth: '450px' }}>
            <div className="card-body p-3 p-md-4">
              <div className="text-center mb-3">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                     style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-person-plus fs-4 text-white"></i>
                </div>
                <h2 className="fw-bold mb-1">Create Account</h2>
                <p className="text-muted small">Join us today to get started</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label htmlFor="name" className="form-label fw-semibold small">
                    <i className="bi bi-person-fill me-2 text-primary"></i>Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light py-1">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control py-1"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="email" className="form-label fw-semibold small">
                    <i className="bi bi-envelope-fill me-2 text-primary"></i>Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light py-1">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control py-1"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="password" className="form-label fw-semibold small">
                    <i className="bi bi-lock-fill me-2 text-primary"></i>Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light py-1">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control py-1"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="password-requirements mt-1">
                    <p className="mb-1">Password must contain:</p>
                    <ul className="list-unstyled">
                      <li className={form.password.length >= 8 ? 'text-success' : 'text-muted'}>
                        <i className={`bi ${form.password.length >= 8 ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(form.password) ? 'text-success' : 'text-muted'}>
                        <i className={`bi ${/[A-Z]/.test(form.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                        One uppercase letter
                      </li>
                      <li className={/\d/.test(form.password) ? 'text-success' : 'text-muted'}>
                        <i className={`bi ${/\d/.test(form.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                        One number
                      </li>
                      <li className={/[\W_]/.test(form.password) ? 'text-success' : 'text-muted'}>
                        <i className={`bi ${/[\W_]/.test(form.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold small">
                    <i className="bi bi-lock-fill me-2 text-primary"></i>Confirm Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light py-1">
                      <i className="bi bi-key-fill text-muted"></i>
                    </span>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control py-1"
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" id="terms" required />
                  <label className="form-check-label small text-muted" htmlFor="terms">
                    I agree to the <a href="/terms" className="text-primary text-decoration-none">Terms</a> and <a href="/privacy" className="text-primary text-decoration-none">Privacy Policy</a>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-2 py-2">
                  <i className="bi bi-person-plus me-2"></i>Register Now
                </button>
              </form>

              <div className="text-center mt-3">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <hr className="flex-grow-1" />
                  <span className="px-2 text-muted small">OR</span>
                  <hr className="flex-grow-1" />
                </div>
              </div>

              <p className="text-center mt-2 mb-0 text-muted small">
                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
