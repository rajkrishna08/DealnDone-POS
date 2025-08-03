import React, { useState } from 'react';

const SalesQuotes = () => {
  const [quotes] = useState([
    {
      id: 'QT-001',
      customerName: 'ABC Electronics',
      customerEmail: 'john@abcelectronics.com',
      customerPhone: '+1 (555) 123-4567',
      status: 'pending',
      totalAmount: 2499.99,
      validUntil: '2025-08-15',
      createdAt: '2025-07-31',
      items: [
        { name: 'iPhone 15 Pro', quantity: 2, price: 999.99, total: 1999.98 },
        { name: 'AirPods Pro', quantity: 1, price: 249.99, total: 249.99 },
        { name: 'Screen Protector', quantity: 2, price: 19.99, total: 39.98 },
        { name: 'Wireless Charger', quantity: 1, price: 49.99, total: 49.99 }
      ],
      notes: 'Bulk order for office use. Need delivery by next week.'
    },
    {
      id: 'QT-002',
      customerName: 'Tech Solutions Inc',
      customerEmail: 'sarah@techsolutions.com',
      customerPhone: '+1 (555) 987-6543',
      status: 'approved',
      totalAmount: 1899.95,
      validUntil: '2025-08-10',
      createdAt: '2025-07-30',
      items: [
        { name: 'MacBook Air M2', quantity: 1, price: 1199.99, total: 1199.99 },
        { name: 'Magic Mouse', quantity: 1, price: 79.99, total: 79.99 },
        { name: 'USB-C Hub', quantity: 1, price: 89.99, total: 89.99 },
        { name: 'Laptop Sleeve', quantity: 1, price: 29.99, total: 29.99 }
      ],
      notes: 'For new employee setup. Priority delivery required.'
    },
    {
      id: 'QT-003',
      customerName: 'Digital Marketing Co',
      customerEmail: 'mike@digitalmarketing.com',
      customerPhone: '+1 (555) 456-7890',
      status: 'expired',
      totalAmount: 899.97,
      validUntil: '2025-07-25',
      createdAt: '2025-07-20',
      items: [
        { name: 'iPad Air', quantity: 1, price: 599.99, total: 599.99 },
        { name: 'Apple Pencil', quantity: 1, price: 129.99, total: 129.99 },
        { name: 'iPad Case', quantity: 1, price: 49.99, total: 49.99 }
      ],
      notes: 'For client presentations. Quote expired.'
    }
  ]);

  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'expired': return 'Expired';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    if (activeTab === 'all') return true;
    return quote.status === activeTab;
  });

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    approved: quotes.filter(q => q.status === 'approved').length,
    expired: quotes.filter(q => q.status === 'expired').length,
    totalValue: quotes.reduce((sum, quote) => sum + quote.totalAmount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Sales Quotes</h1>
          <div className="text-sm text-gray-500">
            Create and manage sales quotes for customers
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowCreateQuote(true)}
            className="deal-n-done-btn-primary"
          >
            <span>📝</span>
            Create Quote
          </button>
          <button className="deal-n-done-btn-secondary">
            <span>📊</span>
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Quotes List */}
        <div className="deal-n-done-card">
          {/* Filter Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Quotes ({quotes.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approved' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'expired' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Expired ({stats.expired})
              </button>
            </nav>
          </div>

          {/* Quotes Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {quote.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quote.customerName}</div>
                        <div className="text-sm text-gray-500">{quote.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${quote.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusText(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quote.validUntil).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => setSelectedQuote(quote)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Edit
                      </button>
                      <button className="text-purple-600 hover:text-purple-900">
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Quote Details - {selectedQuote.id}
                </h3>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedQuote.customerName}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedQuote.customerEmail}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Phone:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedQuote.customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Quote Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Quote Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQuote.status)}`}>
                        {getStatusText(selectedQuote.status)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Total Amount:</span>
                      <span className="ml-2 text-sm font-bold text-gray-900">${selectedQuote.totalAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Valid Until:</span>
                      <span className="ml-2 text-sm text-gray-900">{new Date(selectedQuote.validUntil).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Created:</span>
                      <span className="ml-2 text-sm text-gray-900">{new Date(selectedQuote.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Items */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Quote Items</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedQuote.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              {selectedQuote.notes && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedQuote.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                  Edit Quote
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                  Convert to Order
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">
                  Approve Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {showCreateQuote && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Quote</h3>
                <button
                  onClick={() => setShowCreateQuote(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Information Form */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input type="text" className="deal-n-done-input" placeholder="Enter customer name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="deal-n-done-input" placeholder="Enter email address" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" className="deal-n-done-input" placeholder="Enter phone number" />
                    </div>
                  </div>
                </div>

                {/* Quote Details Form */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Quote Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input type="date" className="deal-n-done-input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea className="deal-n-done-input" rows="3" placeholder="Enter any special notes or requirements"></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Selection */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Add Products</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Product selection functionality will be implemented here.</p>
                  <p className="text-sm text-gray-600">This will include product search, quantity selection, and pricing.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowCreateQuote(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                  Create Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesQuotes; 