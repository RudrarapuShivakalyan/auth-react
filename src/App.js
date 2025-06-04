import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import VerifyEmail from './VerifyEmail';

function App() {
  const [user, setUser] = useState(null);

  const handleAuth = (data) => {
    // Store the token in localStorage
    localStorage.setItem('token', data.token);
    // Store user data in state
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route
            path="/"
            element={
              user ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <AuthForm onAuth={handleAuth} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
