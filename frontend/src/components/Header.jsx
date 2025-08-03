import React from 'react';
import { 
  Menu, 
  Plus, 
  Download, 
  Bell, 
  MessageSquare, 
  User,
  ChevronDown
} from 'lucide-react';

const Header = ({ user, selectedCurrency, setSelectedCurrency }) => {
  return (
    <header className="deal-n-done-header">
      <div className="flex items-center space-x-4">
        <button
          className="deal-n-done-btn-secondary flex items-center text-sm"
          onClick={() => {/* toggle sidebar */}}
          aria-label="Expand sidebar menu"
        >
          <Menu className="w-4 h-4 mr-1" />
          Menu
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Quick Actions */}
        <button className="deal-n-done-btn-primary flex items-center text-sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Product
        </button>
        
        <button className="deal-n-done-btn-secondary flex items-center text-sm">
          <Download className="w-4 h-4 mr-1" />
          Export
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* AI Assistant Quick Access */}
        <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="deal-n-done-header user-profile">
          <div className="deal-n-done-header user-avatar">
            <User className="w-5 h-5" />
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