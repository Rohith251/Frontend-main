import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import './AdminDashboard.css';
import { toast } from 'react-toastify';
import instance from '../../axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

// ... all imports stay same ...

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Analytics');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const role = localStorage.getItem('role');
    if (!token || !role) return navigate('/login');
    if (role !== 'admin') navigate('/userdashboard');
  }, [navigate]);

  useEffect(() => {
    fetchAllCounts();
    if (activeTab !== 'Analytics') fetchUsers();
  }, [activeTab]);

  useEffect(() => {
    if (counts.pending === 0 && counts.approved === 0 && counts.rejected === 0) return;

    const total = counts.pending + counts.approved + counts.rejected;
    const approvalRate = total > 0 ? (counts.approved / total) * 100 : 0;

    setChartData({
      labels: ['Pending', 'Approved', 'Rejected'],
      datasets: [{
        data: [counts.pending, counts.approved, counts.rejected],
        backgroundColor: ['#ffc107cc', '#198754cc', '#dc3545cc'],
        borderColor: ['#ffc107', '#198754', '#dc3545'],
        borderWidth: 2,
        hoverOffset: 4,
      }]
    });

    setBarChartData({
      labels: ['Applications'],
      datasets: [
        { 
          label: 'Pending', 
          data: [counts.pending], 
          backgroundColor: '#ffc107cc',
          borderColor: '#ffc107',
          borderWidth: 2
        },
        { 
          label: 'Approved', 
          data: [counts.approved], 
          backgroundColor: '#198754cc',
          borderColor: '#198754',
          borderWidth: 2
        },
        { 
          label: 'Rejected', 
          data: [counts.rejected], 
          backgroundColor: '#dc3545cc',
          borderColor: '#dc3545',
          borderWidth: 2
        },
      ]
    });

    setLineChartData({
      labels: ['Last Week', 'This Week'],
      datasets: [{
        label: 'Approval Rate (%)',
        data: [approvalRate - 10, approvalRate],
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.1)',
        tension: 0.4,
        fill: true,
      }]
    });
  }, [counts]);

  const fetchAllCounts = async () => {
    try {
      const [pending, approved, rejected] = await Promise.allSettled([
        instance.get('/admin/pending'),
        instance.get('/user/approved'),
        instance.get('/user/rejected'),
      ]);

      setCounts({
        pending: pending.status === "fulfilled" ? pending.value.data.length : 0,
        approved: approved.status === "fulfilled" ? approved.value.data.length : 0,
        rejected: rejected.status === "fulfilled" ? rejected.value.data.length : 0,
      });
    } catch (err) {
      console.error(err);
      setCounts({ pending: 0, approved: 0, rejected: 0 });
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const endpoints = {
        Pending: '/admin/pending',
        Approved: '/user/approved',
        Rejected: '/user/rejected'
      };
      const res = await instance.get(endpoints[activeTab]);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      const endpoint = `/admin/${action}/${userId}`;
      await instance.put(endpoint);
      toast.success(`User ${action}d successfully!`);
      setSelectedUser(null);
      fetchAllCounts();
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} user.`);
    }
  };

  const fetchSalarySlip = async (userId) => {
    try {
      const res = await instance.get(`/admin/document/${userId}`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      window.open(URL.createObjectURL(blob), '_blank');
    } catch {
      toast.error('Document not available for this user.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-left">
          <h3><i className="bi bi-speedometer2 me-2"></i>Admin Panel</h3>
          <div className="tab-navigation">
            {['Analytics', 'Pending', 'Approved', 'Rejected'].map(tab => (
              <button key={tab} className={`tab-button ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'Analytics' ? (
          <div className="analytics-section">
            {chartData && (
              <div className="chart-container">
                <h5>Application Status</h5>
                <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                  <Doughnut 
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          enabled: true
                        }
                      },
                      cutout: '60%',
                      layout: {
                        padding: 20
                      }
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4361ee' }}>
                      {counts.pending + counts.approved + counts.rejected}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>Total</div>
                  </div>
                </div>
              </div>
            )}
            {barChartData && (
              <div className="chart-container">
                <h5>Application Distribution</h5>
                <div style={{ height: '300px' }}>
                  <Bar 
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          enabled: true
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
            {lineChartData && (
              <div className="chart-container">
                <h5>Approval Rate Trend</h5>
                <div style={{ height: '300px' }}>
                  <Line 
                    data={lineChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          enabled: true
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: function(value) {
                              return value + '%';
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="status-cards">
              <StatusCard icon={activeTab === 'Pending' ? "hourglass-split" : activeTab === 'Approved' ? "check-circle" : "x-circle"} label={`${activeTab} Users`} count={counts[activeTab.toLowerCase()]} />
            </div>
            {loading ? (
              <div className="loading-container"><div className="spinner"></div><p>Loading users...</p></div>
            ) : users.length === 0 ? (
              <div className="empty-state"><i className="bi bi-inbox"></i><p>No {activeTab} applications found.</p></div>
            ) : (
              <div className="table-responsive">
                <table className="users-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Salary</th><th>PAN</th><th>Action</th></tr></thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td><td>{user.email}</td><td>₹{user.salary}</td><td>{user.pan}</td>
                        <td><button className="btn btn-view" onClick={() => setSelectedUser(user)}><i className="bi bi-eye me-1"></i> View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content2">
            <div className="modal-header">
              <h5>
                <i className="bi bi-person-badge"></i>
                Applicant Details
              </h5>
              <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
            </div>
            <div className="modal-body">
              {Object.entries({
                name: { value: selectedUser.name, icon: 'bi-person' },
                email: { value: selectedUser.email, icon: 'bi-envelope' },
                phonenumber: { value: selectedUser.phonenumber, icon: 'bi-telephone' },
                salary: { value: `₹${selectedUser.salary}`, icon: 'bi-currency-rupee' },
                pan: { value: selectedUser.pan, icon: 'bi-card-text' },
                dob: { value: selectedUser.dob, icon: 'bi-calendar-date' },
                gender: { value: selectedUser.gender, icon: 'bi-gender-ambiguous' },
                address: { value: selectedUser.address, icon: 'bi-geo-alt' },
                state: { value: selectedUser.state, icon: 'bi-geo' },
                country: { value: selectedUser.country, icon: 'bi-globe' },
              }).map(([key, data]) => (
                <div className="detail-item" key={key}>
                  <span className="label">
                    <i className={`bi ${data.icon} me-1`}></i>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="value">{data.value || 'Not Available'}</span>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                <i className="bi bi-x-circle"></i>
                Close
              </button>
              {activeTab === 'Pending' && (
                <>
                  <button className="btn btn-danger" onClick={() => handleAction(selectedUser.id, 'reject')}>
                    <i className="bi bi-x-circle"></i>
                    Reject
                  </button>
                  <button className="btn btn-success" onClick={() => handleAction(selectedUser.id, 'approve')}>
                    <i className="bi bi-check-circle"></i>
                    Approve
                  </button>
                </>
              )}
              <button className="btn btn-primary" onClick={() => fetchSalarySlip(selectedUser.id)}>
                <i className="bi bi-file-earmark-pdf"></i>
                View Salary Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusCard = ({ icon, label, count }) => (
  <div className="status-card">
    <div className="status-icon"><i className={`bi bi-${icon}`}></i></div>
    <div className="status-info">
      <h6>{label}</h6>
      <h4>{count}</h4>
    </div>
  </div>
);

export default AdminDashboard;
