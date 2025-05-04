import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import instance from '../../axios'; // Correct - only importing instance
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './UserDashboard.css';
import ChatBot from '../ChatBot/ChatBot';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // <-- Correctly added useLocation

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');

    if (token && role) {
      if (role === 'admin') {
        navigate('/admindashboard');
      } else if (role === 'user') {
        // stay on user dashboard
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('id');
        if (!userId) {
          alert('User not logged in!');
          navigate('/login');
          return;
        }

        const response = await instance.get(`/user/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); // initial call
    const intervalId = setInterval(fetchUserData, 10000); // refresh every 10s

    return () => clearInterval(intervalId); // cleanup
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3">Loading your dashboard...</h5>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-screen">
        <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
        <h5 className="mt-3">No User Found</h5>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>
          Return to Login
        </button>
      </div>
    );
  }

  const currentPath = location.pathname;

  const handleCardDetailsClick = () => {
    if (userData.adminAction === 'PENDING') {
      navigate('/userdashboard/pending');
    } else if (userData.adminAction === 'APPROVED') {
      if (userData.cardStatus === 'INACTIVE') {
        navigate('/userdashboard/activate');
      } else if (userData.cardStatus === 'BLOCKED') {
        navigate('/userdashboard/blocked');
      } else {
        navigate('/userdashboard/details');
      }
    }
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="dashboard-navbar p-5">
        <div className="navbar-content">
          <div className="d-flex align-items-center">
            <button
              className="sidebar-toggle me-3 d-lg-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list"></i>
            </button>
            <div className="brand-logo">
              <i className="bi bi-currency-exchange"></i>
              <span>Meta ForexCard</span>
            </div>
          </div>

          <div className="navbar-actions">
            <div className="user-profile">
              <div className="user-avatar">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{userData?.name}</span>
                <span className="user-email">{userData?.email}</span>
              </div>
            </div>
            <button className="btn btn-outline-danger logout-btn" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Layout */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <ul className="sidebar-menu">
            <li>
              <button className={`menu-item ${currentPath === '/userdashboard' ? 'active' : ''}`} onClick={() => handleNavigation('/userdashboard')}>
                <i className="bi bi-house-door"></i>
                <span>Dashboard</span>
              </button>
            </li>

            <li>
              <button className={`menu-item ${currentPath === '/userdashboard/profile' ? 'active' : ''}`} onClick={() => handleNavigation('/userdashboard/profile')}>
                <i className="bi bi-person"></i>
                <span>My Profile</span>
              </button>
            </li>

            {userData?.adminAction === null ? (
              <li>
                <button className={`menu-item ${currentPath === '/userdashboard/apply' ? 'active' : ''}`} onClick={() => handleNavigation('/userdashboard/apply')}>
                  <i className="bi bi-credit-card"></i>
                  <span>Apply for Card</span>
                </button>
              </li>
            ) : (
              <li>
                <button
                  className={`menu-item ${['/userdashboard/details', '/userdashboard/pending', '/userdashboard/activate', '/userdashboard/blocked'].includes(currentPath) ? 'active' : ''}`}
                  onClick={handleCardDetailsClick}
                >
                  <i className="bi bi-card-text"></i>
                  <span>My Card</span>
                </button>
              </li>
            )}

            <li>
              <button className={`menu-item ${currentPath === '/userdashboard/transaction' ? 'active' : ''}`} onClick={() => handleNavigation('/userdashboard/transaction')}>
                <i className="bi bi-cash-stack"></i>
                <span>Payment</span>
              </button>
            </li>

            <li>
              <button className={`menu-item ${currentPath === '/userdashboard/transactionhistory' ? 'active' : ''}`} onClick={() => handleNavigation('/userdashboard/transactionhistory')}>
                <i className="bi bi-clock-history"></i>
                <span>Transactions</span>
              </button>
            </li>
          </ul>

          <div className="sidebar-footer">
            <div className="support-card">
              <i className="bi bi-headset"></i>
              <div>
                <h6>Need Help?</h6>
                <p>24/7 Customer Support</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          <Outlet context={{ userData }} />
        </main>
      </div>

      {/* Quick Actions (Mobile) */}
      <div className="quick-actions d-lg-none">
        <button className={`action-btn ${currentPath === '/userdashboard' ? 'active' : ''}`} onClick={() => handleNavigation('/userdashboard')}>
          <i className="bi bi-house-door"></i>
          <span>Home</span>
        </button>

        {userData?.adminAction === null ? (
          <button className={`action-btn ${currentPath === '/userdashboard/apply' ? 'active' : ''}`} onClick={() => handleNavigation('/userdashboard/apply')}>
            <i className="bi bi-credit-card"></i>
            <span>Apply</span>
          </button>
        ) : (
          <button className={`action-btn ${['/userdashboard/details', '/userdashboard/pending', '/userdashboard/activate', '/userdashboard/blocked'].includes(currentPath) ? 'active' : ''}`} onClick={handleCardDetailsClick}>
            <i className="bi bi-card-text"></i>
            <span>Card</span>
          </button>
        )}

        <button className={`action-btn ${currentPath === '/userdashboard/transaction' ? 'active' : ''}`} onClick={() => handleNavigation('/userdashboard/transaction')}>
          <i className="bi bi-cash-stack"></i>
          <span>Pay</span>
        </button>

        <button className={`action-btn ${currentPath === '/userdashboard/profile' ? 'active' : ''}`} onClick={() => handleNavigation('/userdashboard/profile')}>
          <i className="bi bi-person"></i>
          <span>Profile</span>
        </button>
      </div>
      <ChatBot />
    </div>
  );
};

export default UserDashboard;
