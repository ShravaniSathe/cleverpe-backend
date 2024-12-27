import React from 'react';
import './LoginOtpPage.css'; // Import the updated CSS file

function LoginOtpPage() {
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
          <input type="email" placeholder="Email Address" className="email-input" />
          <button className="send-otp-button">Get OTP</button>
        </div>
      </div>
    </div>
  );
}

export default LoginOtpPage;
