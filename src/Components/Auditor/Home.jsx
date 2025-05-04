import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import TransactionHistory from "./TransactionHistory";
import AuditorInitial from "./AuditorInitial";
import Marquee from "react-fast-marquee";

const AuditorHomePage = () => {
  const [activeComponent, setActiveComponent] = useState("AuditorInitial");

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    // Optional: redirect to login page
    window.location.href = "/"; // adjust path as needed
  };
  

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-lg px-4 fixed-top" style={{ backgroundColor: "royalblue" }}>
        <div className="container-fluid">
          <span className="navbar-brand fw-bold text-white" style={{ fontFamily: "sans-serif", fontSize: "35px", padding: "15px" }}>
            Meta ForexCard
          </span>
          <div style={{ display: "flex" }}>
            <button className="btn btn-primary mx-2" onClick={() => setActiveComponent("TransactionHistory")}>
              TransactionLogs
            </button>
            <button className="btn btn-primary mx-2" onClick={() => setActiveComponent("AuditorInitial")}>
              Home
            </button>
            <button className="btn btn-danger mx-2" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Add padding-top to account for fixed navbar */}
      <div style={{ paddingTop: "80px" }}>
        <main className="flex-grow-1 p-3 d-flex align-items-stretch">
          {activeComponent === "AuditorInitial" ? <AuditorInitial /> : <TransactionHistory />}
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white py-4 mt-auto">
          <div className="container">
            <div className="row text-center text-md-start">
              <div className="col-md-4 mb-3">
                <h5>About ForexCard</h5>
                <p>ForexCard is a modern platform to manage international card transactions smoothly and securely.</p>
              </div>
              <div className="col-md-4 mb-3">
                <h5>Quick Links</h5>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-white text-decoration-none">Home</a></li>
                  <li><a href="#" className="text-white text-decoration-none">Support</a></li>
                </ul>
              </div>
              <div className="col-md-4 mb-3">
                <h5>Contact Us</h5>
                <p>
                  Sundaram Finance Limited, Regd. Office: 21, Patullos Road, Chennai - 600002.
                  Deposits Toll-Free no: 1800 572 1840
                </p>
                <div>
                  <a href="#" className="text-white me-2"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="text-white me-2"><i className="bi bi-twitter"></i></a>
                  <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AuditorHomePage;