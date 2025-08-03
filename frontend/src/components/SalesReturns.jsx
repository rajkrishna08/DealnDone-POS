import React, { useState } from 'react';
import { 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Package,
  Eye,
  Edit,
  Plus,
  RefreshCw
} from 'lucide-react';

const SalesReturns = () => {
  const [returns] = useState([
    {
      id: 'RET-001',
      customerName: 'ABC Electronics',
      customerEmail: 'john@abcelectronics.com',
      customerPhone: '+1 (555) 123-4567',
      status: 'approved',
      reason: 'Defective Product',
      originalSaleId: 'SALE-001',
      totalAmount: 999.99,
      refundAmount: 999.99,
      returnDate: '2025-07-31',
      processedDate: '2025-08-01',
      items: [
        { name: 'iPhone 15 Pro', quantity: 1, price: 999.99, reason: 'Screen cracked', condition: 'damaged' }
      ],
      notes: 'Customer reported cracked screen upon delivery',
      refundMethod: 'Credit Card Refund'
    },
    {
      id: 'RET-002',
      customerName: 'Tech Solutions Inc',
      customerEmail: 'sarah@techsolutions.com',
      customerPhone: '+1 (555) 987-6543',
      status: 'pending',
      reason: 'Wrong Item Received',
      originalSaleId: 'SALE-002',
      totalAmount: 1299.98,
      refundAmount: 0,
      returnDate: '2025-08-01',
      processedDate: null,
      items: [
        { name: 'MacBook Air M2', quantity: 1, price: 1199.99, reason: 'Wrong color ordered', condition: 'good' },
        { name: 'Magic Mouse', quantity: 1, price: 99.99, reason: 'Not needed', condition: 'good' }
      ],
      notes: 'Customer ordered silver but received space gray',
      refundMethod: 'Store Credit'
    },
    {
      id: 'RET-003',
      customerName: 'Digital Marketing Co',
      customerEmail: 'mike@digitalmarketing.com',
      customerPhone: '+1 (555) 456-7890',
      status: 'rejected',
      reason: 'Customer Changed Mind',
      originalSaleId: 'SALE-003',
      totalAmount: 599.99,
      refundAmount: 0,
      returnDate: '2025-07-25',
      processedDate: '2025-07-26',
      items: [
        { name: 'iPad Air', quantity: 1, price: 599.99, reason: 'No longer needed', condition: 'good' }
      ],
      notes: 'Return rejected - outside 14-day return window',
      refundMethod: 'No Refund'
    }
  ]);

  const [selectedReturn, setSelectedReturn] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'processed': return <RefreshCw className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      case 'processed': return 'Processed';
      default: return 'Unknown';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      case 'refurbished': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReturns = returns.filter(returnItem => {
    if (activeTab === 'all') return true;
    return returnItem.status === activeTab;
  });

  const stats = {
    total: returns.length,
    approved: returns.filter(r => r.status === 'approved').length,
    pending: returns.filter(r => r.status === 'pending').length,
    rejected: returns.filter(r => r.status === 'rejected').length,
    totalValue: returns.reduce((sum, returnItem) => sum + returnItem.totalAmount, 0),
    refundedValue: returns.reduce((sum, returnItem) => sum + returnItem.refundAmount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Sales Returns</h1>
          <div className="text-sm text-gray-500">
            Manage product returns and refunds
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button className="deal-n-done-btn-secondary">
            <RotateCcw className="w-4 h-4 mr-2" />
            Export Returns
          </button>
          <button className="deal-n-done-btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Return
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <RotateCcw className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Returns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Return Value</h3>
            <p className="text-3xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">All return requests</p>
          </div>
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Refunded Amount</h3>
            <p className="text-3xl font-bold text-green-600">${stats.refundedValue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Processed refunds</p>
          </div>
        </div>

        {/* Returns Table */}
        <div className="deal-n-done-card">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Returns ({stats.total})
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
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rejected' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </nav>
          </div>

          {/* Returns Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReturns.map((returnItem) => (
                  <tr key={returnItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {returnItem.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{returnItem.customerName}</div>
                        <div className="text-sm text-gray-500">{returnItem.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {returnItem.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${returnItem.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(returnItem.status)}`}>
                        {getStatusIcon(returnItem.status)}
                        {getStatusText(returnItem.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {returnItem.returnDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedReturn(returnItem)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Return Detail Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Return Details</h2>
              <button
                onClick={() => setSelectedReturn(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedReturn.customerName}</p>
                  <p><strong>Email:</strong> {selectedReturn.customerEmail}</p>
                  <p><strong>Phone:</strong> {selectedReturn.customerPhone}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Information</h3>
                <div className="space-y-2">
                  <p><strong>Return ID:</strong> {selectedReturn.id}</p>
                  <p><strong>Original Sale:</strong> {selectedReturn.originalSaleId}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReturn.status)}`}>
                      {getStatusIcon(selectedReturn.status)}
                      {getStatusText(selectedReturn.status)}
                    </span>
                  </p>
                  <p><strong>Return Date:</strong> {selectedReturn.returnDate}</p>
                  <p><strong>Refund Method:</strong> {selectedReturn.refundMethod}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedReturn.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                            {item.condition}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Total Amount: ${selectedReturn.totalAmount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Refunded: ${selectedReturn.refundAmount.toFixed(2)}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="deal-n-done-btn-secondary">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Download Report
                  </button>
                  <button className="deal-n-done-btn-primary">
                    <Edit className="w-4 h-4 mr-2" />
                    Process Return
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReturns; 