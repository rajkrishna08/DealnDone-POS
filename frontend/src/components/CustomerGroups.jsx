import React, { useState } from 'react';

const CustomerGroups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showAssignCustomers, setShowAssignCustomers] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  // Dummy data for customer groups
  const customerGroups = [
    {
      id: 1,
      name: 'VIP Customers',
      description: 'High-value customers with premium loyalty tier',
      memberCount: 45,
      totalRevenue: 125000.00,
      avgOrderValue: 2780.00,
      createdDate: '2024-01-15',
      criteria: 'Loyalty Tier: Platinum, Total Spent > $5000',
      tags: ['VIP', 'Premium', 'High-Value'],
      status: 'Active',
      lastActivity: '2025-01-30'
    },
    {
      id: 2,
      name: 'New Customers',
      description: 'Customers who joined in the last 30 days',
      memberCount: 128,
      totalRevenue: 45000.00,
      avgOrderValue: 350.00,
      createdDate: '2024-12-01',
      criteria: 'Join Date: Last 30 days',
      tags: ['New', 'Onboarding'],
      status: 'Active',
      lastActivity: '2025-01-29'
    },
    {
      id: 3,
      name: 'Inactive Customers',
      description: 'Customers with no activity in 90+ days',
      memberCount: 234,
      totalRevenue: 89000.00,
      avgOrderValue: 380.00,
      createdDate: '2024-06-15',
      criteria: 'Last Purchase: 90+ days ago',
      tags: ['Inactive', 'Re-engagement'],
      status: 'Active',
      lastActivity: '2024-10-15'
    },
    {
      id: 4,
      name: 'Seasonal Shoppers',
      description: 'Customers who shop during specific seasons',
      memberCount: 89,
      totalRevenue: 67000.00,
      avgOrderValue: 750.00,
      createdDate: '2024-03-20',
      criteria: 'Purchase Pattern: Seasonal',
      tags: ['Seasonal', 'Targeted'],
      status: 'Active',
      lastActivity: '2025-01-25'
    },
    {
      id: 5,
      name: 'Online Shoppers',
      description: 'Customers who prefer online shopping',
      memberCount: 156,
      totalRevenue: 98000.00,
      avgOrderValue: 630.00,
      createdDate: '2024-02-10',
      criteria: 'Channel Preference: Online',
      tags: ['Online', 'Digital'],
      status: 'Active',
      lastActivity: '2025-01-28'
    },
    {
      id: 6,
      name: 'Bulk Buyers',
      description: 'Customers who make large quantity purchases',
      memberCount: 67,
      totalRevenue: 145000.00,
      avgOrderValue: 2160.00,
      createdDate: '2024-04-05',
      criteria: 'Order Size: 10+ items per order',
      tags: ['Bulk', 'Wholesale'],
      status: 'Active',
      lastActivity: '2025-01-27'
    }
  ];

  // Dummy data for customers (for assignment modal)
  const allCustomers = [
    { id: 1, name: 'John Smith', email: 'john.smith@email.com', status: 'Active', loyaltyTier: 'Gold' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@email.com', status: 'Active', loyaltyTier: 'Silver' },
    { id: 3, name: 'Mike Chen', email: 'mike.chen@email.com', status: 'Inactive', loyaltyTier: 'Bronze' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@email.com', status: 'Active', loyaltyTier: 'Platinum' },
    { id: 5, name: 'David Wilson', email: 'david.wilson@email.com', status: 'Active', loyaltyTier: 'Gold' },
    { id: 6, name: 'Lisa Brown', email: 'lisa.brown@email.com', status: 'Active', loyaltyTier: 'Silver' }
  ];

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    criteria: '',
    tags: []
  });

  const handleAddGroup = () => {
    const group = {
      id: Date.now(),
      ...newGroup,
      memberCount: 0,
      totalRevenue: 0.00,
      avgOrderValue: 0.00,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      lastActivity: new Date().toISOString().split('T')[0]
    };
    console.log('New group added:', group);
    setNewGroup({ name: '', description: '', criteria: '', tags: [] });
    setShowAddGroup(false);
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

  const filteredGroups = customerGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || group.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCustomerSelection = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleAssignCustomers = () => {
    console.log('Assigning customers to group:', selectedGroup.id, selectedCustomers);
    setShowAssignCustomers(false);
    setSelectedCustomers([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Customer Groups</h1>
          <div className="text-sm text-gray-500">
            Organize customers into targeted groups for marketing and analytics
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddGroup(true)}
            className="deal-n-done-btn-primary"
          >
            Create Group
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
                placeholder="Search groups by name or description..."
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

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {group.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(group.status)}`}>
                  {group.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Members</div>
                  <div className="text-lg font-semibold text-gray-900">{group.memberCount}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Revenue</div>
                  <div className="text-lg font-semibold text-gray-900">${group.totalRevenue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Avg Order</div>
                  <div className="text-lg font-semibold text-gray-900">${group.avgOrderValue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Last Activity</div>
                  <div className="text-sm text-gray-900">{group.lastActivity}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-xs text-gray-500 mb-2">Criteria: {group.criteria}</div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowAssignCustomers(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    Assign Customers
                  </button>
                  <button 
                    onClick={() => setSelectedGroup(group)}
                    className="text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
                    Send Campaign
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Groups</div>
                <div className="text-2xl font-semibold text-gray-900">{customerGroups.length}</div>
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
                <div className="text-sm font-medium text-gray-500">Active Groups</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {customerGroups.filter(g => g.status === 'Active').length}
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
                  ${customerGroups.reduce((sum, g) => sum + g.totalRevenue, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Avg Group Size</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {Math.round(customerGroups.reduce((sum, g) => sum + g.memberCount, 0) / customerGroups.length)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Group Modal */}
        {showAddGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Customer Group</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter group name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    placeholder="Describe the group and its purpose"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Criteria</label>
                  <textarea
                    value={newGroup.criteria}
                    onChange={(e) => setNewGroup({...newGroup, criteria: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="2"
                    placeholder="e.g., Loyalty Tier: Gold, Total Spent > $1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newGroup.tags.join(', ')}
                    onChange={(e) => setNewGroup({...newGroup, tags: e.target.value.split(',').map(tag => tag.trim())})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="VIP, Premium, High-Value"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddGroup(false)}
                  className="deal-n-done-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroup}
                  className="deal-n-done-btn-primary"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Group Details Modal */}
        {selectedGroup && !showAssignCustomers && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Group Details: {selectedGroup.name}</h3>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Group Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Name:</span>
                      <div className="text-sm text-gray-900">{selectedGroup.name}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <div className="text-sm text-gray-900">{selectedGroup.description}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Criteria:</span>
                      <div className="text-sm text-gray-900">{selectedGroup.criteria}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Created:</span>
                      <div className="text-sm text-gray-900">{selectedGroup.createdDate}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Analytics</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Member Count:</span>
                      <div className="text-sm text-gray-900">{selectedGroup.memberCount}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Total Revenue:</span>
                      <div className="text-sm text-gray-900">${selectedGroup.totalRevenue.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Average Order Value:</span>
                      <div className="text-sm text-gray-900">${selectedGroup.avgOrderValue.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Last Activity:</span>
                      <div className="text-sm text-gray-900">{selectedGroup.lastActivity}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedGroup.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="deal-n-done-btn-secondary"
                >
                  Close
                </button>
                <button 
                  onClick={() => setShowAssignCustomers(true)}
                  className="deal-n-done-btn-primary"
                >
                  Assign Customers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Customers Modal */}
        {showAssignCustomers && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Assign Customers to: {selectedGroup.name}</h3>
                <button
                  onClick={() => setShowAssignCustomers(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleCustomerSelection(customer.id)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {customer.loyaltyTier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAssignCustomers(false)}
                  className="deal-n-done-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignCustomers}
                  className="deal-n-done-btn-primary"
                >
                  Assign {selectedCustomers.length} Customers
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerGroups; 