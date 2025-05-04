import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './PendingPage.css';

const PendingPage = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/userdashboard", { replace: true });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="bg-white p-5 rounded shadow text-center"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div
          className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
          style={{ width: "80px", height: "80px", fontSize: "30px", color: "#6c757d" }}
        >
          🕒
        </div>

        <div className="badge bg-light text-dark px-4 py-2 mb-3 border border-secondary">
          • Application Status: Pending Approval
        </div>

        <h4 className="fw-semibold mb-3">Thank you for applying!</h4>

        <p className="text-muted">
          Your Forex card application has been submitted successfully and is currently under review by our team.
        </p>
        <p className="text-muted small">
          You will receive a confirmation email once your application is approved. Please allow up to 24–48 hours for verification.
        </p>

        <div className="progress my-4" style={{ height: "6px" }}>
          <div
            className="progress-bar bg-secondary"
            role="progressbar"
            style={{ width: "60%" }}
            aria-valuenow="60"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        <button className="btn btn-primary px-4" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>

        <p className="text-muted small mt-5 mb-0">
          © 2025 ForexCard. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PendingPage;
