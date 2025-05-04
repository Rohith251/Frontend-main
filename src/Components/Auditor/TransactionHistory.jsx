import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import instance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [name, setName] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const handleSearch = async () => {
    if (name.trim() !== "") {
      try {
        const response = await instance.get(`/auditor/finduserbyname`, {
          params: { name },
        });
        setFilteredTransactions(response.data || []);
      } catch (error) {
        console.error("Error fetching transactions by user name:", error);
        setFilteredTransactions([]);
      }
    }
  };

  const handleFetchAll = async () => {
    try {
      const response = await instance.get(`/auditor/alltransaction`);
      setTransactions(response.data || []);
      setFilteredTransactions([]);
      setName("");
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      setTransactions([]);
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getValueByPath = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const getSortedTransactions = () => {
    const data = filteredTransactions.length > 0 ? filteredTransactions : transactions;
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = getValueByPath(a, sortConfig.key);
      const bVal = getValueByPath(b, sortConfig.key);

      if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  };

  const sortedTransactions = getSortedTransactions();

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-muted" />;
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="text-primary" />
    ) : (
      <FaSortDown className="text-primary" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCardNumber = (cardNumber) => {
    return cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : "-";
  };

  const currencyNameToCode = {
    "United States Dollar": "USD",
    Euro: "EUR",
    "British Pound Sterling": "GBP",
    "Japanese Yen": "JPY",
    "Indian Rupee": "INR",
    "Australian Dollar": "AUD",
    "Canadian Dollar": "CAD",
    "Swiss Franc": "CHF",
    "Chinese Yuan": "CNY",
    "Singapore Dollar": "SGD",
    "New Zealand Dollar": "NZD",
    "South African Rand": "ZAR",
    "United Arab Emirates Dirham": "AED",
    "Saudi Riyal": "SAR",
    "Hong Kong Dollar": "HKD",
    "Swedish Krona": "SEK",
    "Norwegian Krone": "NOK",
    "Danish Krone": "DKK",
    "South Korean Won": "KRW",
    "Thai Baht": "THB",
    "Mexican Peso": "MXN",
    "Brazilian Real": "BRL",
    "Russian Ruble": "RUB",
    "Turkish Lira": "TRY",
    "Indonesian Rupiah": "IDR",
    "Malaysian Ringgit": "MYR",
    "Philippine Peso": "PHP",
    "Polish Zloty": "PLN",
    "New Taiwan Dollar": "TWD",
    "Vietnamese Dong": "VND",
  };

  const formatAmount = (amount, currencyName) => {
    const currencyCode = currencyNameToCode[currencyName] || "USD";
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleBlockCard = async (cardNumber) => {
    try {
      await instance.post(`/auditor/blockcard`, { cardNumber });
      toast.success('Card blocked successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Failed to block card. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error blocking card:", error);
    }
  };

  const handleSendPDF = async (transactionId) => {
    try {
      await instance.post(`/auditor/sendpdf`, { transactionId });
      toast.success('PDF sent successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Failed to send PDF. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error("Error sending PDF:", error);
    }
  };

  return (
    <div className="container-fluid pt-5 px-4">
      <ToastContainer />
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="fw-bold mb-0">Transaction History</h3>
            <div className="d-flex" style={{ width: "500px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by user name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="btn btn-light ms-2" onClick={handleSearch}>
                <FaSearch className="me-1" /> Search
              </button>
              <button className="btn btn-outline-light ms-2" onClick={handleFetchAll}>
                Fetch All
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {name && filteredTransactions.length > 0 && (
            <div className="alert alert-info mb-4">
              Showing results for: <strong>{name}</strong> •{" "}
              <span className="badge bg-primary rounded-pill">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="table-responsive rounded">
            <table className="table table-hover table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th onClick={() => requestSort("date")} className="cursor-pointer">
                    <div className="d-flex align-items-center justify-content-between">
                      Date & Time {getSortIcon("date")}
                    </div>
                  </th>
                  <th onClick={() => requestSort("forexCard.cardNumber")} className="cursor-pointer">
                    <div className="d-flex align-items-center justify-content-between">
                      Name {getSortIcon("forexCard.cardNumber")}
                    </div>
                  </th>
                  <th onClick={() => requestSort("forexCard.cardNumber")} className="cursor-pointer">
                    <div className="d-flex align-items-center justify-content-between">
                      Card Number {getSortIcon("forexCard.cardNumber")}
                    </div>
                  </th>
                  <th onClick={() => requestSort("merchant")} className="cursor-pointer">
                    <div className="d-flex align-items-center justify-content-between">
                      Merchant {getSortIcon("merchant")}
                    </div>
                  </th>
                  <th onClick={() => requestSort("currency.currencyName")} className="cursor-pointer">
                    <div className="d-flex align-items-center justify-content-between">
                      Currency {getSortIcon("currency.currencyName")}
                    </div>
                  </th>
                  <th onClick={() => requestSort("amount")} className="cursor-pointer text-end">
                    <div className="d-flex align-items-center justify-content-between">
                      Amount {getSortIcon("amount")}
                    </div>
                  </th>
                  <th onClick={() => requestSort("status")} className="cursor-pointer">
                    <div className="d-flex align-items-center justify-content-between">
                      Status {getSortIcon("status")}
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map((transaction, index) => (
                    <tr key={index} className={index % 2 === 0 ? "table-row-even" : "table-row-odd"}>
                      <td>{formatDate(transaction.date)}</td>
                      <td>{transaction.name}</td>
                      <td>{formatCardNumber(transaction.cardNumber)}</td>
                      <td>
                        <span className="badge bg-light text-dark border">{transaction.merchant}</span>
                      </td>
                      <td>{transaction.currencyName || "-"}</td>
                      <td className="text-end fw-bold">
                        {formatAmount(transaction.amount, transaction.currency?.currencyName)}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 fs-6 ${
                            transaction.status === "SUCCESS"
                              ? "bg-success"
                              : transaction.status === "FAILED"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleBlockCard(transaction.cardNumber)}
                            title="Block Card"
                          >
                            <i className="bi bi-shield-lock"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSendPDF(transaction.id)}
                            title="Send PDF"
                          >
                            <i className="bi bi-file-pdf"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="d-flex flex-column align-items-center">
                        <img src="/empty-state.svg" alt="No transactions" style={{ width: "120px", opacity: 0.7 }} />
                        <p className="mt-3 text-muted fw-semibold">
                          {name ? "No transactions found for this user" : "No transactions available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .table-row-even {
          background-color: rgba(248, 249, 250, 0.5);
        }
        .table-row-odd {
          background-color: white;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default TransactionHistory;
