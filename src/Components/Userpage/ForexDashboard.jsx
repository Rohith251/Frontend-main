import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Badge, Dropdown, Alert, Spinner } from 'react-bootstrap';
import { FiBell, FiRotateCw, FiLock, FiDollarSign, FiCreditCard, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import './ForexCardDesign.css';
import './ForexDashboard.css';
import instance from '../../axios';
import { toast } from 'react-hot-toast';

function ForexDashboard() {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [cardStatus, setCardStatus] = useState('Active');
  const [isFlipped, setIsFlipped] = useState(false);
  const [balance, setBalance] = useState(0);
  const [maxLimit, setMaxLimit] = useState(5000);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockingCard, setBlockingCard] = useState(false);

  const [limits, setLimits] = useState({
    daily: 3000,
    international: true,
    contactless: 50
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Forex Rate Change",
      message: "USD/INR rate increased to 83.45 (+0.3%)",
      time: "15 mins ago",
      unread: true,
      type: "rate"
    },
    {
      id: 2,
      title: "Security Update",
      message: "New fraud protection enabled for your card",
      time: "2 hours ago",
      unread: true,
      type: "security"
    },
    {
      id: 3,
      title: "Transaction Alert",
      message: "AED 1,200 spent in Dubai (Merchant: DUBAI MALL)",
      time: "1 day ago",
      unread: false,
      type: "transaction"
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const cardRef = useRef(null);

  const userId = localStorage.getItem('id');

  // Fetch Card & User Details
  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);

        // Card
        const cardResponse = await instance.get(`/card/${userId}`);
        const data = cardResponse.data;
        setCardNumber(data.cardNumber);
        setExpiryDate(data.expiryDate);
        setBalance(data.balance);
        setMaxLimit(data.maxLimit);
        setCvv(data.cvv);
        setCardStatus(data.status);

        // User
        const userResponse = await instance.get(`/user/${userId}`);
        setUserName(userResponse.data.name);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [userId]);

  // 3D card effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = (x - centerX) / 20;
        const rotateX = (centerY - y) / 20;
        cardRef.current.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      }
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      return () => card.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleBlockCard = async () => {
    try {
      setBlockingCard(true);
      const response = await instance.post('/card/block', null, {
        params: {
          userId: userId
        }
      });
      setCardStatus('Blocked');
      toast.success(response.data || 'Card blocked successfully');
      setShowBlockModal(false);
    } catch (error) {
      console.error('Error blocking card:', error);
      toast.error(error.response?.data || 'Failed to block card');
    } finally {
      setBlockingCard(false);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
    if (cardRef.current) cardRef.current.style.transform = '';
  };

  const handleReload = () => {
    setBalance(prev => parseFloat((prev + 500).toFixed(2)));
  };

  const toggleCardDetails = () => setShowCardDetails(!showCardDetails);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleSaveLimits = (e) => {
    e.preventDefault();
    const form = e.target;
    setLimits({
      daily: parseFloat(form.dailyLimit.value),
      international: form.internationalTransactions.checked,
      contactless: parseFloat(form.contactlessLimit.value)
    });
    setShowLimitModal(false);
  };

  const formatCardNumber = (showFull = false) => {
    if (!cardNumber) return '•••• •••• •••• ••••';
    return showFull ? cardNumber.match(/.{1,4}/g).join(' ') : `•••• •••• •••• ${cardNumber.slice(-4)}`;
  };

  const formatExpiryDate = (showFull = false) => {
    if (!expiryDate) return '••/••';
    const [year, month] = expiryDate.split('-');
    return showFull ? `${month}/${year.slice(2)}` : '••/••';
  };

  const formatCVV = (showFull = false) => {
    if (!cvv) return '•••';
    return showFull ? cvv : '•••';
  };

  if (loading) {
    return (
      <div className="forex-dashboard text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="forex-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, <span className="text-primary">{userName || 'User'}</span> <span className="wave">👋</span></h1>
        <div className="header-actions">
          <Dropdown show={showNotifications} onToggle={setShowNotifications}>
            <Dropdown.Toggle variant="light" className="position-relative icon-btn">
              <FiBell size={20} />
              {notifications.some(n => n.unread) && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu className="notification-dropdown">
              <Dropdown.Header className="d-flex justify-content-between">
                <span>Notifications</span>
                <Button variant="link" size="sm" onClick={markAllAsRead}>Mark all read</Button>
              </Dropdown.Header>
              {notifications.map(notification => (
                <Dropdown.Item
                  key={notification.id}
                  className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="d-flex align-items-start">
                    <div className={`notification-icon ${notification.type}`}>
                      {notification.type === 'rate' && <FiDollarSign />}
                      {notification.type === 'security' && <FiLock />}
                      {notification.type === 'transaction' && <FiCreditCard />}
                    </div>
                    <div className="flex-grow-1">
                      <h6>{notification.title}</h6>
                      <p className="mb-0 small">{notification.message}</p>
                      <small className="text-muted">{notification.time}</small>
                    </div>
                    {notification.unread && <span className="unread-dot bg-primary"></span>}
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Alert variant="info" className="mt-3 d-flex align-items-center">
        <FiAlertCircle className="me-2 flex-shrink-0" size={20} />
        <div>
          <strong>Market Update:</strong> RBI has revised forex card limits for international travel.
          <a href="https://www.rbi.org.in/Home.aspx" className="alert-link ms-1" target="_blank" rel="noopener noreferrer">View details</a>
        </div>
      </Alert>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        <div className="info-section">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center gap-2"><FiCreditCard /> Card Details</Card.Title>
              <div className="info-item">
                <span>Status:</span>
                <Badge bg={cardStatus === 'Active' ? 'success' : 'danger'}>{cardStatus}</Badge>
              </div>
              <div className="info-item">
                <span>Bank:</span>
                <span>Meta ForexCard</span>
              </div>
              <div className="info-item">
                <span>Balance:</span>
                <span>
                  {balance !== undefined
                    ? Number(balance).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
                    : '₹0.00'}
                </span>
              </div>
              <div className="info-item">
                <span>Card Limit:</span>
                <span>
                  {maxLimit !== undefined
                    ? Number(maxLimit).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
                    : '₹0.00'}
                </span>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mt-3">
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <div className="actions-grid">
                <Button
                  variant={showCardDetails ? 'outline-secondary' : 'outline-warning'}
                  className="action-btn"
                  onClick={toggleCardDetails}
                >
                  {showCardDetails ? <><FiEyeOff className="me-2" /> Hide Details</> : <><FiEye className="me-2" /> Show Details</>}
                </Button>
                <Button
                  variant="outline-danger"
                  className="action-btn"
                  onClick={() => setShowBlockModal(true)}
                  disabled={cardStatus === 'Blocked'}
                >
                  <FiLock className="me-2" /> Block Card
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="card-section">
          <div ref={cardRef} className={`card-container ${isFlipped ? 'flipped' : ''}`} onClick={handleCardFlip}>
            <div className="forex-card front">
              <div className="card-chip"></div>
              <div className="hologram"></div>
              <div className="card-number">{formatCardNumber(showCardDetails)}</div>
              <div className="card-details1">
                <div className="card-name">{userName}</div>
                <div className="card-expiry">{formatExpiryDate(showCardDetails)}</div>
              </div>
              <div className="card-bank">META FOREXCARD</div>
              <div className="card-type">VISA PLATINUM</div>
            </div>
            <div className="forex-card back">
              <div className="magnetic-strip"></div>
              <div className="signature-strip">
                <div className="cvv-box">{formatCVV(showCardDetails)}</div>
              </div>
              <div className="contact-info">
                <p className="card-terms">Customer Service: +1 (800) 123-4567</p>
                <p className="card-terms">This card is property of Sundaram Forex Bank. If found, please return to nearest branch.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Transaction Limits */}
      <Modal show={showLimitModal} onHide={() => setShowLimitModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Set Transaction Limits</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveLimits}>
            <Form.Group className="mb-3">
              <Form.Label>Daily Limit (USD)</Form.Label>
              <Form.Control
                type="number"
                name="dailyLimit"
                placeholder="e.g. 1000"
                defaultValue={limits.daily}
                min="100"
                max="10000"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                name="internationalTransactions"
                label="Enable international usage"
                defaultChecked={limits.international}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contactless Payment Limit</Form.Label>
              <Form.Control
                type="number"
                name="contactlessLimit"
                placeholder="e.g. 50"
                defaultValue={limits.contactless}
                min="10"
                max="200"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="light" onClick={() => setShowLimitModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Save Changes</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Block Card Confirmation Modal */}
      <Modal show={showBlockModal} onHide={() => setShowBlockModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Block Card Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <FiAlertCircle className="me-2" />
            Are you sure you want to block your card? This action will prevent all transactions until you unblock it.
          </Alert>
          <p className="mb-0">You can unblock your card later from the card settings.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleBlockCard}
            disabled={blockingCard}
          >
            {blockingCard ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Blocking...
              </>
            ) : (
              'Confirm Block'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ForexDashboard;
