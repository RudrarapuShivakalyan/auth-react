import React from 'react';

function Dashboard({ user, onLogout }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name}!</h2>
      <div className="space-y-4">
        <p><strong>Email:</strong> {user.email}</p>
        <button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
