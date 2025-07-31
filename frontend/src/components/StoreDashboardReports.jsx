import React, { useState } from 'react';

const StoreDashboardReports = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [showSummary, setShowSummary] = useState(true);

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: 'trending_up' },
    { id: 'inventory', name: 'Inventory Report', icon: 'inventory_2' },
    { id: 'customers', name: 'Customer Report', icon: 'people' },
    { id: 'products', name: 'Product Report', icon: 'category' }
  ];

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'last-7-days', name: 'Last 7 Days' },
    { id: 'last-30-days', name: 'Last 30 Days' },
    { id: 'last-90-days', name: 'Last 90 Days' },
    { id: 'custom', name: 'Custom Range' }
  ];

  const reportData = [
    {
      id: 1,
      product: 'Classic White Dress Shirt',
      sku: 'SHIRT-001',
      quantity: 45,
      revenue: 1125.00,
      profit: 337.50,
      date: '2025-01-15'
    },
    {
      id: 2,
      product: 'Blue Oxford Shirt',
      sku: 'SHIRT-002',
      quantity: 32,
      revenue: 800.00,
      profit: 240.00,
      date: '2025-01-15'
    },
    {
      id: 3,
      product: 'Black Formal Shirt',
      sku: 'SHIRT-003',
      quantity: 28,
      revenue: 700.00,
      profit: 210.00,
      date: '2025-01-15'
    },
    {
      id: 4,
      product: 'Striped Business Shirt',
      sku: 'SHIRT-004',
      quantity: 19,
      revenue: 475.00,
      profit: 142.50,
      date: '2025-01-15'
    }
  ];

  const summaryStats = {
    totalRevenue: 3100.00,
    totalProfit: 929.00,
    totalQuantity: 124,
    averageOrderValue: 775.00
  };

  return (
    <div className="deal-n-done-card p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-sm text-gray-600 mt-1">Analyze your store performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowSummary(!showSummary)}
            className="deal-n-done-btn-secondary"
          >
            <span className="material-icons align-middle mr-2">
              {showSummary ? 'expand_less' : 'expand_more'}
            </span>
            {showSummary ? 'Hide' : 'Show'} Summary
          </button>
          <button className="deal-n-done-btn-primary">
            <span className="material-icons align-middle mr-2">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Report Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {reportTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Location
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Locations</option>
            <option>Main Store</option>
            <option>Downtown Branch</option>
            <option>Mall Location</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      {showSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="material-icons text-blue-600">attach_money</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="material-icons text-green-600">trending_up</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Profit</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.totalProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="material-icons text-purple-600">inventory_2</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Items Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.totalQuantity.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="material-icons text-orange-600">shopping_cart</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.averageOrderValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="deal-n-done-table">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.product}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${item.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ${item.profit.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
          <span className="font-medium">4</span> results
        </div>
        <div className="flex space-x-2">
          <button className="deal-n-done-btn-secondary px-3 py-1 text-sm">
            Previous
          </button>
          <button className="deal-n-done-btn-primary px-3 py-1 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboardReports; 