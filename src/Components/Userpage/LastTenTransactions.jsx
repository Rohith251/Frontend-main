import React, { useEffect, useState } from 'react';
import instance from '../../axios';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const LastTenTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('id');

  useEffect(() => {
    if (!userId) {
      toast.error('User ID not found. Please log in.');
      setLoading(false);
      return;
    }
    

    const fetchTransactions = async () => {
      try {
        const response = await instance.get(`/transaction/${userId}`);
        const data = response.data;

        if (!Array.isArray(data)) {
          toast.error('Unexpected response format from server.');
        } else {
          if (data.length === 0) toast.info('No transactions found.');
          setTransactions(data.slice(-10).reverse());
        }
      } catch (err) {
        toast.error('Failed to fetch transactions.');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const filteredData =
    filter === 'All'
      ? transactions
      : transactions.filter(txn => txn.status.toLowerCase() === filter.toLowerCase());

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="spinner-border text-primary me-2" />
        <span className="fs-5 text-muted">Loading transactions...</span>
      </div>
    );
  }

  return (
    <>
      {/* Filter Buttons */}
      <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
        {['All', 'SUCCESS', 'FAILED'].map(status => (
          <button
            key={status}
            className={`btn px-4 py-2 fw-semibold rounded-pill shadow-sm ${
              filter === status ? 'btn-primary text-white' : 'btn-outline-primary'
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredData.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center align-middle shadow-sm">
            <thead className="table-dark text-white">
              <tr>
                <th>Date</th>
                <th>Card Number</th>
                <th>Merchant</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Debit</th>
                <th>Status</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((txn) => (
                <tr key={txn.id}>
                  <td className="text-muted">{formatDate(txn.date)}</td> {/* <-- showing raw backend date */}
                  <td className="fw-semibold">{txn.cardNumber}</td>
                  <td className="fw-semibold">{txn.merchant}</td>
                  <td className="fw-bold text-success">{txn.amount.toFixed(2)}</td>
                  <td className="fw-semibold">{txn.currencyName}</td>
                  <td className="fw-semibold">{txn.deductAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-2 fs-6 ${
                      txn.status === 'SUCCESS'
                        ? 'bg-success'
                        : txn.status === 'FAILED'
                        ? 'bg-danger'
                        : 'bg-warning text-dark'
                    }`}>{txn.status}</span>
                  </td>
                  <td className="fw-semibold text-primary">
                    {formatCurrency(txn.currentBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-light border border-danger text-center shadow-sm mt-4 py-4">
          <h5 className="text-danger">
            No transactions found for <strong>{filter}</strong>.
          </h5>
        </div>
      )}
    </>
  );
};

export default LastTenTransactions;
