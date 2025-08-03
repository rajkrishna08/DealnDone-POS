import React, { useState } from 'react';

const CustomerAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

  // Dummy data for customer analytics
  const analyticsData = {
    overview: {
      totalCustomers: 2847,
      activeCustomers: 2156,
      newCustomers: 234,
      churnedCustomers: 45,
      avgLifetimeValue: 1250.50,
      retentionRate: 84.2,
      acquisitionCost: 85.30,
      customerSatisfaction: 4.2
    },
    segments: [
      {
        name: 'VIP Customers',
        count: 156,
        percentage: 5.5,
        avgLTV: 8500.00,
        retentionRate: 96.8,
        avgOrderValue: 450.00,
        frequency: 12.5
      },
      {
        name: 'Regular Customers',
        count: 1245,
        percentage: 43.8,
        avgLTV: 1800.00,
        retentionRate: 78.5,
        avgOrderValue: 120.00,
        frequency: 6.2
      },
      {
        name: 'Occasional Buyers',
        count: 892,
        percentage: 31.4,
        avgLTV: 450.00,
        retentionRate: 45.2,
        avgOrderValue: 75.00,
        frequency: 2.1
      },
      {
        name: 'At Risk',
        count: 554,
        percentage: 19.3,
        avgLTV: 180.00,
        retentionRate: 12.5,
        avgOrderValue: 45.00,
        frequency: 0.8
      }
    ],
    behavior: [
      {
        metric: 'Average Session Duration',
        value: '4m 32s',
        change: '+12%',
        trend: 'up'
      },
      {
        metric: 'Pages per Session',
        value: '3.8',
        change: '+8%',
        trend: 'up'
      },
      {
        metric: 'Bounce Rate',
        value: '32.5%',
        change: '-5%',
        trend: 'down'
      },
      {
        metric: 'Conversion Rate',
        value: '2.8%',
        change: '+15%',
        trend: 'up'
      },
      {
        metric: 'Cart Abandonment',
        value: '68.2%',
        change: '-3%',
        trend: 'down'
      },
      {
        metric: 'Repeat Purchase Rate',
        value: '45.8%',
        change: '+7%',
        trend: 'up'
      }
    ],
    trends: [
      { month: 'Jan', customers: 2100, revenue: 125000, orders: 1850 },
      { month: 'Feb', customers: 2250, revenue: 138000, orders: 1950 },
      { month: 'Mar', customers: 2400, revenue: 152000, orders: 2100 },
      { month: 'Apr', customers: 2350, revenue: 148000, orders: 2050 },
      { month: 'May', customers: 2500, revenue: 165000, orders: 2200 },
      { month: 'Jun', customers: 2650, revenue: 178000, orders: 2350 },
      { month: 'Jul', customers: 2800, revenue: 192000, orders: 2500 },
      { month: 'Aug', customers: 2847, revenue: 198000, orders: 2580 }
    ],
    topCustomers: [
      {
        id: 1,
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        totalSpent: 52000,
        orders: 45,
        lastOrder: '2025-01-30',
        avgOrderValue: 1155.56,
        lifetimeValue: 52000,
        segment: 'VIP'
      },
      {
        id: 2,
        name: 'John Smith',
        email: 'john.smith@email.com',
        totalSpent: 18500,
        orders: 23,
        lastOrder: '2025-01-28',
        avgOrderValue: 804.35,
        lifetimeValue: 18500,
        segment: 'Regular'
      },
      {
        id: 3,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        totalSpent: 8500,
        orders: 18,
        lastOrder: '2025-01-29',
        avgOrderValue: 472.22,
        lifetimeValue: 8500,
        segment: 'Regular'
      },
      {
        id: 4,
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        totalSpent: 16200,
        orders: 28,
        lastOrder: '2025-01-27',
        avgOrderValue: 578.57,
        lifetimeValue: 16200,
        segment: 'Regular'
      },
      {
        id: 5,
        name: 'Lisa Brown',
        email: 'lisa.brown@email.com',
        totalSpent: 4200,
        orders: 12,
        lastOrder: '2025-01-25',
        avgOrderValue: 350.00,
        lifetimeValue: 4200,
        segment: 'Occasional'
      }
    ]
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getSegmentColor = (segment) => {
    switch (segment) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800';
      case 'Regular':
        return 'bg-blue-100 text-blue-800';
      case 'Occasional':
        return 'bg-yellow-100 text-yellow-800';
      case 'At Risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Customer Analytics</h1>
          <div className="text-sm text-gray-500">
            Analyze customer behavior, segments, and lifetime value
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'segments', 'behavior', 'trends', 'customers'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Total Customers</div>
                    <div className="text-2xl font-semibold text-gray-900">{analyticsData.overview.totalCustomers.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Active Customers</div>
                    <div className="text-2xl font-semibold text-gray-900">{analyticsData.overview.activeCustomers.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">💰</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Avg LTV</div>
                    <div className="text-2xl font-semibold text-gray-900">${analyticsData.overview.avgLifetimeValue.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📈</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Retention Rate</div>
                    <div className="text-2xl font-semibold text-gray-900">{analyticsData.overview.retentionRate}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{analyticsData.overview.newCustomers}</div>
                  <div className="text-sm text-gray-500">New Customers</div>
                  <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{analyticsData.overview.churnedCustomers}</div>
                  <div className="text-sm text-gray-500">Churned Customers</div>
                  <div className="text-xs text-red-600 mt-1">-8% from last month</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{analyticsData.overview.customerSatisfaction}</div>
                  <div className="text-sm text-gray-500">Satisfaction Score</div>
                  <div className="text-xs text-green-600 mt-1">+0.3 from last month</div>
                </div>
              </div>
            </div>

            {/* Customer Growth Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth Trend</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {analyticsData.trends.map((trend, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(trend.customers / 3000) * 200}px` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">{trend.month}</div>
                    <div className="text-xs text-gray-600">{trend.customers}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Segments Tab */}
        {activeTab === 'segments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.segments.map((segment) => (
                <div key={segment.name} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(segment.name)}`}>
                      {segment.percentage}%
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-500">Customers</div>
                      <div className="text-lg font-semibold text-gray-900">{segment.count.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Avg LTV</div>
                      <div className="text-lg font-semibold text-gray-900">${segment.avgLTV.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Retention Rate</div>
                      <div className="text-lg font-semibold text-gray-900">{segment.retentionRate}%</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Avg Order Value</div>
                      <div className="text-lg font-semibold text-gray-900">${segment.avgOrderValue}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Purchase Frequency</div>
                      <div className="text-lg font-semibold text-gray-900">{segment.frequency}/month</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Behavior Tab */}
        {activeTab === 'behavior' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData.behavior.map((metric) => (
                <div key={metric.metric} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{metric.metric}</h3>
                    <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                      {metric.change}
                    </span>
                  </div>
                  
                  <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                  
                  <div className="flex items-center">
                    <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                      {metric.trend === 'up' ? '↗' : '↘'} {metric.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last period</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Behavior Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavior Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Top Performing Segments</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">VIP Customers</span>
                      <span className="text-sm font-medium text-gray-900">96.8% retention</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Regular Customers</span>
                      <span className="text-sm font-medium text-gray-900">78.5% retention</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Occasional Buyers</span>
                      <span className="text-sm font-medium text-gray-900">45.2% retention</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Improvement Opportunities</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cart Abandonment</span>
                      <span className="text-sm font-medium text-red-600">68.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">At Risk Customers</span>
                      <span className="text-sm font-medium text-red-600">12.5% retention</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bounce Rate</span>
                      <span className="text-sm font-medium text-yellow-600">32.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                <div className="h-48 flex items-end justify-between gap-1">
                  {analyticsData.trends.map((trend, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${(trend.revenue / 200000) * 150}px` }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2">{trend.month}</div>
                      <div className="text-xs text-gray-600">${(trend.revenue / 1000).toFixed(0)}k</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
                <div className="h-48 flex items-end justify-between gap-1">
                  {analyticsData.trends.map((trend, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${(trend.orders / 3000) * 150}px` }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2">{trend.month}</div>
                      <div className="text-xs text-gray-600">{trend.orders}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
                <div className="h-48 flex items-end justify-between gap-1">
                  {analyticsData.trends.map((trend, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-purple-500 rounded-t"
                        style={{ height: `${(trend.customers / 3000) * 150}px` }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2">{trend.month}</div>
                      <div className="text-xs text-gray-600">{trend.customers}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Customers by LTV</h3>
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Segment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Order Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Order
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.topCustomers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {customer.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(customer.segment)}`}>
                            {customer.segment}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${customer.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${customer.avgOrderValue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.lastOrder}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAnalytics; 