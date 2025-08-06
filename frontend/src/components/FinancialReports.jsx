import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download,
  Filter,
  BarChart3,
  Activity,
  ShoppingCart,
  Users,
  Clock,
  CreditCard,
  Receipt
} from 'lucide-react';

const FinancialReports = ({ user, currentStore }) => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [showSummary, setShowSummary] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    averageOrderValue: 0,
    topRevenueSource: ''
  });

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'last-7-days', name: 'Last 7 Days' },
    { id: 'last-30-days', name: 'Last 30 Days' },
    { id: 'last-90-days', name: 'Last 90 Days' },
    { id: 'custom', name: 'Custom Range' }
  ];

  // Fetch financial report data
  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/financial?dateRange=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportData(data.reports || getMockFinancialData());
        setSummaryStats(data.summary || getMockFinancialSummary());
      } else {
        setReportData(getMockFinancialData());
        setSummaryStats(getMockFinancialSummary());
      }
    } catch (error) {
      console.log('Using mock financial data - Backend not available');
      setReportData(getMockFinancialData());
      setSummaryStats(getMockFinancialSummary());
    }
    setLoading(false);
  };

  const getMockFinancialData = () => [
    {
      id: 1,
      category: 'Product Sales',
      revenue: 8500.00,
      expenses: 3400.00,
      profit: 5100.00,
      margin: 60.0,
      transactions: 125,
      date: '2025-01-15',
      growth: 12.5
    },
    {
      id: 2,
      category: 'Service Fees',
      revenue: 1200.00,
      expenses: 200.00,
      profit: 1000.00,
      margin: 83.3,
      transactions: 45,
      date: '2025-01-15',
      growth: 8.3
    },
    {
      id: 3,
      category: 'Subscriptions',
      revenue: 800.00,
      expenses: 100.00,
      profit: 700.00,
      margin: 87.5,
      transactions: 12,
      date: '2025-01-15',
      growth: 15.7
    },
    {
      id: 4,
      category: 'Returns & Refunds',
      revenue: -450.00,
      expenses: 50.00,
      profit: -500.00,
      margin: -111.1,
      transactions: 8,
      date: '2025-01-15',
      growth: -5.2
    },
    {
      id: 5,
      category: 'Other Income',
      revenue: 300.00,
      expenses: 0.00,
      profit: 300.00,
      margin: 100.0,
      transactions: 5,
      date: '2025-01-15',
      growth: 25.0
    }
  ];

  const getMockFinancialSummary = () => ({
    totalRevenue: 10350.00,
    totalExpenses: 3750.00,
    netProfit: 6600.00,
    profitMargin: 63.8,
    averageOrderValue: 82.80,
    topRevenueSource: 'Product Sales'
  });

  const exportReport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${dateRange}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getGrowthIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getMarginColor = (margin) => {
    if (margin >= 80) return 'text-green-600';
    if (margin >= 60) return 'text-blue-600';
    if (margin >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="deal-n-done-card p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-sm text-gray-600 mt-1">
            Track revenue, expenses, profit margins, and financial performance
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
            Report Type
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>P&L Statement</option>
            <option>Cash Flow</option>
            <option>Balance Sheet</option>
            <option>Revenue Analysis</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      {showSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600 ml-1">+12.5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Receipt className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.totalExpenses.toLocaleString()}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600 ml-1">-5.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.netProfit.toLocaleString()}
                </p>
                <p className={`text-xs ${getMarginColor(summaryStats.profitMargin)} mt-1`}>
                  {summaryStats.profitMargin}% margin
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.averageOrderValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Top Revenue</p>
                <p className="text-lg font-bold text-gray-900">
                  {summaryStats.topRevenueSource}
                </p>
                <p className="text-xs text-yellow-600 mt-1">Primary source</p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  195
                </p>
                <p className="text-xs text-orange-600 mt-1">This period</p>
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
            <p className="text-gray-600">Loading financial data...</p>
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
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${item.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${item.revenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${item.expenses.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${item.profit.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getMarginColor(item.margin)}`}>
                        {item.margin}%
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
                      <div className="text-sm text-gray-900">{item.transactions}</div>
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

export default FinancialReports; 