import React, { useState } from 'react';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  BarChart3, 
  Globe, 
  UserCheck,
  Shield,
  FileText,
  CreditCard,
  Building2,
  TrendingUp,
  MessageSquare,
  Heart,
  DollarSign,
  Wallet,
  ChevronDown,
  Zap,
  Smartphone,
  LogOut,
  Store,
  HelpCircle,
  Bell,
  Crown
} from 'lucide-react';
import StoreSelector from './StoreSelector';

const Sidebar = ({ currentView, onNavigate, onLogout, user }) => {
  const [expandedMenus, setExpandedMenus] = useState([]);

  const menuItems = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: 'store-dashboard' },
    {
      name: 'Sales',
      icon: <ShoppingCart className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: ['Sales Orders', 'Sales History', 'Cash Registers', 'Cash Management', 'Sales Quotes', 'Sales Invoices', 'Sales Returns', 'Sales Analytics', 'Sales Targets']
    },
    {
      name: 'Products',
      icon: <Package className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: ['Product Catalog', 'Product Categories', 'Product Variants', 'Product Images', 'Product Pricing', 'Product Reviews']
    },
    {
      name: 'Customers',
      icon: <Users className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: ['Customer Directory', 'Customer Groups', 'Customer Loyalty', 'Customer Feedback', 'Customer Analytics', 'Customer Support']
    },
    {
      name: 'Marketing',
      icon: <TrendingUp className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: ['Campaigns', 'Promotions', 'Email Marketing', 'Social Media', 'Marketing Analytics', 'Lead Management']
    },
    {
      name: 'Inventory',
      icon: <Package className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: ['Inventory Dashboard', 'Stock Purchases', 'Stock Transfers', 'Stock Returns', 'Stock Take', 'Departments', 'Vendors']
    },
    {
      name: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: ['Financial Reports', 'Advanced Reports', 'Inventory Reports', 'Real-time Analytics', 'Customer Reports', 'Store Dashboard Reports']
    },
    {
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: ['Store Settings', 'General Setup', 'Billing & Subscription', 'Outlets & Registers', 'Loyalty Program', 'Employees', 'Sales Tax', 'Payment Types', 'Security & Access']
    },
    {
      name: 'Employees',
      icon: <UserCheck className="w-5 h-5" />,
      hasSubmenu: true,
      submenu: ['Employee Management', 'Roles & Permissions', 'Timesheets']
    },
    { name: 'DealBot AI', icon: <MessageSquare className="w-5 h-5" />, path: 'dealbot-ai' },
    { name: 'MCP Dashboard', icon: <Zap className="w-5 h-5" />, path: 'mcp-dashboard' },
    { name: 'Orchestrator Monitor', icon: <Zap className="w-5 h-5" />, path: 'orchestrator-monitor' },
    { name: 'Subdomain Demo', icon: <Globe className="w-5 h-5" />, path: 'subdomain-demo' },
    { name: 'Landing', icon: <Globe className="w-5 h-5" />, path: 'landing' },
    {
      name: 'Mobile POS',
      href: 'mobile-pos',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Mobile Point of Sale'
    },
    {
      name: 'Enhanced POS',
      href: 'pos-v2',
      icon: <Zap className="w-5 h-5" />,
      description: 'Next-Gen Sales Screen'
    },
    {
      name: 'Modern POS',
      href: 'modern-pos',
      icon: <ShoppingCart className="w-5 h-5" />,
      description: 'Complete Sales & Receipt System'
    },
    {
      name: 'MVC POS',
      href: 'mvc-pos',
      icon: <ShoppingCart className="w-5 h-5" />,
      description: 'MVC Architecture POS System'
    }
  ];

  const handleMenuClick = (itemName) => {
    if (itemName === 'Settings' || itemName === 'Employees' || itemName === 'Inventory' || itemName === 'Products' || 
        itemName === 'Customers' || itemName === 'Sales' || itemName === 'Marketing' || itemName === 'Reports') {
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
        onNavigate(menuItem.path);
      }
    }
  };

  const handleSubmenuClick = (parentItem, subItem) => {
    if (parentItem === 'Settings') {
      // Handle settings submodules
      switch (subItem) {
        case 'Store Settings':
          onNavigate('settings');
          break;
        case 'General Setup':
          onNavigate('general-setup');
          break;
        case 'Billing & Subscription':
          onNavigate('pricing-plans-settings');
          break;
        case 'Outlets & Registers':
          onNavigate('outlets-registers');
          break;
        case 'Loyalty Program':
          onNavigate('loyalty-program');
          break;
        case 'Employees':
          onNavigate('employees');
          break;
        case 'Sales Tax':
          onNavigate('sales-tax');
          break;
        case 'Payment Types':
          onNavigate('payment-types');
          break;
        case 'Security & Access':
          onNavigate('security-access');
          break;
        default:
          onNavigate('settings');
      }
    } else if (parentItem === 'Employees') {
      // Handle employee submodules
      switch (subItem) {
        case 'Roles & Permissions':
          onNavigate('roles');
          break;
        case 'Employee Management':
          onNavigate('employees');
          break;
        case 'Timesheets':
          onNavigate('timesheets');
          break;
        default:
          onNavigate('employees');
      }
    } else if (parentItem === 'Products') {
      // Handle product submodules
      switch (subItem) {
        case 'Product Catalog':
          onNavigate('product-catalog');
          break;
        case 'Product Categories':
          onNavigate('product-categories');
          break;
        default:
          onNavigate('products');
      }
    } else if (parentItem === 'Customers') {
      // Handle customer submodules
      switch (subItem) {
        case 'Customer Directory':
          onNavigate('customer-directory');
          break;
        case 'Customer Groups':
          onNavigate('customer-groups');
          break;
        case 'Customer Loyalty':
          onNavigate('customer-loyalty');
          break;
        case 'Customer Feedback':
          onNavigate('customer-feedback');
          break;
        case 'Customer Analytics':
          onNavigate('customer-analytics');
          break;
        case 'Customer Support':
          onNavigate('customer-support');
          break;
        default:
          onNavigate('customer-directory');
      }
    } else if (parentItem === 'Sales') {
      // Handle sales submodules
      switch (subItem) {
        case 'Sales Orders':
          onNavigate('sales-orders');
          break;
        case 'Sales History':
          onNavigate('sales-history');
          break;
        case 'Cash Registers':
          onNavigate('cash-registers');
          break;
        case 'Cash Management':
          onNavigate('cash-management');
          break;
        case 'Sales Quotes':
          onNavigate('sales-quotes');
          break;
        case 'Sales Invoices':
          onNavigate('sales-invoices');
          break;
        case 'Sales Returns':
          onNavigate('sales-returns');
          break;
        case 'Sales Analytics':
          onNavigate('sales-analytics');
          break;
        case 'Sales Targets':
          onNavigate('sales-targets');
          break;
        default:
          onNavigate('sales-screen');
      }
    } else if (parentItem === 'Inventory') {
      // Handle inventory submodules
      switch (subItem) {
        case 'Inventory Dashboard':
          onNavigate('inventory-dashboard');
          break;
        case 'Stock Purchases':
          onNavigate('stock-purchases');
          break;
        case 'Stock Transfers':
          onNavigate('stock-transfers');
          break;
        case 'Stock Returns':
          onNavigate('stock-returns');
          break;
        case 'Stock Take':
          onNavigate('stock-take');
          break;
        case 'Departments':
          onNavigate('departments');
          break;
        case 'Vendors':
          onNavigate('vendors');
          break;
        default:
          onNavigate('inventory-dashboard');
      }
    } else if (parentItem === 'Reports') {
      // Handle reports submodules
      switch (subItem) {
        case 'Financial Reports':
          onNavigate('financial-reports');
          break;
        case 'Advanced Reports':
          onNavigate('advanced-reports');
          break;
        case 'Inventory Reports':
          onNavigate('inventory-reports');
          break;
        case 'Real-time Analytics':
          onNavigate('real-time-analytics');
          break;
        case 'Customer Reports':
          onNavigate('customer-reports');
          break;
        case 'Store Dashboard Reports':
          onNavigate('store-dashboard-reports');
          break;
        default:
          onNavigate('financial-reports');
      }
    } else if (parentItem === 'Marketing') {
      // Handle marketing submodules
      switch (subItem) {
        case 'Campaigns':
          onNavigate('marketing-campaigns');
          break;
        default:
          onNavigate('marketing-campaigns');
      }
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      {/* Branding */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Deal n Done</h1>
            <p className="text-xs text-gray-400">Point of Sale</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {user?.email || 'demo@dealndone.com'}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => handleMenuClick(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      currentView === item.name.toLowerCase().replace(/\s+/g, '-')
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        expandedMenus.includes(item.name) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedMenus.includes(item.name) && (
                    <ul className="ml-8 mt-2 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <button
                            onClick={() => handleSubmenuClick(item.name, subItem)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            {subItem}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleMenuClick(item.name)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    currentView === item.path || currentView === item.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Version Info */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-400 text-center">Deal n Done POS v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar; 