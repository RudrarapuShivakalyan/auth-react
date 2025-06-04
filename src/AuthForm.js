import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaUserTag, FaPhone, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';

const roles = ['Buyer', 'Tenant', 'Owner', 'User', 'Admin', 'Content Creator'];

function AuthForm({ onAuth }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: roles[0],
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isForgotPassword) {
        if (!resetEmail) {
          setError('Please enter your email address');
          return;
        }

        const response = await fetch('https://backend-603t.onrender.com/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: resetEmail }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to send reset email');
        }

        setSuccess(data.message || 'Password reset link has been sent to your email');
        setTimeout(() => {
          setIsForgotPassword(false);
          setResetEmail('');
        }, 3000);
      } else if (isVerifying) {
        const response = await fetch('https://backend-603t.onrender.com/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            verificationCode: verificationCode
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setSuccess('Email verified successfully! Proceeding with registration...');
        // After successful verification, proceed with registration
        const registerResponse = await fetch('https://backend-603t.onrender.com/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const registerData = await registerResponse.json();
        if (!registerResponse.ok) {
          throw new Error(registerData.message || 'Registration failed');
        }

        setSuccess('Registration successful! You can now log in.');
        setTimeout(() => {
          setIsVerifying(false);
          setIsRegistering(false);
          setFormData({
            email: '',
            name: '',
            password: '',
            role: roles[0],
            phoneNumber: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            }
          });
        }, 3000);
      } else {
        if (isRegistering) {
          // Just proceed with registration
          const response = await fetch('https://backend-603t.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          setSuccess('Registration successful! Please verify your email.');
          setIsVerifying(true);
        } else {
          const response = await fetch('https://backend-603t.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
          }

          if (!data.user.isVerified) {
            setError('Please verify your email before logging in.');
            return;
          }

          if (typeof onAuth === 'function') {
            onAuth(data);
          } else {
            console.error('onAuth is not a function');
          }
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await fetch('https://backend-603t.onrender.com/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      setSuccess('Verification code sent to your email!');
      setIsVerifying(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'Buyer':
        return (
          <div className="space-y-4">
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="address.street"
                placeholder="Street Address"
                value={formData.address.street}
                onChange={handleChange}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>
          </div>
        );
      case 'Tenant':
        return (
          <div className="space-y-4">
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>
          </div>
        );
      case 'Owner':
        return (
          <div className="space-y-4">
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="address.street"
                placeholder="Street Address"
                value={formData.address.street}
                onChange={handleChange}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">
        {isForgotPassword ? 'Reset Password' : isVerifying ? 'Verify Email' : isRegistering ? 'Register' : 'Login'}
      </h2>

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
        ) : isVerifying ? (
          <>
            <div className="relative">
              <FaCheck className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Verify & Register
            </button>
            <button
              type="button"
              onClick={() => {
                setIsVerifying(false);
                setIsRegistering(false);
              }}
              className="text-sm text-gray-600 underline"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 pl-10 rounded"
                required
              />
            </div>

            {isRegistering && (
              <>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
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

                {renderRoleSpecificFields()}
              </>
            )}

            {!isRegistering && (
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
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>

            {isRegistering && (
              <button
                type="button"
                onClick={handleVerifyEmail}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded mb-2"
              >
                Send Verification Code
              </button>
            )}

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
