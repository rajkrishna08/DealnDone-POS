import React, { useState } from 'react';

const Sidebar = ({ currentView, setCurrentView, onNavigateToEmployeesSubmodule, onNavigateToSettingsSubmodule }) => {
  const [expandedMenus, setExpandedMenus] = useState([]);

  const menuItems = [
    { name: 'Dashboard', icon: '🏠', path: 'dashboard' },
    { name: 'Sales', icon: '🛒', path: 'pos' },
    {
      name: 'Products',
      icon: '📋',
      hasSubmenu: true,
      submenu: ['Product Catalog', 'Product Categories', 'Product Variants', 'Product Images', 'Product Pricing', 'Product Reviews']
    },
    {
      name: 'Customers',
      icon: '👥',
      hasSubmenu: true,
      submenu: ['Customer Directory', 'Customer Groups', 'Customer Loyalty', 'Customer Feedback', 'Customer Analytics', 'Customer Support']
    },
    {
      name: 'Sales Management',
      icon: '💰',
      hasSubmenu: true,
      submenu: ['Sales Orders', 'Sales History', 'Cash Registers', 'Cash Management', 'Sales Quotes', 'Sales Invoices', 'Sales Returns', 'Sales Analytics', 'Sales Targets']
    },
    {
      name: 'Marketing',
      icon: '📢',
      hasSubmenu: true,
      submenu: ['Campaigns', 'Promotions', 'Email Marketing', 'Social Media', 'Marketing Analytics', 'Lead Management']
    },
    {
      name: 'Inventory',
      icon: '📦',
      hasSubmenu: true,
      submenu: ['Inventory Dashboard', 'Stock Purchases', 'Stock Transfers', 'Stock Returns', 'Stock Take', 'Departments', 'Vendors']
    },
    {
      name: 'Reports',
      icon: '📊',
      hasSubmenu: true,
      submenu: ['Sales Reports', 'Inventory Reports', 'Customer Reports', 'Financial Reports', 'Analytics Dashboard', 'Custom Reports']
    },
    {
      name: 'Settings',
      icon: '⚙️',
      hasSubmenu: true,
      submenu: ['General Setup', 'Billing & Subscription', 'Outlets & Registers', 'Loyalty Program', 'Employees', 'Sales Tax', 'Payment Types']
    },
    {
      name: 'Employees',
      icon: '👥',
      hasSubmenu: true,
      submenu: ['Employee Management', 'Roles & Permissions', 'Timesheets']
    },
    { name: 'Landing', icon: '🌐', path: 'landing' }
  ];

  const handleMenuClick = (itemName) => {
    if (itemName === 'Settings' || itemName === 'Employees' || itemName === 'Inventory' || itemName === 'Products' || 
        itemName === 'Customers' || itemName === 'Sales Management' || itemName === 'Marketing' || itemName === 'Reports') {
      // Toggle expanded state for all menu types
      setExpandedMenus(prev => 
        prev.includes(itemName) 
          ? prev.filter(item => item !== itemName)
          : [...prev, itemName]
      );
    } else {
      // Handle regular menu items
      const menuItem = menuItems.find(item => item.name === itemName);
      if (menuItem && menuItem.path) {
        setCurrentView(menuItem.path);
      }
    }
  };

  const handleSubmenuClick = (parentItem, subItem) => {
    if (parentItem === 'Settings') {
      setCurrentView('settings');
      onNavigateToSettingsSubmodule(subItem);
    } else if (parentItem === 'Employees') {
      setCurrentView('employees');
      if (subItem === 'Roles & Permissions') {
        onNavigateToEmployeesSubmodule('roles');
      } else if (subItem === 'Employees') {
        onNavigateToEmployeesSubmodule('employees');
      } else if (subItem === 'Timesheets') {
        onNavigateToEmployeesSubmodule('timesheets');
      }
    } else if (parentItem === 'Products') {
      setCurrentView('products');
      // Handle product submodules
      switch (subItem) {
        case 'Product Catalog':
          setCurrentView('product-catalog');
          break;
        case 'Product Categories':
          setCurrentView('product-categories');
          break;
        case 'Product Variants':
          setCurrentView('product-variants');
          break;
        case 'Product Images':
          setCurrentView('product-images');
          break;
        case 'Product Pricing':
          setCurrentView('product-pricing');
          break;
        case 'Product Reviews':
          setCurrentView('product-reviews');
          break;
        default:
          setCurrentView('product-catalog');
      }
    } else if (parentItem === 'Customers') {
      setCurrentView('customers');
      // Handle customer submodules
      switch (subItem) {
        case 'Customer Directory':
          setCurrentView('customer-directory');
          break;
        case 'Customer Groups':
          setCurrentView('customer-groups');
          break;
        case 'Customer Loyalty':
          setCurrentView('customer-loyalty');
          break;
        case 'Customer Feedback':
          setCurrentView('customer-feedback');
          break;
        case 'Customer Analytics':
          setCurrentView('customer-analytics');
          break;
        case 'Customer Support':
          setCurrentView('customer-support');
          break;
        default:
          setCurrentView('customer-directory');
      }
    } else if (parentItem === 'Sales Management') {
      setCurrentView('sales-management');
      // Handle sales management submodules
      switch (subItem) {
        case 'Sales Orders':
          setCurrentView('sales-orders');
          break;
        case 'Sales History':
          setCurrentView('sales-history');
          break;
        case 'Cash Registers':
          setCurrentView('cash-registers');
          break;
        case 'Cash Management':
          setCurrentView('cash-management');
          break;
        case 'Sales Quotes':
          setCurrentView('sales-quotes');
          break;
        case 'Sales Invoices':
          setCurrentView('sales-invoices');
          break;
        case 'Sales Returns':
          setCurrentView('sales-returns');
          break;
        case 'Sales Analytics':
          setCurrentView('sales-analytics');
          break;
        case 'Sales Targets':
          setCurrentView('sales-targets');
          break;
        default:
          setCurrentView('sales-orders');
      }
    } else if (parentItem === 'Marketing') {
      setCurrentView('marketing');
      // Handle marketing submodules
      switch (subItem) {
        case 'Campaigns':
          setCurrentView('marketing-campaigns');
          break;
        case 'Promotions':
          setCurrentView('promotions');
          break;
        case 'Email Marketing':
          setCurrentView('email-marketing');
          break;
        case 'Social Media':
          setCurrentView('social-media');
          break;
        case 'Marketing Analytics':
          setCurrentView('marketing-analytics');
          break;
        case 'Lead Management':
          setCurrentView('lead-management');
          break;
        default:
          setCurrentView('marketing-campaigns');
      }
    } else if (parentItem === 'Reports') {
      setCurrentView('reports');
      // Handle reports submodules
      switch (subItem) {
        case 'Sales Reports':
          setCurrentView('sales-reports');
          break;
        case 'Inventory Reports':
          setCurrentView('inventory-reports');
          break;
        case 'Customer Reports':
          setCurrentView('customer-reports');
          break;
        case 'Financial Reports':
          setCurrentView('financial-reports');
          break;
        case 'Analytics Dashboard':
          setCurrentView('analytics-dashboard');
          break;
        case 'Custom Reports':
          setCurrentView('custom-reports');
          break;
        default:
          setCurrentView('sales-reports');
      }
    } else if (parentItem === 'Inventory') {
      setCurrentView('inventory');
      // Handle inventory submodules
      switch (subItem) {
        case 'Inventory Dashboard':
          setCurrentView('inventory-dashboard');
          break;
        case 'Stock Purchases':
          setCurrentView('stock-purchases');
          break;
        case 'Stock Transfers':
          setCurrentView('stock-transfers');
          break;
        case 'Stock Returns':
          setCurrentView('stock-returns');
          break;
        case 'Stock Take':
          setCurrentView('stock-take');
          break;
        case 'Departments':
          setCurrentView('departments');
          break;
        case 'Vendors':
          setCurrentView('vendors');
          break;
        default:
          setCurrentView('inventory-dashboard');
      }
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 h-screen flex flex-col">
      {/* Brand Logo */}
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <h1 className="font-bold text-xl text-white">Deal n Done</h1>
            <p className="text-xs text-gray-300">Point of Sale</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              <button
                onClick={() => handleMenuClick(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-gray-800 ${
                  currentView === item.path ? 'bg-blue-600 text-white border-l-4 border-blue-400' : 'text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.hasSubmenu && (
                  <span className={`text-gray-400 transition-transform duration-200 ${
                    expandedMenus.includes(item.name) ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                )}
              </button>
              {item.hasSubmenu && expandedMenus.includes(item.name) && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((sub, index) => (
                    <button
                      key={sub}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-all duration-200 hover:bg-gray-800 text-sm ${
                        index === 0 ? 'text-blue-400 font-medium' : 'text-gray-400'
                      }`}
                      onClick={() => handleSubmenuClick(item.name, sub)}
                    >
                      <span className="text-sm">
                        {item.name === 'Settings' && sub === 'General Setup' ? '⚙️' :
                         item.name === 'Settings' && sub === 'Billing & Subscription' ? '💰' :
                         item.name === 'Settings' && sub === 'Outlets & Registers' ? '🏪' :
                         item.name === 'Settings' && sub === 'Loyalty Program' ? '🎁' :
                         item.name === 'Settings' && sub === 'Employees' ? '👥' :
                         item.name === 'Settings' && sub === 'Sales Tax' ? '🧾' :
                         item.name === 'Settings' && sub === 'Payment Types' ? '💳' :
                         item.name === 'Employees' && sub === 'Employee Management' ? '👥' :
                         item.name === 'Employees' && sub === 'Roles & Permissions' ? '🛡️' :
                         item.name === 'Employees' && sub === 'Timesheets' ? '📅' : '•'}
                      </span>
                      <span className="font-medium">{sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="text-center">
          <p className="text-xs text-gray-400">Deal n Done POS</p>
          <p className="text-xs text-gray-500">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 