import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Download,
  Filter,
  BarChart3,
  Activity,
  ShoppingCart,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';

const InventoryReports = ({ user, currentStore }) => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [showSummary, setShowSummary] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    averageStockLevel: 0,
    totalValue: 0,
    reorderAlerts: 0
  });

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'last-7-days', name: 'Last 7 Days' },
    { id: 'last-30-days', name: 'Last 30 Days' },
    { id: 'last-90-days', name: 'Last 90 Days' },
    { id: 'custom', name: 'Custom Range' }
  ];

  // Fetch inventory report data
  useEffect(() => {
    fetchInventoryData();
  }, [dateRange]);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/inventory?dateRange=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportData(data.reports || getMockInventoryData());
        setSummaryStats(data.summary || getMockInventorySummary());
      } else {
        setReportData(getMockInventoryData());
        setSummaryStats(getMockInventorySummary());
      }
    } catch (error) {
      console.log('Using mock inventory data - Backend not available');
      setReportData(getMockInventoryData());
      setSummaryStats(getMockInventorySummary());
    }
    setLoading(false);
  };

  const getMockInventoryData = () => [
    {
      id: 1,
      product: 'Classic White Dress Shirt',
      sku: 'SHIRT-001',
      stock: 45,
      reorderPoint: 20,
      supplier: 'Fashion Supplier Co.',
      lastUpdated: '2025-01-15',
      value: 1125.00,
      category: 'Formal Wear',
      status: 'in-stock'
    },
    {
      id: 2,
      product: 'Blue Oxford Shirt',
      sku: 'SHIRT-002',
      stock: 8,
      reorderPoint: 15,
      supplier: 'Premium Textiles',
      lastUpdated: '2025-01-14',
      value: 800.00,
      category: 'Casual Wear',
      status: 'low-stock'
    },
    {
      id: 3,
      product: 'Black Formal Shirt',
      sku: 'SHIRT-003',
      stock: 0,
      reorderPoint: 10,
      supplier: 'Elite Garments',
      lastUpdated: '2025-01-13',
      value: 0.00,
      category: 'Formal Wear',
      status: 'out-of-stock'
    },
    {
      id: 4,
      product: 'Striped Business Shirt',
      sku: 'SHIRT-004',
      stock: 32,
      reorderPoint: 25,
      supplier: 'Business Wear Inc.',
      lastUpdated: '2025-01-15',
      value: 475.00,
      category: 'Business Wear',
      status: 'in-stock'
    },
    {
      id: 5,
      product: 'Red Casual Shirt',
      sku: 'SHIRT-005',
      stock: 5,
      reorderPoint: 12,
      supplier: 'Casual Fashion',
      lastUpdated: '2025-01-12',
      value: 125.00,
      category: 'Casual Wear',
      status: 'low-stock'
    }
  ];

  const getMockInventorySummary = () => ({
    totalProducts: 156,
    lowStockItems: 8,
    outOfStockItems: 2,
    averageStockLevel: 45,
    totalValue: 2525.00,
    reorderAlerts: 10
  });

  const exportReport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-report-${dateRange}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      'in-stock': 'text-green-600 bg-green-100',
      'low-stock': 'text-orange-600 bg-orange-100',
      'out-of-stock': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-stock':
        return <Package className="w-4 h-4 text-green-500" />;
      case 'low-stock':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'out-of-stock':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="deal-n-done-card p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Reports</h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor stock levels, reorder points, and inventory value
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            Category Filter
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Categories</option>
            <option>Formal Wear</option>
            <option>Casual Wear</option>
            <option>Business Wear</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      {showSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.totalProducts}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.lowStockItems}
                </p>
                <p className="text-xs text-orange-600 mt-1">Needs reorder</p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.outOfStockItems}
                </p>
                <p className="text-xs text-red-600 mt-1">Urgent reorder</p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Stock Level</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.averageStockLevel}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Reorder Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.reorderAlerts}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Pending action</p>
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
            <p className="text-gray-600">Loading inventory data...</p>
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
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.product}</div>
                      <div className="text-xs text-gray-500">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">{item.stock}</span>
                        {item.stock < item.reorderPoint && (
                          <span className="ml-2 text-xs text-red-500">Reorder: {item.reorderPoint}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(item.status)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${item.value.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.lastUpdated}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
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

export default InventoryReports; 