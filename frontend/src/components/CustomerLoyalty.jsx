import React, { useState } from 'react';

const CustomerLoyalty = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddReward, setShowAddReward] = useState(false);
  const [showAddTier, setShowAddTier] = useState(false);

  // Dummy data for loyalty tiers
  const loyaltyTiers = [
    {
      id: 1,
      name: 'Bronze',
      minSpend: 0,
      maxSpend: 999,
      pointsMultiplier: 1,
      benefits: ['Basic rewards', 'Email updates', 'Birthday discount'],
      memberCount: 1250,
      avgPoints: 150,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 2,
      name: 'Silver',
      minSpend: 1000,
      maxSpend: 4999,
      pointsMultiplier: 1.5,
      benefits: ['Enhanced rewards', 'Priority support', 'Free shipping'],
      memberCount: 450,
      avgPoints: 450,
      color: 'bg-gray-100 text-gray-800'
    },
    {
      id: 3,
      name: 'Gold',
      minSpend: 5000,
      maxSpend: 19999,
      pointsMultiplier: 2,
      benefits: ['Premium rewards', 'VIP support', 'Free returns', 'Early access'],
      memberCount: 180,
      avgPoints: 1200,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 4,
      name: 'Platinum',
      minSpend: 20000,
      maxSpend: null,
      pointsMultiplier: 3,
      benefits: ['Elite rewards', '24/7 support', 'Concierge service', 'Exclusive events'],
      memberCount: 45,
      avgPoints: 3500,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  // Dummy data for rewards
  const rewards = [
    {
      id: 1,
      name: 'Birthday Discount',
      description: '20% off on customer birthday',
      pointsCost: 0,
      discountType: 'percentage',
      discountValue: 20,
      tierRestriction: 'all',
      isActive: true,
      redemptionCount: 234
    },
    {
      id: 2,
      name: 'Free Shipping',
      description: 'Free shipping on any order',
      pointsCost: 100,
      discountType: 'fixed',
      discountValue: 15,
      tierRestriction: 'Silver+',
      isActive: true,
      redemptionCount: 156
    },
    {
      id: 3,
      name: 'Double Points Day',
      description: 'Earn double points on purchases',
      pointsCost: 200,
      discountType: 'multiplier',
      discountValue: 2,
      tierRestriction: 'Gold+',
      isActive: true,
      redemptionCount: 89
    }
  ];

  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    pointsCost: 0,
    discountType: 'percentage',
    discountValue: 0,
    tierRestriction: 'all'
  });

  const handleAddReward = () => {
    const reward = {
      id: Date.now(),
      ...newReward,
      isActive: true,
      redemptionCount: 0
    };
    console.log('New reward added:', reward);
    setNewReward({ name: '', description: '', pointsCost: 0, discountType: 'percentage', discountValue: 0, tierRestriction: 'all' });
    setShowAddReward(false);
  };

  const getTierColor = (tierName) => {
    const tier = loyaltyTiers.find(t => t.name === tierName);
    return tier ? tier.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Customer Loyalty</h1>
          <div className="text-sm text-gray-500">
            Manage loyalty tiers, rewards, and member benefits
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddReward(true)}
            className="deal-n-done-btn-primary"
          >
            Add Reward
          </button>
          <button 
            onClick={() => setShowAddTier(true)}
            className="deal-n-done-btn-secondary"
          >
            Add Tier
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'tiers', 'rewards'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Total Members</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {loyaltyTiers.reduce((sum, tier) => sum + tier.memberCount, 0)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⭐</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Active Rewards</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {rewards.filter(r => r.isActive).length}
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
                    <div className="text-sm font-medium text-gray-500">Total Redemptions</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {rewards.reduce((sum, r) => sum + r.redemptionCount, 0)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🏆</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">VIP Members</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {loyaltyTiers.filter(t => t.name === 'Platinum').reduce((sum, t) => sum + t.memberCount, 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loyalty Tier Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loyaltyTiers.map((tier) => (
                  <div key={tier.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tier.color}`}>
                        {tier.name}
                      </span>
                      <span className="text-sm text-gray-500">{tier.memberCount} members</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">
                        Spend: ${tier.minSpend.toLocaleString()}{tier.maxSpend ? ` - $${tier.maxSpend.toLocaleString()}` : '+'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Multiplier: {tier.pointsMultiplier}x
                      </div>
                      <div className="text-sm text-gray-600">
                        Avg Points: {tier.avgPoints}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tiers Tab */}
        {activeTab === 'tiers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loyaltyTiers.map((tier) => (
                <div key={tier.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tier.color}`}>
                      {tier.memberCount} members
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Spend Range:</span>
                      <div className="text-sm text-gray-900">
                        ${tier.minSpend.toLocaleString()}{tier.maxSpend ? ` - $${tier.maxSpend.toLocaleString()}` : '+'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Points Multiplier:</span>
                      <div className="text-sm text-gray-900">{tier.pointsMultiplier}x</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Average Points:</span>
                      <div className="text-sm text-gray-900">{tier.avgPoints}</div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Benefits:</span>
                    <ul className="mt-2 space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Edit Tier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div key={reward.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{reward.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      reward.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reward.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Points Cost:</span>
                      <span className="text-sm text-gray-900">{reward.pointsCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Discount:</span>
                      <span className="text-sm text-gray-900">
                        {reward.discountType === 'percentage' ? `${reward.discountValue}%` :
                         reward.discountType === 'fixed' ? `$${reward.discountValue}` :
                         reward.discountType === 'multiplier' ? `${reward.discountValue}x` :
                         'Special Event'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Tier Restriction:</span>
                      <span className="text-sm text-gray-900">{reward.tierRestriction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Redemptions:</span>
                      <span className="text-sm text-gray-900">{reward.redemptionCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                      {reward.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Reward Modal */}
        {showAddReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Reward</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reward Name</label>
                  <input
                    type="text"
                    value={newReward.name}
                    onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter reward name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newReward.description}
                    onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                    placeholder="Describe the reward"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points Cost</label>
                  <input
                    type="number"
                    value={newReward.pointsCost}
                    onChange={(e) => setNewReward({...newReward, pointsCost: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={newReward.discountType}
                    onChange={(e) => setNewReward({...newReward, discountType: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="multiplier">Points Multiplier</option>
                    <option value="event">Special Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={newReward.discountValue}
                    onChange={(e) => setNewReward({...newReward, discountValue: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tier Restriction</label>
                  <select
                    value={newReward.tierRestriction}
                    onChange={(e) => setNewReward({...newReward, tierRestriction: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="all">All Tiers</option>
                    <option value="Silver+">Silver and Above</option>
                    <option value="Gold+">Gold and Above</option>
                    <option value="Platinum">Platinum Only</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddReward(false)}
                  className="deal-n-done-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReward}
                  className="deal-n-done-btn-primary"
                >
                  Add Reward
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerLoyalty; 