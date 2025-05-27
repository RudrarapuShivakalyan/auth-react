import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaUserTag } from 'react-icons/fa';

const roles = ['Buyer', 'Tenant', 'Owner', 'User', 'Admin', 'Content Creator'];

function AuthForm({ onAuth }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: roles[0],
  });
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isForgotPassword) {
      alert(`Password reset link sent to ${resetEmail}`);
      setIsForgotPassword(false);
      setResetEmail('');
    } else {
      if (typeof onAuth === 'function') {
        onAuth(formData);
      } else {
        console.error('onAuth is not a function');
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">
        {isForgotPassword ? 'Reset Password' : isRegistering ? 'Register' : 'Login'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isForgotPassword ? (
          <>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="resetEmail"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Send Reset Link
            </button>
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="text-sm text-gray-600 underline"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>

            {isRegistering && (
              <div className="relative">
                <FaUserTag className="absolute left-3 top-3 text-gray-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border p-2 pl-10 rounded"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>

            <div className="flex justify-between text-sm text-gray-600">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="underline"
              >
                {isRegistering
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="underline"
              >
                Forgot Password?
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default AuthForm;
