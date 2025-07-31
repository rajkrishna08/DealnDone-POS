import React, { useState } from 'react';

const LoyaltySettings = ({ onBackToSettings, user }) => {
  const [activeTab, setActiveTab] = useState('program');
  const [showAddReward, setShowAddReward] = useState(false);
  const [showAddTier, setShowAddTier] = useState(false);

  // Mock loyalty program data
  const [loyaltyProgram, setLoyaltyProgram] = useState({
    name: "Deal n Done Rewards",
    status: "active",
    pointsPerDollar: 1,
    pointsToDollar: 0.01,
    welcomeBonus: 100,
    minimumRedemption: 500,
    expirationMonths: 12
  });

  const [tiers, setTiers] = useState([
    {
      id: 1,
      name: "Bronze",
      minSpend: 0,
      pointsMultiplier: 1,
      benefits: ["Standard rewards", "Email updates"],
      color: "bg-amber-500"
    },
    {
      id: 2,
      name: "Silver",
      minSpend: 1000,
      pointsMultiplier: 1.2,
      benefits: ["20% bonus points", "Free shipping", "Birthday rewards"],
      color: "bg-gray-400"
    },
    {
      id: 3,
      name: "Gold",
      minSpend: 5000,
      pointsMultiplier: 1.5,
      benefits: ["50% bonus points", "Priority support", "Exclusive offers", "Free returns"],
      color: "bg-yellow-500"
    },
    {
      id: 4,
      name: "Platinum",
      minSpend: 10000,
      pointsMultiplier: 2,
      benefits: ["100% bonus points", "VIP events", "Personal account manager", "Early access"],
      color: "bg-purple-500"
    }
  ]);

  const [rewards, setRewards] = useState([
    {
      id: 1,
      name: "Discount Coupon",
      type: "percentage",
      value: 10,
      pointsCost: 1000,
      description: "10% off your next purchase",
      status: "active"
    },
    {
      id: 2,
      name: "Free Shipping",
      type: "shipping",
      value: 0,
      pointsCost: 500,
      description: "Free shipping on your next order",
      status: "active"
    },
    {
      id: 3,
      name: "Cash Back",
      type: "cash",
      value: 5,
      pointsCost: 500,
      description: "$5 cash back",
      status: "active"
    }
  ]);

  const [newReward, setNewReward] = useState({
    name: '',
    type: 'percentage',
    value: '',
    pointsCost: '',
    description: ''
  });

  const [newTier, setNewTier] = useState({
    name: '',
    minSpend: '',
    pointsMultiplier: '',
    benefits: []
  });

  const handleSaveProgram = () => {
    // Save loyalty program settings
    console.log('Saving loyalty program:', loyaltyProgram);
  };

  const handleAddReward = () => {
    const reward = {
      id: Date.now(),
      ...newReward,
      status: 'active'
    };
    setRewards([...rewards, reward]);
    setNewReward({ name: '', type: 'percentage', value: '', pointsCost: '', description: '' });
    setShowAddReward(false);
  };

  const handleAddTier = () => {
    const tier = {
      id: Date.now(),
      ...newTier,
      benefits: newTier.benefits.filter(benefit => benefit.trim() !== ''),
      color: 'bg-blue-500'
    };
    setTiers([...tiers, tier]);
    setNewTier({ name: '', minSpend: '', pointsMultiplier: '', benefits: [] });
    setShowAddTier(false);
  };

  const handleDeleteReward = (rewardId) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      setRewards(rewards.filter(reward => reward.id !== rewardId));
    }
  };

  const handleDeleteTier = (tierId) => {
    if (window.confirm('Are you sure you want to delete this tier?')) {
      setTiers(tiers.filter(tier => tier.id !== tierId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToSettings}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Back to settings"
          >
            <span className="material-icons">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loyalty Program</h1>
            <p className="text-gray-600">Configure customer rewards and engagement</p>
          </div>
        </div>
        <button
          onClick={handleSaveProgram}
          className="deal-n-done-btn-primary flex items-center"
        >
          <span className="material-icons mr-2">save</span>
          Save Settings
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('program')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'program'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Program Settings
        </button>
        <button
          onClick={() => setActiveTab('tiers')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tiers'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Tiers ({tiers.length})
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'rewards'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rewards ({rewards.length})
        </button>
      </div>

      {/* Program Settings Tab */}
      {activeTab === 'program' && (
        <div className="space-y-6">
          <div className="deal-n-done-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Name</label>
                <input
                  type="text"
                  value={loyaltyProgram.name}
                  onChange={(e) => setLoyaltyProgram({...loyaltyProgram, name: e.target.value})}
                  className="deal-n-done-input"
                  placeholder="Enter program name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={loyaltyProgram.status}
                  onChange={(e) => setLoyaltyProgram({...loyaltyProgram, status: e.target.value})}
                  className="deal-n-done-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          <div className="deal-n-done-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Points Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points per Dollar</label>
                <input
                  type="number"
                  step="0.1"
                  value={loyaltyProgram.pointsPerDollar}
                  onChange={(e) => setLoyaltyProgram({...loyaltyProgram, pointsPerDollar: parseFloat(e.target.value)})}
                  className="deal-n-done-input"
                  placeholder="1.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points to Dollar Value</label>
                <input
                  type="number"
                  step="0.001"
                  value={loyaltyProgram.pointsToDollar}
                  onChange={(e) => setLoyaltyProgram({...loyaltyProgram, pointsToDollar: parseFloat(e.target.value)})}
                  className="deal-n-done-input"
                  placeholder="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Bonus Points</label>
                <input
                  type="number"
                  value={loyaltyProgram.welcomeBonus}
                  onChange={(e) => setLoyaltyProgram({...loyaltyProgram, welcomeBonus: parseInt(e.target.value)})}
                  className="deal-n-done-input"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Redemption</label>
                <input
                  type="number"
                  value={loyaltyProgram.minimumRedemption}
                  onChange={(e) => setLoyaltyProgram({...loyaltyProgram, minimumRedemption: parseInt(e.target.value)})}
                  className="deal-n-done-input"
                  placeholder="500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points Expiration (months)</label>
                <input
                  type="number"
                  value={loyaltyProgram.expirationMonths}
                  onChange={(e) => setLoyaltyProgram({...loyaltyProgram, expirationMonths: parseInt(e.target.value)})}
                  className="deal-n-done-input"
                  placeholder="12"
                />
              </div>
            </div>
          </div>

          <div className="deal-n-done-card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Program Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <span className="material-icons text-blue-600 text-2xl mb-2">people</span>
                <p className="text-sm font-medium text-gray-900">Total Members</p>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <span className="material-icons text-green-600 text-2xl mb-2">stars</span>
                <p className="text-sm font-medium text-gray-900">Active Tiers</p>
                <p className="text-2xl font-bold text-green-600">{tiers.length}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <span className="material-icons text-purple-600 text-2xl mb-2">card_giftcard</span>
                <p className="text-sm font-medium text-gray-900">Available Rewards</p>
                <p className="text-2xl font-bold text-purple-600">{rewards.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tiers Tab */}
      {activeTab === 'tiers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Loyalty Tiers</h3>
            <button
              onClick={() => setShowAddTier(true)}
              className="deal-n-done-btn-primary flex items-center"
            >
              <span className="material-icons mr-2">add</span>
              Add Tier
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tiers.map((tier) => (
              <div key={tier.id} className="deal-n-done-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tier.color}`}>
                      <span className="text-white font-semibold text-sm">{tier.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{tier.name}</h4>
                      <p className="text-sm text-gray-600">Min spend: ${tier.minSpend.toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTier(tier.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Delete tier"
                  >
                    <span className="material-icons text-sm">delete</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Points Multiplier</span>
                    <span className="text-sm font-medium text-gray-900">{tier.pointsMultiplier}x</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Benefits</span>
                    <ul className="mt-2 space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-center">
                          <span className="material-icons text-green-600 text-sm mr-2">check</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Available Rewards</h3>
            <button
              onClick={() => setShowAddReward(true)}
              className="deal-n-done-btn-primary flex items-center"
            >
              <span className="material-icons mr-2">add</span>
              Add Reward
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rewards.map((reward) => (
              <div key={reward.id} className="deal-n-done-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{reward.name}</h4>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reward.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reward.status}
                    </span>
                    <button
                      onClick={() => handleDeleteReward(reward.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Delete reward"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{reward.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Value</span>
                    <span className="text-sm font-medium text-gray-900">
                      {reward.type === 'percentage' ? `${reward.value}%` : 
                       reward.type === 'cash' ? `$${reward.value}` : 
                       reward.type === 'shipping' ? 'Free' : reward.value}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Points Cost</span>
                    <span className="text-sm font-medium text-gray-900">{reward.pointsCost.toLocaleString()}</span>
                  </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Name</label>
                <input
                  type="text"
                  value={newReward.name}
                  onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                  className="deal-n-done-input"
                  placeholder="Enter reward name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newReward.type}
                  onChange={(e) => setNewReward({...newReward, type: e.target.value})}
                  className="deal-n-done-input"
                >
                  <option value="percentage">Percentage Discount</option>
                  <option value="cash">Cash Back</option>
                  <option value="shipping">Free Shipping</option>
                  <option value="product">Free Product</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={newReward.value}
                  onChange={(e) => setNewReward({...newReward, value: e.target.value})}
                  className="deal-n-done-input"
                  placeholder={newReward.type === 'percentage' ? '10' : '5'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points Cost</label>
                <input
                  type="number"
                  value={newReward.pointsCost}
                  onChange={(e) => setNewReward({...newReward, pointsCost: e.target.value})}
                  className="deal-n-done-input"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newReward.description}
                  onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                  className="deal-n-done-input"
                  rows="3"
                  placeholder="Enter reward description"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddReward(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReward}
                disabled={!newReward.name || !newReward.value || !newReward.pointsCost}
                className={`deal-n-done-btn-primary ${
                  !newReward.name || !newReward.value || !newReward.pointsCost ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Add Reward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tier Modal */}
      {showAddTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Tier</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tier Name</label>
                <input
                  type="text"
                  value={newTier.name}
                  onChange={(e) => setNewTier({...newTier, name: e.target.value})}
                  className="deal-n-done-input"
                  placeholder="Enter tier name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Spend</label>
                  <input
                    type="number"
                    value={newTier.minSpend}
                    onChange={(e) => setNewTier({...newTier, minSpend: e.target.value})}
                    className="deal-n-done-input"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Points Multiplier</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTier.pointsMultiplier}
                    onChange={(e) => setNewTier({...newTier, pointsMultiplier: e.target.value})}
                    className="deal-n-done-input"
                    placeholder="1.2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
                <textarea
                  value={newTier.benefits.join('\n')}
                  onChange={(e) => setNewTier({...newTier, benefits: e.target.value.split('\n')})}
                  className="deal-n-done-input"
                  rows="4"
                  placeholder="Enter benefits, one per line"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddTier(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTier}
                disabled={!newTier.name || !newTier.minSpend || !newTier.pointsMultiplier}
                className={`deal-n-done-btn-primary ${
                  !newTier.name || !newTier.minSpend || !newTier.pointsMultiplier ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Add Tier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltySettings; 