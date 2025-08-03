import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package,
  Target,
  ArrowUp,
  ArrowDown,
  Eye,
  Users
} from 'lucide-react';

const SalesAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  const analyticsData = {
    revenue: {
      current: 125000,
      previous: 110000,
      change: 13.6,
      trend: 'up'
    },
    orders: {
      current: 1250,
      previous: 1100,
      change: 13.6,
      trend: 'up'
    },
    customers: {
      current: 450,
      previous: 420,
      change: 7.1,
      trend: 'up'
    },
    averageOrder: {
      current: 100,
      previous: 95,
      change: 5.3,
      trend: 'up'
    }
  };

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 125, revenue: 124875, growth: 15.2 },
    { name: 'MacBook Air M2', sales: 89, revenue: 106791, growth: 12.8 },
    { name: 'iPad Air', sales: 156, revenue: 93599, growth: 8.5 },
    { name: 'AirPods Pro', sales: 234, revenue: 58497, growth: 22.1 },
    { name: 'Apple Watch Series 9', sales: 78, revenue: 31122, growth: 18.7 }
  ];

  const salesByCategory = [
    { category: 'Smartphones', sales: 45, revenue: 156000 },
    { category: 'Laptops', sales: 23, revenue: 128000 },
    { category: 'Tablets', sales: 18, revenue: 89000 },
    { category: 'Accessories', sales: 14, revenue: 42000 }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 95000, orders: 950 },
    { month: 'Feb', revenue: 105000, orders: 1050 },
    { month: 'Mar', revenue: 115000, orders: 1150 },
    { month: 'Apr', revenue: 125000, orders: 1250 },
    { month: 'May', revenue: 135000, orders: 1350 },
    { month: 'Jun', revenue: 145000, orders: 1450 }
  ];

  const getChangeIcon = (trend) => {
    return trend === 'up' ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />;
  };

  const getChangeColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Sales Analytics</h1>
          <div className="text-sm text-gray-500">
            Comprehensive sales performance insights and trends
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="deal-n-done-input"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="deal-n-done-btn-secondary">
            Export Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${analyticsData.revenue.current.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getChangeIcon(analyticsData.revenue.trend)}
                  <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.revenue.trend)}`}>
                    +{analyticsData.revenue.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.orders.current.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getChangeIcon(analyticsData.orders.trend)}
                  <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.orders.trend)}`}>
                    +{analyticsData.orders.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.customers.current.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getChangeIcon(analyticsData.customers.trend)}
                  <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.customers.trend)}`}>
                    +{analyticsData.customers.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${analyticsData.averageOrder.current}</p>
                <div className="flex items-center mt-1">
                  {getChangeIcon(analyticsData.averageOrder.trend)}
                  <span className={`text-sm font-medium ml-1 ${getChangeColor(analyticsData.averageOrder.trend)}`}>
                    +{analyticsData.averageOrder.change}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(data.revenue / 150000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">${data.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales by Category */}
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
            <div className="space-y-4">
              {salesByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{category.category}</span>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(category.revenue / 156000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">${category.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="deal-n-done-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        product.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.growth > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {product.growth}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-800">Revenue Growth</p>
                  <p className="text-xs text-green-600">Strong performance this month</p>
                </div>
                <span className="text-sm font-bold text-green-800">+13.6%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-800">Customer Acquisition</p>
                  <p className="text-xs text-blue-600">New customers increasing</p>
                </div>
                <span className="text-sm font-bold text-blue-800">+7.1%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Average Order Value</p>
                  <p className="text-xs text-yellow-600">Customers spending more</p>
                </div>
                <span className="text-sm font-bold text-yellow-800">+5.3%</span>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <BarChart3 className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Generate Sales Report</p>
                    <p className="text-xs text-gray-600">Export detailed analytics</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">View Trends</p>
                    <p className="text-xs text-gray-600">Analyze sales patterns</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Set Targets</p>
                    <p className="text-xs text-gray-600">Define sales goals</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics; 