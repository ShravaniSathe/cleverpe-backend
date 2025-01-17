import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginOtpPage from "./Pages/LoginOtpPage";
import OtpVerificationPage from "./Pages/OtpVerificationPage";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginOtpPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
