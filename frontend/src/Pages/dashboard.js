import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const { state } = useLocation();
  const successMessage = state?.successMessage || "";

  // Show success message if passed from OTP verification
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { autoClose: 3000 });
    }
  }, [successMessage]);

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1>Welcome to the Dashboard!</h1>
      <p>Here, you can manage your account and view all the important information.</p>
    </div>
  );
}

export default Dashboard;
