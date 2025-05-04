import React, { useState } from 'react';
import LastTenTransactions from '../Userpage/LastTenTransactions';
import TransactionsByDate from '../Userpage/TransactionsByDate';
import './Transactions.css'; // Ensure this is in place for custom styles

const Transactions = () => {
  const [activeView, setActiveView] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleViewChange = (view) => {
    setLoading(true); // Start loading
    setTimeout(() => {
      setActiveView(view); // Set the active view after the delay
      setLoading(false); // Stop loading after the view change
    }, 1000); // Simulate a loading delay of 1 second
  };

  return (
    <div className="container py-5">
      {/* Heading & Buttons Section */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Transaction History</h2>
        <p className="text-muted fs-5">Choose how you want to view your transactions</p>
        
        {/* Side-by-side buttons directly under text */}
        <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <button
            className={`btn px-4 py-2 rounded-pill fw-semibold shadow-sm ${
              activeView === 'last10' ? 'btn-primary text-white' : 'btn-outline-primary'
            }`}
            onClick={() => handleViewChange('last10')}
          >
            Last 10 Transactions
          </button>
          <button
            className={`btn px-4 py-2 rounded-pill fw-semibold shadow-sm ${
              activeView === 'dateRange' ? 'btn-primary text-white' : 'btn-outline-primary'
            }`}
            onClick={() => handleViewChange('dateRange')}
          >
            Date Range Transactions
          </button>
        </div>
      </div>

      {/* Spinner or Loading State */}
      {loading && (
        <div className="text-center mb-4">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: '1.5rem', height: '1.5rem' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Conditional Content Card */}
      {activeView && !loading && (
        <div className="card p-4 shadow-sm border-0 rounded-4 transaction-fade">
          {activeView === 'last10' ? <LastTenTransactions /> : <TransactionsByDate />}
        </div>
      )}
    </div>
  );
};

export default Transactions;

