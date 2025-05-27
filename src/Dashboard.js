import React from 'react';

function Dashboard({ user, onLogout }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
      <h2 className="text-2xl font-semibold mb-2">Welcome, {user.username}!</h2>
      <p className="mb-4 text-gray-700">Role: <strong>{user.role}</strong></p>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
