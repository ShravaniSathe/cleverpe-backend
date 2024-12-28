import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginOtpPage.css";

function LoginOtpPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleGetOtpClick = async () => {
    if (email) {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/api/auth/send-otp", {
          email,
        });
        if (response.data.success) {
          alert("OTP sent to your email.");
          navigate("/verify-otp", { state: { email } });
        } else {
          alert(response.data.message || "Failed to send OTP.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Error sending OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="page-container">
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
