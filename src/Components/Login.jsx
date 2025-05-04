import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import instance from '../axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await instance.post('/auth/login', { email, password });
      const { token, id, role} = response.data;

      // Save token and other data
      localStorage.setItem('jwt', token);
      localStorage.setItem('id', id);
      localStorage.setItem('role', role);



      toast.success('Login successful! Redirecting...');

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admindashboard');
        } else if (role === 'user') {
          navigate('/userdashboard');
        } else if (role === 'auditor') {
          navigate('/auditor');
        } else {
          toast.warning('Unknown role. Please contact support.');
        }
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row g-0 w-100">
        {/* Left Info Panel - Hidden on mobile */}
        <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center p-5 bg-white">
          <div className="text-center mx-auto" style={{ maxWidth: '400px' }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Login Illustration"
              className="img-fluid mb-4"
              style={{ height: '200px' }}
            />
            <h3 className="fw-bold text-primary mb-3">Welcome back to ForexCard</h3>
            <p className="text-muted mb-4">
              Manage your global spending effortlessly. Safe, simple, and smart.
            </p>
            <div className="d-flex justify-content-center gap-4 mt-3">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-2 d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-globe fs-4 text-primary"></i>
                </div>
                <p className="mb-0 small text-muted">Global Access</p>
              </div>
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-2 d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-shield-lock fs-4 text-primary"></i>
                </div>
                <p className="mb-0 small text-muted">Secure</p>
              </div>
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 mb-2 d-inline-flex align-items-center justify-content-center">
                  <i className="bi bi-lightning-charge fs-4 text-primary"></i>
                </div>
                <p className="mb-0 small text-muted">Fast</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center p-3 p-md-5">
          <div className="card shadow border-0 rounded-3 w-100" style={{ maxWidth: '500px' }}>
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-box-arrow-in-right fs-3 text-white"></i>
                </div>
                <h2 className="fw-bold mb-2">Sign In</h2>
                <p className="text-muted">Welcome back! Please enter your details</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="bi bi-envelope-fill me-2 text-primary"></i>Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="bi bi-lock-fill me-2 text-primary"></i>Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label small text-muted" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgetpassword" className="small text-primary text-decoration-none">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mb-3 py-2 d-flex align-items-center justify-content-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <hr className="flex-grow-1" />
                  <span className="px-3 text-muted small">OR</span>
                  <hr className="flex-grow-1" />
                </div>
              </div>

              <p className="text-center mt-3 mb-0 text-muted">
                Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
