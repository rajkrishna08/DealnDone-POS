import React from 'react';

const Header = ({ user, selectedCurrency, setSelectedCurrency }) => {
  return (
    <header className="deal-n-done-header">
      <div className="flex items-center space-x-4">
        <button
          className="deal-n-done-btn-secondary flex items-center text-sm"
          onClick={() => {/* toggle sidebar */}}
          aria-label="Expand sidebar menu"
        >
          <span className="text-lg mr-1">☰</span>
          Menu
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <button className="deal-n-done-btn-primary flex items-center text-sm">
          <span className="text-lg mr-1">+</span>
          Add Product
        </button>
        
        <button className="deal-n-done-btn-secondary flex items-center text-sm">
          <span className="text-lg mr-1">📤</span>
          Export
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <span className="text-lg">🔔</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* AI Assistant Quick Access */}
        <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <span className="text-lg">🤖</span>
        </button>

        {/* User Profile */}
        <div className="deal-n-done-header user-profile">
          <div className="deal-n-done-header user-avatar">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 