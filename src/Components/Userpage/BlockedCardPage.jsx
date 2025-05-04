import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './BlockedCardPage.css';

const BlockedCardPage = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/userdashboard", { replace: true });
  };

  const handleActivateCard = () => {
    navigate("/userdashboard/activate", { replace: true });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="bg-white p-5 rounded shadow text-center"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div
          className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
          style={{ width: "80px", height: "80px", fontSize: "30px", color: "#dc3545" }}
        >
          <i className="bi bi-x-circle-fill"></i>
        </div>

        <div className="badge bg-light text-dark px-4 py-2 mb-3 border border-secondary">
          • Card Status: Blocked
        </div>

        <h4 className="fw-semibold mb-3">Your Forex Card is Blocked</h4>

        <p className="text-muted">
          Unfortunately, your Forex card has been blocked due to security concerns or a request made by you. Please take necessary action to unblock it.
        </p>
        <p className="text-muted small">
          If you need to reactivate your card, please click the "Activate Card" button below and follow the steps.
        </p>

        <button className="btn btn-primary px-4 my-3" onClick={handleActivateCard}>
          Activate Card
        </button>

        <button className="btn btn-secondary px-4" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>

        <p className="text-muted small mt-5 mb-0">
          © 2025 ForexCard. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default BlockedCardPage;
