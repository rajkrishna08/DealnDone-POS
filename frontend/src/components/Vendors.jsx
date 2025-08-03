import React, { useState } from 'react';

const Vendors = () => {
  const [activeTab, setActiveTab] = useState('vendors');
  const [showAddVendor, setShowAddVendor] = useState(false);

  // Use centralized dummy data
  const [vendors] = useState([
    {
      id: 1,
      name: 'Fashion Wholesale Co.',
      contact: 'John Doe',
      email: 'info@fashionwholesale.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Suite 456',
      notes: 'Good quality products, competitive pricing.',
      rating: 4.5,
      totalOrders: 150,
      totalSpent: 250000,
    },
    {
      id: 2,
      name: 'Accessories Plus',
      contact: 'Jane Smith',
      email: 'sales@accessoriesplus.com',
      phone: '(555) 987-6543',
      address: '789 Oak Ave, #102',
      notes: 'Excellent customer service, fast shipping.',
      rating: 4.8,
      totalOrders: 100,
      totalSpent: 180000,
    },
    {
      id: 3,
      name: 'Tech Gadgets',
      contact: 'Mike Johnson',
      email: 'info@techgadgets.com',
      phone: '(555) 112-3579',
      address: '456 Pine Ln, #201',
      notes: 'Reliable supplier, good communication.',
      rating: 4.2,
      totalOrders: 80,
      totalSpent: 120000,
    },
  ]);

  const [newVendor, setNewVendor] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Vendors</h1>
          <div className="text-sm text-gray-500">
            Manage suppliers and vendor relationships
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddVendor(true)}
            className="deal-n-done-btn-primary"
          >
            <span>➕</span>
            New Vendor
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('vendors')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vendors'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vendors
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'performance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Performance
              </button>
            </nav>
          </div>

          {activeTab === 'vendors' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
                        <p className="text-sm text-gray-600">{vendor.contact}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">{vendor.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Email:</span> {vendor.email}</p>
                      <p><span className="font-medium">Phone:</span> {vendor.phone}</p>
                      <p><span className="font-medium">Orders:</span> {vendor.totalOrders}</p>
                      <p><span className="font-medium">Total Spent:</span> ${vendor.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="deal-n-done-btn-primary text-sm">Edit</button>
                      <button className="deal-n-done-btn-secondary text-sm">View Orders</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="deal-n-done-card">
                  <h4 className="font-semibold text-gray-900 mb-2">Top Vendor</h4>
                  <p className="text-2xl font-bold text-blue-600">Fashion Wholesale Co.</p>
                  <p className="text-sm text-gray-600">$45,000 total spent</p>
                </div>
                <div className="deal-n-done-card">
                  <h4 className="font-semibold text-gray-900 mb-2">Best Rating</h4>
                  <p className="text-2xl font-bold text-green-600">Accessories Plus</p>
                  <p className="text-sm text-gray-600">4.8/5 stars</p>
                </div>
                <div className="deal-n-done-card">
                  <h4 className="font-semibold text-gray-900 mb-2">Most Orders</h4>
                  <p className="text-2xl font-bold text-purple-600">Accessories Plus</p>
                  <p className="text-sm text-gray-600">32 orders</p>
                </div>
              </div>
              <div className="deal-n-done-card">
                <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Vendor</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Rating</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Orders</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Total Spent</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-600">Avg Order Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.map((vendor) => (
                        <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{vendor.name}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-600 ml-1">{vendor.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">{vendor.totalOrders}</td>
                          <td className="py-3 px-4 text-center font-medium text-gray-900">
                            ${vendor.totalSpent.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-600">
                            ${Math.round(vendor.totalSpent / vendor.totalOrders).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Vendor Modal */}
      {showAddVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Vendor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                <input
                  type="text"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  placeholder="Enter vendor name"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={newVendor.contact}
                  onChange={(e) => setNewVendor({...newVendor, contact: e.target.value})}
                  placeholder="Enter contact name"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                  placeholder="Enter email address"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                  placeholder="Enter phone number"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                  placeholder="Enter address"
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newVendor.notes}
                  onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                  placeholder="Enter notes"
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddVendor(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button className="deal-n-done-btn-primary">
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors; 