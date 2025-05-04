import { useState, useEffect } from "react";
import axios from "../../axios"; // Your axios instance
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Importing useNavigate
import instance from "../../axios";

const ActivateCard = () => {
  const [form, setForm] = useState({
    forexCardNumber: "",
    securityPin: "",
    confirmPin: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const storedId = localStorage.getItem("id");
  const userId = storedId ? parseInt(storedId, 10) : null;

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  useEffect(() => {
    if (!userId) {
      setError("User not logged in!");
      return;
    }

    const fetchCardNumber = async () => {
      try {
        const response = await axios.get(`/user/${userId}`);
        const cardNumber = response.data.cardNumber;
        console.log(cardNumber);
        if (cardNumber) {
          const formattedCardNumber = formatCardNumber(cardNumber);
          setForm((prev) => ({ ...prev, forexCardNumber: formattedCardNumber }));
        } else {
          setError("No Forex card found for this user!");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch card number.");
      }
    };

    fetchCardNumber();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "forexCardNumber") {
      formattedValue = formatCardNumber(value).slice(0, 19);
    } else if (name === "securityPin" || name === "confirmPin") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4); // Only digits, 4 max
    } else if (name === "otp") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4); // Only digits, 4 max
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
    setError("");
  };

  const handleSendOtp = async () => {
    if (!userId) {
      setError("User not logged in!");
      return;
    }

    try {
      await instance.post(`/card/sendOtp?userId=${userId}`);
      toast.success("OTP sent to your email!");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { securityPin, confirmPin, otp } = form;

    if (securityPin.length !== 4 || confirmPin.length !== 4) {
      setError("Security PIN must be exactly 4 digits!");
      return;
    }

    if (securityPin !== confirmPin) {
      setError("Security PINs do not match!");
      return;
    }

    try {
      const response = await axios.post(`/card/verifyOtpAndActivate?userId=${userId}&otp=${otp}&pin=${securityPin}`);
      toast.success(response.data || "Card activated successfully! You can now use your card for transactions.");
      setTimeout(() => {
        navigate("/userdashboard");
      }, 2000); // Navigate after showing the toast
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Activation failed! Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="form-container bg-white p-5 rounded shadow" style={{ maxHeight: "600px", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          <h2 className="form-title text-center mb-4">
            <i className="bi bi-credit-card-fill"></i> Activate Forex Card
          </h2>

          <div className="mb-3">
            <label className="form-label">Forex Card Number</label>
            <input
              type="text"
              name="forexCardNumber"
              className="form-control"
              placeholder="4444 5555 6666 7777"
              value={form.forexCardNumber}
              onChange={handleChange}
              required
              inputMode="numeric"
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Security PIN</label>
            <input
              type="password"
              name="securityPin"
              className="form-control"
              placeholder="Enter 4-digit PIN"
              value={form.securityPin}
              onChange={handleChange}
              required
              inputMode="numeric"
              pattern="\d{4}"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Security PIN</label>
            <input
              type="password"
              name="confirmPin"
              className="form-control"
              placeholder="Re-enter 4-digit PIN"
              value={form.confirmPin}
              onChange={handleChange}
              required
              inputMode="numeric"
              pattern="\d{4}"
            />
          </div>

          <div className="mb-3 d-flex">
            <div className="flex-grow-1 me-2">
              <label className="form-label">OTP</label>
              <input
                type="text"
                name="otp"
                className="form-control"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                required
                inputMode="numeric"
                pattern="\d{4}"
              />
            </div>
            <button type="button" className="btn btn-secondary align-self-end" onClick={handleSendOtp}>
              <i className="bi bi-envelope-fill"></i> Get OTP
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-check-circle-fill"></i> Activate Card
            </button>
          </div>
        </form>

        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default ActivateCard;
