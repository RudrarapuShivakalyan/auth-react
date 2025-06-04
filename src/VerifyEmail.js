import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function VerifyEmail() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`https://backend-603t.onrender.com/api/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setSuccess('Email verified successfully! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setError(error.message || 'Error verifying email');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {!error && !success && (
          <div className="text-center">
            <p>Verifying your email...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail; 