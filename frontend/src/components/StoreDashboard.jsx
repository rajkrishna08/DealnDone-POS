import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Package, 
  DollarSign, 
  ShoppingCart,
  BarChart3,
  Settings,
  Plus,
  AlertCircle,
  CheckCircle,
  Activity,
  Zap,
  Bot,
  Lightbulb,
  Package2,
  AlertTriangle,
  Edit,
  RefreshCw,
  Calendar
} from 'lucide-react';

const StoreDashboard = ({ onNavigate, user, currentStore }) => {
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      totalSales: { value: 1250, change: 12, trend: 'up' },
      totalOrders: { value: 48, change: 8, trend: 'up' },
      activeUsers: { value: 12, change: 3, trend: 'down' },
      revenue: { value: 31250, change: 15, trend: 'up' }
    },
    realTimeInsights: {
      liveSales: 0,
      activeCustomers: 0,
      lowStockAlerts: 0,
      pendingOrders: 0
    },
    aiInsights: [
      {
        type: 'sales-prediction',
        icon: <Lightbulb className="w-4 h-4" />,
        title: 'Sales Prediction',
        message: 'Expected 15% increase in sales this week based on current trends'
      },
      {
        type: 'inventory-alert',
        icon: <Package2 className="w-4 h-4" />,
        title: 'Inventory Alert',
        message: '3 products need restocking within 48 hours'
      },
      {
        type: 'customer-insights',
        icon: <TrendingUp className="w-4 h-4" />,
        title: 'Customer Insights',
        message: 'Peak shopping hours: 2-4 PM, consider promotions'
      }
    ],
    systemStatus: [
      { name: 'Database', status: 'online', icon: <CheckCircle className="w-4 h-4" /> },
      { name: 'API Server', status: 'online', icon: <CheckCircle className="w-4 h-4" /> },
      { name: 'Payment Gateway', status: 'maintenance', icon: <AlertTriangle className="w-4 h-4" /> }
    ],
    users: [
      {
        name: 'John Doe',
        email: 'john.doe@dealndone.com',
        role: 'Admin',
        status: 'Active',
        lastActive: '2 hours ago',
        initials: 'JD'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@dealndone.com',
        role: 'Manager',
        status: 'Active',
        lastActive: '1 day ago',
        initials: 'JS'
      }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTime, setRefreshTime] = useState('Today');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-600';
      case 'maintenance':
        return 'text-orange-600';
      case 'offline':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100';
      case 'maintenance':
        return 'bg-orange-100';
      case 'offline':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Store Manager Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your store operations and analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={refreshTime}
            onChange={(e) => setRefreshTime(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Sales</h3>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">1,250</p>
              <p className="text-sm text-gray-500">today period</p>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">12% from yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">48</p>
              <p className="text-sm text-gray-500">Processed orders</p>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">8% from yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500">Currently online</p>
            </div>
            <div className="flex items-center text-red-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">3% from yesterday</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">$31,250</p>
              <p className="text-sm text-gray-500">today revenue</p>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">15% from yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Real-Time Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Zap className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Real-Time Insights</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-green-700">Live Sales</p>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-blue-700">Active Customers</p>
            </div>
            <div className="bg-orange-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">0</p>
              <p className="text-sm text-orange-700">Low Stock Alerts</p>
            </div>
            <div className="bg-purple-100 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-purple-700">Pending Orders</p>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Bot className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          </div>
          <div className="space-y-4">
            {dashboardData.aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="text-purple-600 mt-1">
                  {insight.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                  <p className="text-sm text-gray-600">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">analytics Chart visualization would go here</p>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            {dashboardData.systemStatus.map((system, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${getStatusBgColor(system.status)}`}>
                    <div className={getStatusColor(system.status)}>
                      {system.icon}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{system.name}</span>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(system.status)}`}>
                  {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  USER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROLE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LAST ACTIVE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.users.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{user.initials}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard; 