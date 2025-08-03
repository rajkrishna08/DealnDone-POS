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
  Smartphone
} from 'lucide-react';

const Sidebar = ({ currentView, onNavigate, onLogout, user }) => {
  const [expandedMenus, setExpandedMenus] = useState([]);

  const menuItems = [
    { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: 'owner-dashboard' },
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
      submenu: ['Sales Reports', 'Inventory Reports', 'Customer Reports', 'Financial Reports', 'Analytics Dashboard', 'Custom Reports']
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
          onNavigate('pos-screen');
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
        case 'Sales Reports':
          onNavigate('sales-reports');
          break;
        case 'Inventory Reports':
          onNavigate('inventory-reports');
          break;
        case 'Customer Reports':
          onNavigate('customer-reports');
          break;
        case 'Financial Reports':
          onNavigate('financial-reports');
          break;
        case 'Analytics Dashboard':
          onNavigate('analytics-dashboard');
          break;
        case 'Custom Reports':
          onNavigate('custom-reports');
          break;
        default:
          onNavigate('sales-reports');
      }
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 h-screen flex flex-col">
      {/* Brand Logo */}
      <div className="p-6 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-white">Deal n Done</h1>
            <p className="text-xs text-gray-300">Point of Sale</p>
          </div>
        </div>
        {user && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{user.email}</span>
              <button
                onClick={onLogout}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              <button
                onClick={() => {
                  if (item.name === 'Sales') {
                    // For Sales module, show POS screen but also toggle submenu
                    onNavigate('pos-screen');
                    setExpandedMenus(prev => 
                      prev.includes(item.name) 
                        ? prev.filter(menu => menu !== item.name)
                        : [...prev, item.name]
                    );
                  } else {
                    handleMenuClick(item.name);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-gray-800 ${
                  currentView === item.path ? 'bg-blue-600 text-white border-l-4 border-blue-400' : 'text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronDown className={`text-gray-400 transition-transform duration-200 w-4 h-4 ${
                    expandedMenus.includes(item.name) ? 'rotate-180' : ''
                  }`} />
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
                        {item.name === 'Settings' && sub === 'General Setup' ? <Settings className="w-4 h-4" /> :
                         item.name === 'Settings' && sub === 'Billing & Subscription' ? <CreditCard className="w-4 h-4" /> :
                         item.name === 'Settings' && sub === 'Outlets & Registers' ? <Building2 className="w-4 h-4" /> :
                         item.name === 'Settings' && sub === 'Loyalty Program' ? <Heart className="w-4 h-4" /> :
                         item.name === 'Settings' && sub === 'Employees' ? <Users className="w-4 h-4" /> :
                         item.name === 'Settings' && sub === 'Sales Tax' ? <DollarSign className="w-4 h-4" /> :
                         item.name === 'Settings' && sub === 'Payment Types' ? <Wallet className="w-4 h-4" /> :
                         item.name === 'Settings' && sub === 'Security & Access' ? <Shield className="w-4 h-4" /> :
                         item.name === 'Employees' && sub === 'Employee Management' ? <Users className="w-4 h-4" /> :
                         item.name === 'Employees' && sub === 'Roles & Permissions' ? <Shield className="w-4 h-4" /> :
                         item.name === 'Employees' && sub === 'Timesheets' ? <FileText className="w-4 h-4" /> : 
                         <span className="w-4 h-4">•</span>}
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