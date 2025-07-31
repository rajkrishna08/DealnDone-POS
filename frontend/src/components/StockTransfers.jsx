import React, { useState } from 'react';

const StockTransfers = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [showCreateTransfer, setShowCreateTransfer] = useState(false);
  const [transfers, setTransfers] = useState([
    {
      id: 'TR-001',
      fromLocation: 'Main Store',
      toLocation: 'Downtown Branch',
      transferDate: '2025-01-30',
      status: 'In Transit',
      items: [
        { product: 'Classic White Shirt', quantity: 20, currentStock: 45 },
        { product: 'Blue Oxford Shirt', quantity: 15, currentStock: 32 }
      ],
      totalValue: 1050
    },
    {
      id: 'TR-002',
      fromLocation: 'Warehouse',
      toLocation: 'Main Store',
      transferDate: '2025-01-28',
      status: 'Completed',
      items: [
        { product: 'Denim Jeans', quantity: 30, currentStock: 28 }
      ],
      totalValue: 1350
    },
    {
      id: 'TR-003',
      fromLocation: 'Main Store',
      toLocation: 'Online Store',
      transferDate: '2025-01-25',
      status: 'Completed',
      items: [
        { product: 'Leather Belt', quantity: 25, currentStock: 0 },
        { product: 'Silk Scarf', quantity: 10, currentStock: 15 }
      ],
      totalValue: 750
    }
  ]);

  const [locations] = useState([
    'Main Store', 'Downtown Branch', 'Warehouse', 'Online Store', 'Outlet Mall', 'Airport Location'
  ]);

  const [newTransfer, setNewTransfer] = useState({
    fromLocation: '',
    toLocation: '',
    items: []
  });

  const handleCreateTransfer = () => {
    const transfer = {
      id: `TR-${Date.now()}`,
      fromLocation: newTransfer.fromLocation,
      toLocation: newTransfer.toLocation,
      transferDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      items: newTransfer.items,
      totalValue: newTransfer.items.reduce((sum, item) => sum + (item.quantity * 25), 0)
    };
    setTransfers([transfer, ...transfers]);
    setNewTransfer({ fromLocation: '', toLocation: '', items: [] });
    setShowCreateTransfer(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Stock Transfers</h1>
          <div className="text-sm text-gray-500">
            Manage inventory transfers between locations
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowCreateTransfer(true)}
            className="deal-n-done-btn-primary"
          >
            Create Transfer
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transfer Orders
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transfer History
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'orders' && (
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Transfer Orders</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transfer ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transfer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.fromLocation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.toLocation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transfer.transferDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transfer.status)}`}>
                          {transfer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${transfer.totalValue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="deal-n-done-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer History</h3>
            
            <div className="space-y-4">
              {transfers.filter(t => t.status === 'Completed').map((transfer) => (
                <div key={transfer.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{transfer.id}</h4>
                      <p className="text-sm text-gray-500">
                        {transfer.fromLocation} → {transfer.toLocation}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${transfer.totalValue}</p>
                      <p className="text-xs text-gray-500">{transfer.transferDate}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {transfer.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product}</span>
                        <span className="text-gray-900">{item.quantity} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Transfer Modal */}
      {showCreateTransfer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Transfer</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Location
                </label>
                <select
                  value={newTransfer.fromLocation}
                  onChange={(e) => setNewTransfer({...newTransfer, fromLocation: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Location
                </label>
                <select
                  value={newTransfer.toLocation}
                  onChange={(e) => setNewTransfer({...newTransfer, toLocation: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items to Transfer
                </label>
                <div className="border border-gray-300 rounded-md p-3">
                  <p className="text-sm text-gray-500">Add items to transfer list</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                    + Add Item
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateTransfer(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTransfer}
                className="deal-n-done-btn-primary"
              >
                Create Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTransfers; 