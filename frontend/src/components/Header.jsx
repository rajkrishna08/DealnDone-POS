import React from 'react';
import { 
  Plus, 
  Download, 
  Bell, 
  MessageSquare, 
  User,
  ChevronDown
} from 'lucide-react';

const Header = ({ user, selectedCurrency, setSelectedCurrency }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Product
          </button>
          
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>

        <div className="flex items-center space-x-4">
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
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.role || 'Admin'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 