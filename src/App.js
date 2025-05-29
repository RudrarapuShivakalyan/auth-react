import React, { useState } from 'react';
import './App.css';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthForm onAuth={handleAuth} />
      )}
    </div>
  );
}

export default App;
