import React, { useState, useEffect } from 'react';
import instance from '../../axios';
import './MakePayment.css'; // Make sure to include the CSS below

function TransactionComponent() {
  const [card, setCard] = useState(null);
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedINR, setConvertedINR] = useState('');
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [lastMerchant, setLastMerchant] = useState('');
  


  const userId = localStorage.getItem('id');

  const currencySymbols = {
    INR: '₹', USD: '$', EUR: '€', JPY: '¥', GBP: '£', AUD: 'A$',
    CAD: 'C$', CHF: 'CHF', SGD: 'S$', CNY: '¥', ZAR: 'R',
    NZD: 'NZ$', KRW: '₩', THB: '฿', AED: 'د.إ', HKD: 'HK$',
    SEK: 'kr', NOK: 'kr', DKK: 'kr', MYR: 'RM', IDR: 'Rp', PHP: '₱'
  };

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await instance.get(`/card/${userId}`);
        setCard(response.data);
      } catch (error) {
        setMessage('Error fetching card info');
      }
    };
    if (userId) fetchCard();
  }, [userId]);

  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const convertToINR = async (amountInput, selectedCode) => {
    if (!amountInput || parseFloat(amountInput) <= 0) {
      setConvertedINR('');
      setConvenienceFee(0);
      setTotalAmount(0);
      return;
    }

    try {
      const response = await instance.get(`/currency/${selectedCode}`);
      const rateToINR = response.data;
      const inrAmount = parseFloat(amountInput) * rateToINR;
      setConvertedINR(inrAmount.toFixed(4));

      const fee = (inrAmount * 0.02).toFixed(2);
      setConvenienceFee(fee);
      setTotalAmount((inrAmount + parseFloat(fee)).toFixed(2));
    } catch (error) {
      console.error('Failed to convert:', error);
      setConvertedINR('');
      setConvenienceFee(0);
      setTotalAmount(0);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,4}$/.test(value) || value === '') {
      setAmount(value);
      convertToINR(value, currencyCode);
    }
  };

  const handleCurrencyChange = (e) => {
    const newCode = e.target.value;
    setCurrencyCode(newCode);
    setCurrencySymbol(currencySymbols[newCode] || '$');
    convertToINR(amount, newCode);
  };

  const handlePayment = async () => {
    if (!card) return setMessage("Card not loaded yet");
    if (!pin || !amount || !merchant || !currencyCode) {
      return setMessage("Please fill all fields");
    }
    if (parseFloat(amount) <= 0) {
      return setMessage("Amount must be greater than 0");
    }

    setIsProcessing(true);
    setMessage('');
    try {
      // Simulate processing steps
      await new Promise(res => setTimeout(res, 1500));

      const response = await instance.post('/transaction/process', {
        forexCard: { id: card.id, pin },
        amount: parseFloat(amount),
        merchant,
        currency: { code: currencyCode }
      }, {
        params: { userId }
      });

      setLastMerchant(merchant);
      setShowSuccess(true);
      resetForm();

    } catch (error) {
      setShowFailure(true);
      setMessage(error.response?.data || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setMerchant('');
    setPin('');
    setConvertedINR('');
    setConvenienceFee(0);
  };

  const currencyOptions = [
    { code: 'USD', name: 'United States Dollar' }, { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound Sterling' }, { code: 'JPY', name: 'Japanese Yen' },
    { code: 'INR', name: 'Indian Rupee' }, { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' }, { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' }, { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'NZD', name: 'New Zealand Dollar' }, { code: 'ZAR', name: 'South African Rand' },
    { code: 'AED', name: 'United Arab Emirates Dirham' }, { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'HKD', name: 'Hong Kong Dollar' }, { code: 'SEK', name: 'Swedish Krona' },
    { code: 'NOK', name: 'Norwegian Krone' }, { code: 'DKK', name: 'Danish Krone' },
    { code: 'KRW', name: 'South Korean Won' }, { code: 'THB', name: 'Thai Baht' },
    { code: 'MXN', name: 'Mexican Peso' }, { code: 'BRL', name: 'Brazilian Real' },
    { code: 'RUB', name: 'Russian Ruble' }, { code: 'TRY', name: 'Turkish Lira' },
    { code: 'IDR', name: 'Indonesian Rupiah' }, { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'PHP', name: 'Philippine Peso' }, { code: 'PLN', name: 'Polish Zloty' },
    { code: 'TWD', name: 'New Taiwan Dollar' }, { code: 'VND', name: 'Vietnamese Dong' }
  ];

  return (
    <div className="transaction-container">
      {/* Processing Modal */}
      {isProcessing && (
        <div className="processing-modal">
          <div className="processing-content animate-pop">
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="processing-icon">
              <div className="spinner"></div>
            </div>
            <h3>Processing Payment</h3>
            <p>Please wait while we process your transaction...</p>
            <div className="processing-steps">
              <div className={`step ${progress > 20 ? 'completed' : ''}`}>
                <span>1</span>
                <p>Verifying details</p>
              </div>
              <div className={`step ${progress > 50 ? 'completed' : ''}`}>
                <span>2</span>
                <p>Processing payment</p>
              </div>
              <div className={`step ${progress > 80 ? 'completed' : ''}`}>
                <span>3</span>
                <p>Confirming transaction</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="result-modal">
          <div className="result-content animate-pop">
            <div className="success-animation">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h3>Payment Successful!</h3>
            <p>Your payment of INR {totalAmount} to {lastMerchant} has been processed.</p>
            <div className="transaction-details">
              <div className="detail">
                <span>Transaction ID:</span>
                <span>{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              </div>
              <div className="detail">
                <span>Date:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
            <button
              className="btn-continue"
              onClick={() => setShowSuccess(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Failure Modal */}
      {showFailure && (
        <div className="result-modal">
          <div className="result-content animate-pop">
            <div className="failure-animation">
              <svg className="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="crossmark__circle" cx="26" cy="26" r="25" fill="none" />
                <path className="crossmark__cross" fill="none" d="M16 16 36 36 M36 16 16 36" />
              </svg>
            </div>
            <h3>Payment Failed</h3>
            <p>{message || 'There was an issue processing your payment.'}</p>
            <div className="action-buttons">
              <button
                className="btn-retry"
                onClick={() => {
                  setShowFailure(false);
                  setIsProcessing(true);
                  handlePayment();
                }}
              >
                Try Again
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowFailure(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="card-container1">
        <div className="card-header">
          <h2>
            <i className="icon-credit-card"></i> Card Payment
          </h2>
        </div>

        <div className="card-body">
          {card ? (
            <>
              <div className="card-info">
                <div className="balance-info">
                  <span>Available Balance</span>
                  <h3>
                    {card.balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </h3>

                </div>
                <div className="card-number">
                  <span>Card Number</span>
                  <p>•••• •••• •••• {card.cardNumber.slice(-4)}</p>
                </div>
                <div className="card-chip1"></div>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <div className="amount-input">
                  <select
                    className="currency-select"
                    value={currencyCode}
                    onChange={handleCurrencyChange}
                  >
                    {currencyOptions.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    inputMode="decimal"
                  />
                  <span className="currency-symbol">{currencySymbol}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Merchant/Business Name</label>
                <input
                  type="text"
                  value={merchant}
                  onChange={e => setMerchant(e.target.value)}
                  placeholder="e.g. Amazon, Netflix"
                />
              </div>

              <div className="form-group">
                <label>Card PIN</label>
                <div className="pin-input">
                  <input
                    type="password"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="••••"
                    maxLength="4"
                  />
                </div>
              </div>

              {convertedINR && (
                <div className="conversion-details">
                  <div className="detail-row">
                    <span>Converted Amount</span>
                    <span>{Number(convertedINR).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                  </div>
                  <div className="detail-row">
                    <span>Convenience Fee (2%)</span>
                    <span>{Number(convenienceFee).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                  </div>
                  <div className="detail-row total">
                    <span>Total Amount</span>
                    <span>{Number(totalAmount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                    </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                className="pay-button"
                disabled={isProcessing || !amount || !merchant || !pin}
              >
                <i className="icon-lock"></i> Pay Now
              </button>

              {message && (
                <div className={`message ${message.includes('failed') ? 'error' : 'info'}`}>
                  <i className={`icon-${message.includes('failed') ? 'warning' : 'info'}`}></i>
                  {message}
                </div>
              )}
            </>
          ) : (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading card information...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionComponent;