import React from 'react';
import AuthForm from './AuthForm'; // Ensure the path is correct

function App() {
  const handleAuth = (formData) => {
    console.log('Auth Data:', formData);
    alert(`Welcome, ${formData.username} as ${formData.role}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <AuthForm onAuth={handleAuth} />
    </div>
  );
}

export default App;
