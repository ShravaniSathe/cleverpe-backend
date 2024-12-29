import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OtpVerificationPage.css";

function OtpVerificationPage() {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email || "";
  const successMessage = state?.successMessage || "";

  // Display success message if passed from the previous page
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { autoClose: 3000 });
    }
  }, [successMessage]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (!isNaN(value) && value.length === 1) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerifyClick = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: enteredOtp,
      });
      if (response.data.success) {
        // Navigate to the Dashboard after OTP verification
        navigate("/Dashboard", {
          state: { successMessage: "OTP verified successfully! Welcome to Dashboard!" },
        });
      } else {
        toast.error(response.data.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP. Please try again.");
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
          <p>
            OTP has been sent to your email address, please enter the OTP below
            to verify your account !!
          </p>
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="otp-box"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button
            className="verify-button"
            onClick={handleVerifyClick}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtpVerificationPage;
