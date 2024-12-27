// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginOtpPage from './Pages/LoginOtpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginOtpPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;

