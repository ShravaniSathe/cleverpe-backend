import React, { useRef, useState } from "react";
import "./OtpVerificationPage.css"; // Ensure your CSS file is updated accordingly

function OtpVerificationPage() {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (!isNaN(value) && value.length === 1) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Move to the next input if value is entered
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    const updatedOtp = [...otp];
    if (e.key === "Backspace") {
      if (otp[index]) {
        // If the current box has a value, clear it
        updatedOtp[index] = "";
      } else if (index > 0) {
        // If the current box is empty, move back and clear the previous box
        inputRefs.current[index - 1].focus();
        updatedOtp[index - 1] = "";
      }
      setOtp(updatedOtp);
    }
  };

  const handleFocus = (index) => {
    if (!otp[index]) {
      inputRefs.current[index].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const updatedOtp = Array(6).fill("");

    pasteData.forEach((char, idx) => {
      if (!isNaN(char) && idx < 6) {
        updatedOtp[idx] = char;
      }
    });

    setOtp(updatedOtp);

    // Set focus to the next empty input
    const firstEmptyIndex = updatedOtp.findIndex((value) => value === "");
    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex].focus();
    } else {
      inputRefs.current[5].focus(); // Focus on the last box if all are filled
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
          <p>OTP has been sent to your email address, please enter the OTP below to verify your account !!</p>
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="otp-box"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => handleFocus(index)}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button className="verify-button">Verify</button>
          <p>
            Didn't receive the OTP? <span className="resend-link">Resend OTP</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OtpVerificationPage;
