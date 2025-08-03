import React, { useState, useEffect } from 'react';

const StoreDashboard = ({ onNavigate }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    onNavigate('landing');
  };

  const handleSettings = () => {
    onNavigate('settings');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h2>
          <button
            onClick={() => onNavigate('login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Deal n Done</h1>
              <span className="ml-4 text-sm text-gray-500">Store Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <button
                onClick={handleSettings}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Store Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <p className="mt-1 text-lg text-gray-900">{user.storeName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Store URL</label>
              <p className="mt-1 text-lg text-gray-900">{user.subdomain}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Type</label>
              <p className="mt-1 text-lg text-gray-900">{user.businessType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Plan</label>
              <p className="mt-1 text-lg text-gray-900 capitalize">{user.planType}</p>
            </div>
          </div>
        </div>

        {/* Plan Limits Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-600">Outlets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1,000</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Employees</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate('pos-screen')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-2xl mb-2">🛒</div>
              <div className="font-medium text-gray-900">POS Screen</div>
              <div className="text-sm text-gray-600">Process sales</div>
            </button>
            <button
              onClick={() => onNavigate('inventory-dashboard')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="font-medium text-gray-900">Inventory</div>
              <div className="text-sm text-gray-600">Manage stock</div>
            </button>
            <button
              onClick={() => onNavigate('sales-analytics')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-gray-900">Analytics</div>
              <div className="text-sm text-gray-600">View reports</div>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-medium text-gray-900">Settings</div>
              <div className="text-sm text-gray-600">Configure store</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoreDashboard; 