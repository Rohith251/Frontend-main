import React, { useEffect, useState } from 'react';
import instance from '../axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedCurrencyOnClick, setSelectedCurrencyOnClick] = useState('');
  const [amountInForeign, setAmountInForeign] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [popularCurrencies, setPopularCurrencies] = useState([]);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    instance.get('/currency/all')
      .then(res => {
        setCurrencies(res.data);
        const popular = res.data.filter(c => ['USD', 'EUR', 'GBP', 'JPY', 'AUD'].includes(c.code));
        setPopularCurrencies(popular);
      })
      .catch(err => {
        console.error("Error fetching currencies:", err);
        setErrorMsg("Failed to load currencies.");
      });
  }, []);

  const handleConvert = () => {
    const currencyToUse = selectedCurrency || selectedCurrencyOnClick;
    setShowResult(false); 
    setIsConverting(true);

    if (!currencyToUse || !amountInForeign || isNaN(amountInForeign)) {
      setErrorMsg("⚠️ Please select a currency and enter a valid amount.");
      setConvertedAmount(null);
      setIsConverting(false);
      return;
    }

    setTimeout(() => {
    const selected = currencies.find(c => c.code === currencyToUse);
    if (selected) {
      const result = (parseFloat(amountInForeign) * selected.exchangeRate).toFixed(2);
      setConvertedAmount(result);
      setErrorMsg('');
        setShowResult(true);
        setSelectedCurrencyOnClick(currencyToUse);
      }
      setIsConverting(false);
    }, 1000);
  };

  const handleQuickSelect = (currency) => {
    setSelectedCurrency(currency.code);
    setSelectedCurrencyOnClick(currency.code);
  };

  const getCurrencyInfo = (code) => {
    return currencies.find(c => c.code === code);
  };

  return (
    <div className="converter-section">
      <div className="container">
        <div className="row align-items-stretch">
          {/* Left Side - Converter */}
          <div className="col-md-6">
            <div className="converter-card h-100">
              <div className="text-center mb-2">
                <div className="converter-icon">
                  <i className="bi bi-currency-exchange"></i>
                </div>
                <h3>Currency Converter</h3>
              </div>

              {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

              <div className="popular-currencies mb-2">
                <h5>Popular Currencies</h5>
                <div className="currency-buttons">
                  {popularCurrencies.map((currency) => (
                    <button
                      key={currency.code}
                      className={`currency-btn ${selectedCurrency === currency.code ? 'active' : ''}`}
                      onClick={() => handleQuickSelect(currency)}
                    >
                      {currency.code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="converter-form">
                <div className="row mb-2">
                  <div className="col-12">
                    <label className="form-label">From Currency</label>
            <div className="input-group">
              <span className="input-group-text">
                        <i className="bi bi-globe"></i>
              </span>
              <select
                className="form-select"
                value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                <option value="">Select Currency</option>
                {currencies.filter(c => c.code !== 'INR').map((currency, idx) => (
                  <option key={idx} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

                <div className="row mb-2">
                  <div className="col-12">
                    <label className="form-label">Amount</label>
            <div className="input-group">
              <span className="input-group-text">
                        <i className="bi bi-cash"></i>
              </span>
              <input
                type="number"
                className="form-control"
                value={amountInForeign}
                        onChange={(e) => setAmountInForeign(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
                </div>

                <div className="row mb-2">
                  <div className="col-12">
                    <button 
                      className={`btn btn-convert w-100 ${isConverting ? 'converting' : ''}`} 
                      onClick={handleConvert}
                      disabled={isConverting}
                    >
                      {isConverting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Converting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-arrow-repeat me-1"></i>Convert to INR
                        </>
                      )}
            </button>
                  </div>
          </div>
        </div>

        {showResult && convertedAmount && (
                <div className="conversion-result">
                  <h4>Result</h4>
                  <div className="amount">
                    {amountInForeign} {selectedCurrencyOnClick} = ₹{convertedAmount} INR
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Information */}
          <div className="col-md-6">
            <div className="info-section h-100">
              <div className="info-content">
                <h3>Real-time Currency Conversion</h3>
                <p>Get instant currency conversion rates and convert any foreign currency to Indian Rupees (INR).</p>
                
                {selectedCurrency && (
                  <div className="info-note">
                    <h4>Currency Information</h4>
                    <div className="info-card">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Currency Code:</span>
                          <span className="value">{getCurrencyInfo(selectedCurrency)?.code}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Exchange Rate:</span>
                          <span className="value">1 {getCurrencyInfo(selectedCurrency)?.code} = ₹{getCurrencyInfo(selectedCurrency)?.exchangeRate}</span>
                        </div>
                      </div>
                    </div>
          </div>
        )}

                <div className="info-note">
                  <h4>Key Features</h4>
                  <ul className="feature-list">
                    <li>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Real-time exchange rates
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Multiple currency support
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Quick conversion
                    </li>
                  </ul>
                </div>

                <div className="rate-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <span>Exchange rates are updated in real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
