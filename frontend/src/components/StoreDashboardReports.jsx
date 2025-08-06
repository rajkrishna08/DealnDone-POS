import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Download,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const StoreDashboardReports = ({ user, currentStore }) => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [showSummary, setShowSummary] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalProfit: 0,
    totalQuantity: 0,
    averageOrderValue: 0,
    growthRate: 0,
    topProduct: '',
    topCategory: ''
  });

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'inventory', name: 'Inventory Report', icon: <Package className="w-4 h-4" /> },
    { id: 'customers', name: 'Customer Report', icon: <Users className="w-4 h-4" /> },
    { id: 'products', name: 'Product Report', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'last-7-days', name: 'Last 7 Days' },
    { id: 'last-30-days', name: 'Last 30 Days' },
    { id: 'last-90-days', name: 'Last 90 Days' },
    { id: 'custom', name: 'Custom Range' }
  ];

  // Fetch report data from backend
  useEffect(() => {
    fetchReportData();
  }, [reportType, dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual backend call
      const response = await fetch(`/api/reports/${reportType}?dateRange=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportData(data.reports || getMockData());
        setSummaryStats(data.summary || getMockSummary());
      } else {
        // Use mock data if API fails
        setReportData(getMockData());
        setSummaryStats(getMockSummary());
      }
    } catch (error) {
      console.log('Using mock data - Backend not available');
      setReportData(getMockData());
      setSummaryStats(getMockSummary());
    }
    setLoading(false);
  };

  const getMockData = () => {
    const baseData = [
      {
        id: 1,
        product: 'Classic White Dress Shirt',
        sku: 'SHIRT-001',
        quantity: 45,
        revenue: 1125.00,
        profit: 337.50,
        date: '2025-01-15',
        category: 'Formal Wear',
        growth: 12.5
      },
      {
        id: 2,
        product: 'Blue Oxford Shirt',
        sku: 'SHIRT-002',
        quantity: 32,
        revenue: 800.00,
        profit: 240.00,
        date: '2025-01-15',
        category: 'Casual Wear',
        growth: 8.3
      },
      {
        id: 3,
        product: 'Black Formal Shirt',
        sku: 'SHIRT-003',
        quantity: 28,
        revenue: 700.00,
        profit: 210.00,
        date: '2025-01-15',
        category: 'Formal Wear',
        growth: -2.1
      },
      {
        id: 4,
        product: 'Striped Business Shirt',
        sku: 'SHIRT-004',
        quantity: 19,
        revenue: 475.00,
        profit: 142.50,
        date: '2025-01-15',
        category: 'Business Wear',
        growth: 15.7
      }
    ];

    // Filter based on report type
    if (reportType === 'inventory') {
      return baseData.map(item => ({
        ...item,
        stock: Math.floor(Math.random() * 100) + 10,
        reorderPoint: 20,
        supplier: 'Fashion Supplier Co.',
        lastUpdated: '2025-01-15'
      }));
    } else if (reportType === 'customers') {
      return baseData.map(item => ({
        ...item,
        customerName: `Customer ${item.id}`,
        customerType: ['VIP', 'Regular', 'New'][Math.floor(Math.random() * 3)],
        purchaseHistory: Math.floor(Math.random() * 10) + 1,
        totalSpent: item.revenue * (Math.floor(Math.random() * 3) + 1)
      }));
    }

    return baseData;
  };

  const getMockSummary = () => {
    const baseSummary = {
      totalRevenue: 3100.00,
      totalProfit: 929.00,
      totalQuantity: 124,
      averageOrderValue: 775.00,
      growthRate: 12.5,
      topProduct: 'Classic White Dress Shirt',
      topCategory: 'Formal Wear'
    };

    if (reportType === 'inventory') {
      return {
        ...baseSummary,
        totalProducts: 156,
        lowStockItems: 8,
        outOfStockItems: 2,
        averageStockLevel: 45
      };
    } else if (reportType === 'customers') {
      return {
        ...baseSummary,
        totalCustomers: 234,
        newCustomers: 12,
        returningCustomers: 189,
        averageCustomerValue: 145.50
      };
    }

    return baseSummary;
  };

  const exportReport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}-report-${dateRange}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getGrowthIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="deal-n-done-card p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {reportTypes.find(t => t.id === reportType)?.name || 'Reports'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Analyze your store performance and insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowSummary(!showSummary)}
            className="deal-n-done-btn-secondary flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showSummary ? 'Hide' : 'Show'} Summary
          </button>
          <button 
            onClick={exportReport}
            className="deal-n-done-btn-primary flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="deal-n-done-card p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(summaryStats.growthRate)}
                  <span className="text-xs text-gray-500 ml-1">
                    {summaryStats.growthRate > 0 ? '+' : ''}{summaryStats.growthRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Profit</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.totalProfit.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(summaryStats.growthRate)}
                  <span className="text-xs text-gray-500 ml-1">
                    {summaryStats.growthRate > 0 ? '+' : ''}{summaryStats.growthRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Items Sold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.totalQuantity.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Top: {summaryStats.topProduct}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.averageOrderValue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Top Category: {summaryStats.topCategory}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading report data...</p>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && (
        <div className="deal-n-done-table">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {reportType === 'customers' ? 'Customer' : 'Product'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {reportType === 'customers' ? 'Type' : 'SKU'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {reportType === 'inventory' ? 'Stock' : 'Quantity'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
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
                      <div className="text-sm font-medium text-gray-900">
                        {reportType === 'customers' ? item.customerName : item.product}
                      </div>
                      {reportType === 'customers' && (
                        <div className="text-xs text-gray-500">
                          {item.customerType} • {item.purchaseHistory} purchases
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {reportType === 'customers' ? item.customerType : item.sku}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reportType === 'inventory' ? item.stock : item.quantity}
                      </div>
                      {reportType === 'inventory' && item.stock < item.reorderPoint && (
                        <div className="text-xs text-red-500">Low Stock</div>
                      )}
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
                      <div className="flex items-center">
                        {getGrowthIcon(item.growth)}
                        <span className={`text-sm ml-1 ${
                          item.growth > 0 ? 'text-green-600' : 
                          item.growth < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </span>
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
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 sm:gap-0">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{reportData.length}</span> of{' '}
          <span className="font-medium">{reportData.length}</span> results
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