import React, { useState } from 'react';
import dummyData from '../data/dummyData';

const StockReturns = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showCreateReturn, setShowCreateReturn] = useState(false);

  // Use centralized dummy data
  const { returns, suppliers } = dummyData.stockReturns;

  const [newReturn, setNewReturn] = useState({
    supplier: '',
    reason: '',
    items: []
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Stock Returns</h1>
          <div className="text-sm text-gray-500">
            Manage inventory returns to suppliers
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowCreateReturn(true)}
            className="deal-n-done-btn-primary"
          >
            <span>📦</span>
            New Return
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Return Requests
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Return History
              </button>
            </nav>
          </div>

          {activeTab === 'requests' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Requests</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Return ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Supplier</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Return Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Reason</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Items</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returns.map((returnItem) => (
                      <tr key={returnItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{returnItem.id}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.supplier}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.returnDate}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.reason}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(returnItem.status)}`}>
                            {returnItem.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">{returnItem.items.length} items</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                            <button className="text-green-600 hover:text-green-800 text-sm">Approve</button>
                            <button className="text-red-600 hover:text-red-800 text-sm">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Return History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Return ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Supplier</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Completed Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Reason</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Items</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returns.filter(r => r.status === 'Completed').map((returnItem) => (
                      <tr key={returnItem.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{returnItem.id}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.supplier}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.returnDate}</td>
                        <td className="py-3 px-4 text-gray-600">{returnItem.reason}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{returnItem.items.length} items</td>
                        <td className="py-3 px-4 text-center font-medium text-gray-900">
                          ${returnItem.totalValue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Return Modal */}
      {showCreateReturn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Return</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <select
                    value={newReturn.supplier}
                    onChange={(e) => setNewReturn({...newReturn, supplier: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier} value={supplier}>{supplier}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Reason</label>
                  <select
                    value={newReturn.reason}
                    onChange={(e) => setNewReturn({...newReturn, reason: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Reason</option>
                    <option value="Damaged goods">Damaged goods</option>
                    <option value="Wrong size received">Wrong size received</option>
                    <option value="Quality issues">Quality issues</option>
                    <option value="Wrong item received">Wrong item received</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Items</label>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Product name"
                      className="p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Reason"
                      className="p-2 border border-gray-300 rounded"
                    />
                    <button className="deal-n-done-btn-primary text-sm">Add Item</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateReturn(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button className="deal-n-done-btn-primary">
                Create Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockReturns; 