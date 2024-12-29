import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginOtpPage.css";

function LoginOtpPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    // Regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleGetOtpClick = async () => {
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.", { position: "bottom-center", autoClose: 3000 });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/send-otp", {
        email,
      });

      if (response.data.message === "OTP sent successfully") {
        navigate("/verify-otp", { state: { email, successMessage: "OTP sent to your email." } });
      } else {
        toast.error(response.data.message || "Failed to send OTP.", { position: "bottom-center", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.", { position: "bottom-center", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* ToastContainer with bottom-center position */}
      <ToastContainer position="bottom-center" autoClose={3000} />
      <div className="background-rectangle">
        <div className="left-card">
          <img src="/cleverpe_logo.jpg" alt="Logo" className="logo" />
          <h1>WELCOME</h1>
          <p>to the CleverPe Admin Dashboard !!</p>
        </div>
        <div className="right-content">
          <h1>Login</h1>
          <p>Enter your email address to get OTP</p>
          <input
            type="email"
            placeholder="Email Address"
            className="email-input"
            value={email}
            onChange={handleEmailChange}
          />
          <button
            className="send-otp-button"
            onClick={handleGetOtpClick}
            disabled={loading}
          >
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginOtpPage;
