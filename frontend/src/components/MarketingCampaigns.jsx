import React, { useState } from 'react';

const MarketingCampaigns = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Dummy data for marketing campaigns
  const campaigns = [
    {
      id: 'CAM-001',
      name: 'Summer Sale 2025',
      type: 'Email',
      status: 'Active',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      budget: 5000.00,
      spent: 3200.00,
      targetAudience: 'All Customers',
      openRate: 24.5,
      clickRate: 8.2,
      conversionRate: 3.1,
      revenue: 12500.00,
      description: 'Summer sale campaign targeting all customers with 20% discount on selected items'
    },
    {
      id: 'CAM-002',
      name: 'VIP Customer Exclusive',
      type: 'Email',
      status: 'Active',
      startDate: '2025-05-15',
      endDate: '2025-05-31',
      budget: 2000.00,
      spent: 1800.00,
      targetAudience: 'Platinum & Gold Members',
      openRate: 35.2,
      clickRate: 12.8,
      conversionRate: 6.5,
      revenue: 8500.00,
      description: 'Exclusive offer for VIP customers with early access to new products'
    },
    {
      id: 'CAM-003',
      name: 'Social Media Holiday',
      type: 'Social Media',
      status: 'Completed',
      startDate: '2024-12-01',
      endDate: '2024-12-25',
      budget: 3000.00,
      spent: 3000.00,
      targetAudience: 'Social Media Followers',
      openRate: 18.7,
      clickRate: 5.4,
      conversionRate: 2.8,
      revenue: 6800.00,
      description: 'Holiday season campaign on social media platforms'
    },
    {
      id: 'CAM-004',
      name: 'New Product Launch',
      type: 'Multi-Channel',
      status: 'Scheduled',
      startDate: '2025-02-15',
      endDate: '2025-03-15',
      budget: 8000.00,
      spent: 0.00,
      targetAudience: 'Premium Customers',
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0.00,
      description: 'Launch campaign for new premium product line'
    },
    {
      id: 'CAM-005',
      name: 'Re-engagement Campaign',
      type: 'Email',
      status: 'Draft',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      budget: 1500.00,
      spent: 0.00,
      targetAudience: 'Inactive Customers',
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0.00,
      description: 'Campaign to re-engage customers who haven\'t made a purchase in 6 months'
    }
  ];

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'Email',
    targetAudience: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: ''
  });

  const handleCreateCampaign = () => {
    const campaign = {
      id: `CAM-${Date.now()}`,
      ...newCampaign,
      status: 'Draft',
      spent: 0.00,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0.00
    };
    console.log('New campaign created:', campaign);
    setNewCampaign({ name: '', type: 'Email', targetAudience: '', startDate: '', endDate: '', budget: '', description: '' });
    setShowCreateCampaign(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Email':
        return 'bg-blue-100 text-blue-800';
      case 'Social Media':
        return 'bg-purple-100 text-purple-800';
      case 'Multi-Channel':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesFilter = activeTab === 'all' || campaign.status === activeTab;
    return matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Marketing Campaigns</h1>
          <div className="text-sm text-gray-500">
            Create and manage marketing campaigns across multiple channels
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowCreateCampaign(true)}
            className="deal-n-done-btn-primary"
          >
            Create Campaign
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📢</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Campaigns</div>
                <div className="text-2xl font-semibold text-gray-900">{campaigns.length}</div>
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
                <div className="text-sm font-medium text-gray-500">Active Campaigns</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {campaigns.filter(c => c.status === 'Active').length}
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
                <div className="text-sm font-medium text-gray-500">Total Budget</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📈</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Revenue</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${campaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('Active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'Active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('Scheduled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'Scheduled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setActiveTab('Completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'Completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('Draft')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'Draft'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Draft
            </button>
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(campaign.type)}`}>
                      {campaign.type}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Target Audience:</span>
                    <div className="text-sm text-gray-900">{campaign.targetAudience}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Budget:</span>
                    <div className="text-sm text-gray-900">${campaign.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Start Date:</span>
                    <div className="text-sm text-gray-900">{campaign.startDate}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">End Date:</span>
                    <div className="text-sm text-gray-900">{campaign.endDate}</div>
                  </div>
                </div>

                {/* Performance Metrics */}
                {campaign.status !== 'Draft' && campaign.status !== 'Scheduled' && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Open Rate:</span>
                        <div className="text-sm font-medium text-gray-900">{campaign.openRate}%</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Click Rate:</span>
                        <div className="text-sm font-medium text-gray-900">{campaign.clickRate}%</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Conversion Rate:</span>
                        <div className="text-sm font-medium text-gray-900">{campaign.conversionRate}%</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Revenue:</span>
                        <div className="text-sm font-medium text-gray-900">${campaign.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => setSelectedCampaign(campaign)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Campaign Modal */}
        {showCreateCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Campaign</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter campaign name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                  <select
                    value={newCampaign.type}
                    onChange={(e) => setNewCampaign({...newCampaign, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Email">Email</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Multi-Channel">Multi-Channel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <select
                    value={newCampaign.targetAudience}
                    onChange={(e) => setNewCampaign({...newCampaign, targetAudience: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select target audience</option>
                    <option value="All Customers">All Customers</option>
                    <option value="Platinum & Gold Members">Platinum & Gold Members</option>
                    <option value="Premium Customers">Premium Customers</option>
                    <option value="Inactive Customers">Inactive Customers</option>
                    <option value="Social Media Followers">Social Media Followers</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newCampaign.startDate}
                      onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter budget amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    placeholder="Enter campaign description"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateCampaign(false)}
                  className="deal-n-done-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="deal-n-done-btn-primary"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Campaign Detail Modal */}
        {selectedCampaign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Campaign Details - {selectedCampaign.name}</h3>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Campaign Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Campaign ID:</span>
                      <div className="text-sm text-gray-900">{selectedCampaign.id}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Type:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedCampaign.type)}`}>
                        {selectedCampaign.type}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCampaign.status)}`}>
                        {selectedCampaign.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Target Audience:</span>
                      <div className="text-sm text-gray-900">{selectedCampaign.targetAudience}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <div className="text-sm text-gray-900">{selectedCampaign.description}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Timeline & Budget</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Start Date:</span>
                      <div className="text-sm text-gray-900">{selectedCampaign.startDate}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">End Date:</span>
                      <div className="text-sm text-gray-900">{selectedCampaign.endDate}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Budget:</span>
                      <div className="text-sm text-gray-900">${selectedCampaign.budget.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Spent:</span>
                      <div className="text-sm text-gray-900">${selectedCampaign.spent.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedCampaign.status !== 'Draft' && selectedCampaign.status !== 'Scheduled' && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500">Open Rate</div>
                      <div className="text-2xl font-semibold text-gray-900">{selectedCampaign.openRate}%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500">Click Rate</div>
                      <div className="text-2xl font-semibold text-gray-900">{selectedCampaign.clickRate}%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
                      <div className="text-2xl font-semibold text-gray-900">{selectedCampaign.conversionRate}%</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500">Revenue</div>
                      <div className="text-2xl font-semibold text-gray-900">${selectedCampaign.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="deal-n-done-btn-secondary"
                >
                  Close
                </button>
                <button className="deal-n-done-btn-primary">
                  Edit Campaign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingCampaigns; 