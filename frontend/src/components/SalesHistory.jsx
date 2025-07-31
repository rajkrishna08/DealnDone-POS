import React, { useState } from 'react';

const SalesHistory = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dummy data for sales history
  const salesTransactions = [
    {
      id: 'TXN-001',
      date: '2025-01-30',
      time: '14:30',
      customer: 'John Smith',
      items: [
        { name: 'Classic White Shirt', quantity: 2, price: 45.00 },
        { name: 'Blue Oxford Shirt', quantity: 1, price: 55.00 }
      ],
      subtotal: 145.00,
      tax: 14.50,
      total: 159.50,
      paymentMethod: 'Credit Card',
      status: 'Completed',
      cashier: 'Sarah Johnson',
      register: 'Register 1'
    },
    {
      id: 'TXN-002',
      date: '2025-01-30',
      time: '12:15',
      customer: 'Mike Chen',
      items: [
        { name: 'Denim Jeans', quantity: 1, price: 89.00 },
        { name: 'Leather Belt', quantity: 1, price: 35.00 }
      ],
      subtotal: 124.00,
      tax: 12.40,
      total: 136.40,
      paymentMethod: 'Cash',
      status: 'Completed',
      cashier: 'David Wilson',
      register: 'Register 2'
    },
    {
      id: 'TXN-003',
      date: '2025-01-29',
      time: '16:45',
      customer: 'Emily Davis',
      items: [
        { name: 'Silk Scarf', quantity: 3, price: 25.00 },
        { name: 'Wool Sweater', quantity: 1, price: 120.00 }
      ],
      subtotal: 195.00,
      tax: 19.50,
      total: 214.50,
      paymentMethod: 'Debit Card',
      status: 'Refunded',
      cashier: 'Sarah Johnson',
      register: 'Register 1'
    }
  ];

  const salesAnalytics = {
    totalSales: 24580.50,
    totalTransactions: 156,
    averageTransactionValue: 157.57,
    topSellingItems: [
      { name: 'Classic White Shirt', quantity: 45, revenue: 2025.00 },
      { name: 'Denim Jeans', quantity: 32, revenue: 2848.00 },
      { name: 'Blue Oxford Shirt', quantity: 28, revenue: 1540.00 }
    ],
    paymentMethodBreakdown: [
      { method: 'Credit Card', percentage: 45, amount: 11061.23 },
      { method: 'Cash', percentage: 30, amount: 7374.15 },
      { method: 'Debit Card', percentage: 20, amount: 4916.10 },
      { method: 'Mobile Payment', percentage: 5, amount: 1229.02 }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Refunded': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = salesTransactions.filter(transaction => {
    const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Sales History</h1>
          <div className="text-sm text-gray-500">
            View and analyze all sales transactions
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button className="deal-n-done-btn-secondary">
            <span>📊</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">${salesAnalytics.totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{salesAnalytics.totalTransactions}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Transaction</p>
                <p className="text-2xl font-bold text-gray-900">${salesAnalytics.averageTransactionValue}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-gray-900">$2,450</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          {activeTab === 'transactions' && (
            <div>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-64">
                  <input
                    type="text"
                    placeholder="Search by customer or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date & Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Items</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Total</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Payment</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{transaction.id}</td>
                        <td className="py-3 px-4 text-gray-600">
                          <div>
                            <div>{transaction.date}</div>
                            <div className="text-sm text-gray-500">{transaction.time}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{transaction.customer}</td>
                        <td className="py-3 px-4 text-gray-600">
                          <div className="text-sm">
                            {transaction.items.map((item, index) => (
                              <div key={index}>
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ${transaction.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">{transaction.paymentMethod}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Items</h3>
                <div className="space-y-3">
                  {salesAnalytics.topSellingItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.quantity} units sold</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${item.revenue.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  {salesAnalytics.paymentMethodBreakdown.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{method.method}</div>
                        <div className="text-sm text-gray-600">{method.percentage}% of transactions</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">${method.amount.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesHistory; 