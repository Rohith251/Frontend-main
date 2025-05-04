import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import instance from '../axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FaEnvelope, FaKey, FaLock, FaShieldAlt } from 'react-icons/fa';
import './ForgetPassword.css';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email.');
      return;
    }
    try {
      setLoading(true);
      await instance.post('/email/send-forgot-password-otp', null, {
        params: { email: formData.email },
      });
      toast.success('OTP sent successfully to your email.');
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, otp, newPassword, confirmPassword } = formData;

    if (!otp || !newPassword || !confirmPassword) {
      toast.error('Please fill all fields.');
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error('Password must be at least 8 characters long and contain one uppercase letter, one number, and one special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      await instance.post('/reset/password', null, {
        params: { email, otp, newPassword },
      });
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <motion.div 
        className="forgot-password-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-header text-center mb-4">
          <motion.div 
            className="icon-wrapper mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <FaShieldAlt className="header-icon" />
          </motion.div>
          <h2 className="fw-bold">Reset Your Password</h2>
          <p className="text-muted">Enter your email and we'll help you reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={otpSent}
            />
            <label htmlFor="email">
              <FaEnvelope className="me-2" />
              Email address
            </label>
          </div>

          {!otpSent ? (
            <motion.button
              type="button"
              className="btn btn-primary w-100 mb-3"
              onClick={handleSendOtp}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              ) : (
                <FaEnvelope className="me-2" />
              )}
              Send OTP
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="otp">
                  <FaKey className="me-2" />
                  Enter OTP
                </label>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="newPassword">
                  <FaLock className="me-2" />
                  New Password
                </label>
              </div>

              <div className="password-requirements mb-3">
                <p className="mb-2">Password must contain:</p>
                <ul className="list-unstyled">
                  <li className={formData.newPassword.length >= 8 ? 'text-success' : 'text-muted'}>
                    <i className={`bi ${formData.newPassword.length >= 8 ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? 'text-success' : 'text-muted'}>
                    <i className={`bi ${/[A-Z]/.test(formData.newPassword) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    One uppercase letter
                  </li>
                  <li className={/\d/.test(formData.newPassword) ? 'text-success' : 'text-muted'}>
                    <i className={`bi ${/\d/.test(formData.newPassword) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    One number
                  </li>
                  <li className={/[\W_]/.test(formData.newPassword) ? 'text-success' : 'text-muted'}>
                    <i className={`bi ${/[\W_]/.test(formData.newPassword) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                    One special character
                  </li>
                </ul>
              </div>

              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="confirmPassword">
                  <FaLock className="me-2" />
                  Confirm Password
                </label>
              </div>

              <motion.button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                  <FaShieldAlt className="me-2" />
                )}
                Reset Password
              </motion.button>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;
