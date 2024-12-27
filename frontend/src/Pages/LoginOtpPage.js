import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './LoginOtpPage.css'; // Import the updated CSS file

function LoginOtpPage() {
  const [email, setEmail] = useState(''); // State to hold the email value
  const navigate = useNavigate(); // Use the useNavigate hook for navigation

  // Handle the email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle the 'Get OTP' button click
  const handleGetOtpClick = () => {
    // You can add email validation here if needed
    if (email) {
      // Navigate to the OTP verification page
      navigate('/verify-otp');
    } else {
      // Handle case where email is not provided, if needed
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="page-container">
      <div className="background-rectangle">
        {/* Left Card Section */}
        <div className="left-card">
          <img src="/cleverpe_logo.jpg" alt="Logo" className="logo" />
          <h1>WELCOME</h1>
          <p>to the CleverPe Admin Dashboard !!</p>
        </div>

        {/* Right Content Section */}
        <div className="right-content">
          <h1>Login</h1>
          <p>Enter your email address to get OTP</p>
          <input
            type="email"
            placeholder="Email Address"
            className="email-input"
            value={email}
            onChange={handleEmailChange} // Update email state on change
          />
          <button className="send-otp-button" onClick={handleGetOtpClick}>
            Get OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginOtpPage;
