import React, { useState, useEffect } from 'react';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeUsers: 0,
    revenue: 0,
    currency: 'USD'
  });
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    liveSales: 0,
    activeCustomers: 0,
    lowStockAlerts: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setDashboardData({
        totalSales: 1250,
        totalOrders: 48,
        activeUsers: 12,
        revenue: 31250,
        currency: 'USD'
      });
      setIsLoading(false);
    }, 1000);

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        liveSales: prev.liveSales + Math.floor(Math.random() * 3),
        activeCustomers: Math.floor(Math.random() * 20) + 5,
        lowStockAlerts: Math.floor(Math.random() * 5) + 2,
        pendingOrders: Math.floor(Math.random() * 10) + 3
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount, currency) => {
    const symbols = {
      'USD': '$',
      'INR': '₹',
      'EUR': '€',
      'GBP': '£'
    };
    return `${symbols[currency] || currency}${amount.toLocaleString()}`;
  };

  const DashboardCard = ({ title, value, subtitle, icon, color, trend, isLive = false }) => (
    <div className="deal-n-done-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-1 text-xs ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="material-icons text-sm mr-1">
                {trend > 0 ? 'trending_up' : 'trending_down'}
              </span>
              {Math.abs(trend)}% from yesterday
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
          <span className="material-icons text-2xl">{icon}</span>
        </div>
      </div>
      {isLive && (
        <div className="mt-2 flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      )}
    </div>
  );

  const RealTimeInsights = () => (
    <div className="deal-n-done-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="material-icons mr-2 text-green-600">flash_on</span>
        Real-Time Insights
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{realTimeData.liveSales}</div>
          <div className="text-sm text-green-700">Live Sales</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{realTimeData.activeCustomers}</div>
          <div className="text-sm text-blue-700">Active Customers</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{realTimeData.lowStockAlerts}</div>
          <div className="text-sm text-orange-700">Low Stock Alerts</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{realTimeData.pendingOrders}</div>
          <div className="text-sm text-purple-700">Pending Orders</div>
        </div>
      </div>
    </div>
  );

  const AIInsights = () => (
    <div className="deal-n-done-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="material-icons mr-2 text-blue-600">smart_toy</span>
        AI Insights
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-start p-3 bg-blue-50 rounded-lg">
          <span className="material-icons text-blue-600 mr-3 mt-0.5">lightbulb</span>
          <div>
            <div className="font-medium text-blue-900">Sales Prediction</div>
            <div className="text-sm text-blue-700">Expected 15% increase in sales this week based on current trends</div>
          </div>
        </div>
        
        <div className="flex items-start p-3 bg-green-50 rounded-lg">
          <span className="material-icons text-green-600 mr-3 mt-0.5">inventory</span>
          <div>
            <div className="font-medium text-green-900">Inventory Alert</div>
            <div className="text-sm text-green-700">3 products need restocking within 48 hours</div>
          </div>
        </div>
        
        <div className="flex items-start p-3 bg-purple-50 rounded-lg">
          <span className="material-icons text-purple-600 mr-3 mt-0.5">trending_up</span>
          <div>
            <div className="font-medium text-purple-900">Customer Insights</div>
            <div className="text-sm text-purple-700">Peak shopping hours: 2-4 PM, consider promotions</div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsChart = ({ title, data }) => (
    <div className="deal-n-done-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <span className="material-icons text-4xl text-gray-400 mb-2">analytics</span>
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>
    </div>
  );

  const UserManagementTable = () => (
    <div className="deal-n-done-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
      <div className="deal-n-done-table overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="p-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">JD</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">John Doe</div>
                    <div className="text-sm text-gray-500">john.doe@dealndone.com</div>
                  </div>
                </div>
              </td>
              <td className="p-3 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  Admin
                </span>
              </td>
              <td className="p-3 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </td>
              <td className="p-3 whitespace-nowrap text-sm text-gray-500">
                2 hours ago
              </td>
              <td className="p-3 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-900 transition-colors">
                  <span className="material-icons text-sm">edit</span>
                </button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="p-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white font-medium">JS</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                    <div className="text-sm text-gray-500">jane.smith@dealndone.com</div>
                  </div>
                </div>
              </td>
              <td className="p-3 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  Manager
                </span>
              </td>
              <td className="p-3 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </td>
              <td className="p-3 whitespace-nowrap text-sm text-gray-500">
                1 day ago
              </td>
              <td className="p-3 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-900 transition-colors">
                  <span className="material-icons text-sm">edit</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const SystemStatus = () => (
    <div className="deal-n-done-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="material-icons text-green-600 mr-2">check_circle</span>
            <span className="text-sm font-medium text-gray-900">Database</span>
          </div>
          <span className="text-sm text-green-600">Online</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="material-icons text-green-600 mr-2">check_circle</span>
            <span className="text-sm font-medium text-gray-900">API Server</span>
          </div>
          <span className="text-sm text-green-600">Online</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <span className="material-icons text-yellow-600 mr-2">warning</span>
            <span className="text-sm font-medium text-gray-900">Payment Gateway</span>
          </div>
          <span className="text-sm text-yellow-600">Maintenance</span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="deal-n-done-card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Manager Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your store operations and analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="deal-n-done-btn-secondary flex items-center text-sm">
            <span className="material-icons text-lg mr-1">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Sales"
          value={dashboardData.totalSales.toLocaleString()}
          subtitle={`${selectedTimeframe} period`}
          icon="point_of_sale"
          color="border-blue-500"
          trend={12}
          isLive={true}
        />
        <DashboardCard
          title="Total Orders"
          value={dashboardData.totalOrders.toLocaleString()}
          subtitle="Processed orders"
          icon="shopping_cart"
          color="border-green-500"
          trend={8}
        />
        <DashboardCard
          title="Active Users"
          value={dashboardData.activeUsers.toLocaleString()}
          subtitle="Currently online"
          icon="people"
          color="border-purple-500"
          trend={-3}
        />
        <DashboardCard
          title="Revenue"
          value={formatCurrency(dashboardData.revenue, dashboardData.currency)}
          subtitle={`${selectedTimeframe} revenue`}
          icon="attach_money"
          color="border-yellow-500"
          trend={15}
        />
      </div>

      {/* Real-time Insights and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealTimeInsights />
        <AIInsights />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart title="Sales Trend" data={{}} />
        <SystemStatus />
      </div>

      {/* User Management */}
      <UserManagementTable />
    </div>
  );
};

export default OwnerDashboard; 