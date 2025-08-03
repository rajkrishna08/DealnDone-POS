import React, { useState, useEffect } from 'react';
// import settingsService from '../utils/settingsService'; // Commented out unused import

const Settings = ({ onNavigate }) => {
  const [user, setUser] = useState(null);
  // const [storeData, setStoreData] = useState(null); // Commented out unused variable
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Load user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      // Load store data from API
      // const user = settingsService.getUser(); // Commented out unused variable
      // const orgId = settingsService.getOrgId(); // Commented out unused variable
      
      try {
        // const storeSettings = await settingsService.getStoreSettings(orgId); // Commented out unused variable
        // setStoreData(storeSettings); // Commented out unused variable
      } catch (error) {
        console.error('Error loading store data:', error);
        // Fallback to localStorage if API fails
        const storeInfo = localStorage.getItem('storeData');
        if (storeInfo) {
          // setStoreData(JSON.parse(storeInfo)); // Commented out unused variable
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    onNavigate('landing');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
        <button 
                onClick={() => onNavigate('owner-dashboard')}
                className="text-gray-600 hover:text-gray-900"
        >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
        </button>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {user.email}</span>
          <button
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('storeData');
                  onNavigate('landing');
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Logout
          </button>
            </div>
          </div>
      </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Overview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings Overview</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Store Settings</h3>
                  <p className="text-blue-700 mb-4">
                    Manage your store information, subdomain, business type, and plan details.
                  </p>
                    <button
                    onClick={() => onNavigate('general-setup')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Store Settings
                    </button>
              </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">General Setup</h3>
                  <p className="text-green-700 mb-4">
                    Configure business hours, regional settings, receipts, and notifications.
                  </p>
                    <button
                    onClick={() => onNavigate('general-setup')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to General Setup
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('owner-dashboard')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </button>

                <button
                  onClick={() => onNavigate('pos-screen')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Open POS
                </button>

                <button
                  onClick={() => onNavigate('inventory-dashboard')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Manage Inventory
                </button>
                
                <button 
                  onClick={() => onNavigate('sales-analytics')}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
    </div>
  );
};

export default Settings; 