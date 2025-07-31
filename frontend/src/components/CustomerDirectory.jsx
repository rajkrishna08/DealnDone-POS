import React, { useState } from 'react';

const CustomerDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Dummy data for customers
  const customers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      status: 'Active',
      loyaltyTier: 'Gold',
      totalSpent: 2450.00,
      lastPurchase: '2025-01-28',
      joinDate: '2023-03-15',
      address: '123 Main St, New York, NY 10001',
      notes: 'Prefers premium products, responsive to email campaigns'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0124',
      status: 'Active',
      loyaltyTier: 'Silver',
      totalSpent: 1250.00,
      lastPurchase: '2025-01-25',
      joinDate: '2023-06-22',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      notes: 'Interested in sustainable products'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1-555-0125',
      status: 'Inactive',
      loyaltyTier: 'Bronze',
      totalSpent: 450.00,
      lastPurchase: '2024-11-15',
      joinDate: '2023-09-10',
      address: '789 Pine Rd, Chicago, IL 60601',
      notes: 'No recent activity, may need re-engagement'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1-555-0126',
      status: 'Active',
      loyaltyTier: 'Platinum',
      totalSpent: 5200.00,
      lastPurchase: '2025-01-30',
      joinDate: '2022-12-05',
      address: '321 Elm St, Miami, FL 33101',
      notes: 'VIP customer, high-value purchases'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1-555-0127',
      status: 'Active',
      loyaltyTier: 'Gold',
      totalSpent: 1800.00,
      lastPurchase: '2025-01-27',
      joinDate: '2023-04-18',
      address: '654 Maple Dr, Seattle, WA 98101',
      notes: 'Prefers online shopping'
    },
    {
      id: 6,
      name: 'Lisa Brown',
      email: 'lisa.brown@email.com',
      phone: '+1-555-0128',
      status: 'Active',
      loyaltyTier: 'Silver',
      totalSpent: 950.00,
      lastPurchase: '2025-01-20',
      joinDate: '2023-08-12',
      address: '987 Cedar Ln, Austin, TX 73301',
      notes: 'Interested in seasonal promotions'
    }
  ];

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    loyaltyTier: 'Bronze',
    notes: ''
  });

  const handleAddCustomer = () => {
    const customer = {
      id: Date.now(),
      ...newCustomer,
      status: 'Active',
      totalSpent: 0.00,
      lastPurchase: null,
      joinDate: new Date().toISOString().split('T')[0]
    };
    console.log('New customer added:', customer);
    setNewCustomer({ name: '', email: '', phone: '', address: '', loyaltyTier: 'Bronze', notes: '' });
    setShowAddCustomer(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoyaltyColor = (tier) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-purple-100 text-purple-800';
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Silver':
        return 'bg-gray-100 text-gray-800';
      case 'Bronze':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || customer.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Customer Directory</h1>
          <div className="text-sm text-gray-500">
            Manage your customer database and relationships
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddCustomer(true)}
            className="deal-n-done-btn-primary"
          >
            Add Customer
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('Active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'Active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter('Inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'Inactive'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loyalty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Purchase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLoyaltyColor(customer.loyaltyTier)}`}>
                        {customer.loyaltyTier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.lastPurchase ? customer.lastPurchase : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Customers</div>
                <div className="text-2xl font-semibold text-gray-900">{customers.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Active Customers</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {customers.filter(c => c.status === 'Active').length}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⭐</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">VIP Customers</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {customers.filter(c => c.loyaltyTier === 'Platinum').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Customer Modal */}
        {showAddCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Customer</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="2"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loyalty Tier</label>
                  <select
                    value={newCustomer.loyaltyTier}
                    onChange={(e) => setNewCustomer({...newCustomer, loyaltyTier: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    placeholder="Enter any notes about the customer"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddCustomer(false)}
                  className="deal-n-done-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomer}
                  className="deal-n-done-btn-primary"
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name:</span>
                      <div className="text-sm text-gray-900">{selectedCustomer.name}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <div className="text-sm text-gray-900">{selectedCustomer.email}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <div className="text-sm text-gray-900">{selectedCustomer.phone}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Address:</span>
                      <div className="text-sm text-gray-900">{selectedCustomer.address}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Loyalty Tier:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLoyaltyColor(selectedCustomer.loyaltyTier)}`}>
                        {selectedCustomer.loyaltyTier}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Total Spent:</span>
                      <div className="text-sm text-gray-900">${selectedCustomer.totalSpent.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Last Purchase:</span>
                      <div className="text-sm text-gray-900">{selectedCustomer.lastPurchase || 'Never'}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Join Date:</span>
                      <div className="text-sm text-gray-900">{selectedCustomer.joinDate}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedCustomer.notes && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedCustomer.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="deal-n-done-btn-secondary"
                >
                  Close
                </button>
                <button className="deal-n-done-btn-primary">
                  Edit Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDirectory; 