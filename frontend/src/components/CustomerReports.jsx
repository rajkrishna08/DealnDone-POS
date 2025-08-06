import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  TrendingDown, 
  Download,
  Filter,
  BarChart3,
  Activity,
  ShoppingCart,
  DollarSign,
  Clock,
  Star
} from 'lucide-react';

const CustomerReports = ({ user, currentStore }) => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [showSummary, setShowSummary] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalCustomers: 0,
    newCustomers: 0,
    returningCustomers: 0,
    averageCustomerValue: 0,
    topCustomer: '',
    customerSatisfaction: 0
  });

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'last-7-days', name: 'Last 7 Days' },
    { id: 'last-30-days', name: 'Last 30 Days' },
    { id: 'last-90-days', name: 'Last 90 Days' },
    { id: 'custom', name: 'Custom Range' }
  ];

  // Fetch customer report data
  useEffect(() => {
    fetchCustomerData();
  }, [dateRange]);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/customers?dateRange=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportData(data.reports || getMockCustomerData());
        setSummaryStats(data.summary || getMockCustomerSummary());
      } else {
        setReportData(getMockCustomerData());
        setSummaryStats(getMockCustomerSummary());
      }
    } catch (error) {
      console.log('Using mock customer data - Backend not available');
      setReportData(getMockCustomerData());
      setSummaryStats(getMockCustomerSummary());
    }
    setLoading(false);
  };

  const getMockCustomerData = () => [
    {
      id: 1,
      customerName: 'John Smith',
      customerType: 'VIP',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      totalSpent: 2500.00,
      purchaseHistory: 15,
      lastPurchase: '2025-01-15',
      satisfaction: 5.0,
      segment: 'High Value'
    },
    {
      id: 2,
      customerName: 'Sarah Johnson',
      customerType: 'Regular',
      email: 'sarah.j@email.com',
      phone: '+1-555-0124',
      totalSpent: 850.00,
      purchaseHistory: 8,
      lastPurchase: '2025-01-14',
      satisfaction: 4.5,
      segment: 'Loyal'
    },
    {
      id: 3,
      customerName: 'Mike Davis',
      customerType: 'New',
      email: 'mike.d@email.com',
      phone: '+1-555-0125',
      totalSpent: 125.00,
      purchaseHistory: 2,
      lastPurchase: '2025-01-13',
      satisfaction: 4.0,
      segment: 'New'
    },
    {
      id: 4,
      customerName: 'Emily Wilson',
      customerType: 'VIP',
      email: 'emily.w@email.com',
      phone: '+1-555-0126',
      totalSpent: 3200.00,
      purchaseHistory: 22,
      lastPurchase: '2025-01-12',
      satisfaction: 5.0,
      segment: 'High Value'
    },
    {
      id: 5,
      customerName: 'David Brown',
      customerType: 'Regular',
      email: 'david.b@email.com',
      phone: '+1-555-0127',
      totalSpent: 650.00,
      purchaseHistory: 6,
      lastPurchase: '2025-01-10',
      satisfaction: 4.2,
      segment: 'Loyal'
    }
  ];

  const getMockCustomerSummary = () => ({
    totalCustomers: 234,
    newCustomers: 12,
    returningCustomers: 189,
    averageCustomerValue: 145.50,
    topCustomer: 'John Smith',
    customerSatisfaction: 4.6
  });

  const exportReport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customer-report-${dateRange}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCustomerTypeColor = (type) => {
    const colors = {
      'VIP': 'text-purple-600 bg-purple-100',
      'Regular': 'text-blue-600 bg-blue-100',
      'New': 'text-green-600 bg-green-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const getSegmentColor = (segment) => {
    const colors = {
      'High Value': 'text-purple-600',
      'Loyal': 'text-blue-600',
      'New': 'text-green-600',
      'At Risk': 'text-red-600'
    };
    return colors[segment] || 'text-gray-600';
  };

  const getSatisfactionStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="deal-n-done-card p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reports</h1>
          <p className="text-sm text-gray-600 mt-1">
            Analyze customer behavior, satisfaction, and value
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            Customer Type
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Types</option>
            <option>VIP</option>
            <option>Regular</option>
            <option>New</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Segment
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Segments</option>
            <option>High Value</option>
            <option>Loyal</option>
            <option>New</option>
            <option>At Risk</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      {showSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.totalCustomers}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">New Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.newCustomers}
                </p>
                <p className="text-xs text-green-600 mt-1">This period</p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Returning</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.returningCustomers}
                </p>
                <p className="text-xs text-purple-600 mt-1">Loyal customers</p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Customer Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${summaryStats.averageCustomerValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryStats.customerSatisfaction}/5
                </p>
                <div className="flex mt-1">
                  {getSatisfactionStars(summaryStats.customerSatisfaction)}
                </div>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card p-4 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Top Customer</p>
                <p className="text-lg font-bold text-gray-900">
                  {summaryStats.topCustomer}
                </p>
                <p className="text-xs text-red-600 mt-1">Highest value</p>
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
            <p className="text-gray-600">Loading customer data...</p>
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
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satisfaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Purchase
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.customerName}</div>
                      <div className={`text-xs ${getSegmentColor(item.segment)}`}>
                        {item.segment}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCustomerTypeColor(item.customerType)}`}>
                        {item.customerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.email}</div>
                      <div className="text-xs text-gray-500">{item.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${item.totalSpent.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.purchaseHistory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getSatisfactionStars(item.satisfaction)}
                        <span className="ml-2 text-sm text-gray-500">
                          {item.satisfaction}/5
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.lastPurchase}</div>
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

export default CustomerReports; 