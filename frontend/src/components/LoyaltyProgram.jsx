import React, { useState } from 'react';

const LoyaltyProgram = () => {
  const [loyaltySettings, setLoyaltySettings] = useState({
    enabled: true,
    pointsPerDollar: 1,
    pointsToRedeem: 100,
    dollarValuePerPoint: 0.01,
    signupBonus: 50,
    birthdayBonus: 100,
    tier1Name: 'Bronze',
    tier1Threshold: 0,
    tier1Discount: 0,
    tier2Name: 'Silver',
    tier2Threshold: 1000,
    tier2Discount: 5,
    tier3Name: 'Gold',
    tier3Threshold: 5000,
    tier3Discount: 10,
    tier4Name: 'Platinum',
    tier4Threshold: 10000,
    tier4Discount: 15,
    autoEnrollment: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [rewards, setRewards] = useState([
    {
      id: 1,
      name: '$5 Off Purchase',
      pointsRequired: 500,
      description: 'Get $5 off your next purchase',
      active: true,
      usageCount: 45
    },
    {
      id: 2,
      name: 'Free Shipping',
      pointsRequired: 200,
      description: 'Free shipping on your next order',
      active: true,
      usageCount: 23
    },
    {
      id: 3,
      name: '20% Off Electronics',
      pointsRequired: 1000,
      description: '20% discount on electronics category',
      active: true,
      usageCount: 12
    },
    {
      id: 4,
      name: 'Free Product',
      pointsRequired: 300,
      description: 'Get a free product up to $10 value',
      active: false,
      usageCount: 8
    }
  ]);

  const [showAddReward, setShowAddReward] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    pointsRequired: '',
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Loyalty program settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReward = () => {
    const reward = {
      id: Date.now(),
      ...newReward,
      pointsRequired: parseInt(newReward.pointsRequired),
      active: true,
      usageCount: 0
    };
    setRewards([...rewards, reward]);
    setNewReward({ name: '', pointsRequired: '', description: '' });
    setShowAddReward(false);
  };

  const toggleRewardStatus = (rewardId) => {
    setRewards(rewards.map(reward =>
      reward.id === rewardId
        ? { ...reward, active: !reward.active }
        : reward
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Loyalty Program</h1>
          <div className="text-sm text-gray-500">
            Configure customer rewards and points system
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="deal-n-done-btn-primary"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Settings
              </>
            )}
          </button>
          <button 
            onClick={() => setShowAddReward(true)}
            className="deal-n-done-btn-secondary"
          >
            <span>🎁</span>
            Add Reward
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
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Rewards</p>
                <p className="text-2xl font-bold text-gray-900">{rewards.filter(r => r.active).length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points Redeemed</p>
                <p className="text-2xl font-bold text-gray-900">45,230</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue Impact</p>
                <p className="text-2xl font-bold text-gray-900">+12.5%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
                Program Settings
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Rewards
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Tiers
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Analytics
              </button>
            </nav>
          </div>

          {/* Program Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Program Settings</h3>
            
            {/* Basic Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enable Loyalty Program
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={loyaltySettings.enabled}
                    onChange={(e) => setLoyaltySettings({...loyaltySettings, enabled: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Active</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points per Dollar
                </label>
                <input
                  type="number"
                  value={loyaltySettings.pointsPerDollar}
                  onChange={(e) => setLoyaltySettings({...loyaltySettings, pointsPerDollar: parseFloat(e.target.value)})}
                  min="0"
                  step="0.1"
                  className="deal-n-done-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points to Redeem
                </label>
                <input
                  type="number"
                  value={loyaltySettings.pointsToRedeem}
                  onChange={(e) => setLoyaltySettings({...loyaltySettings, pointsToRedeem: parseInt(e.target.value)})}
                  min="1"
                  className="deal-n-done-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dollar Value per Point
                </label>
                <input
                  type="number"
                  value={loyaltySettings.dollarValuePerPoint}
                  onChange={(e) => setLoyaltySettings({...loyaltySettings, dollarValuePerPoint: parseFloat(e.target.value)})}
                  min="0"
                  step="0.01"
                  className="deal-n-done-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signup Bonus Points
                </label>
                <input
                  type="number"
                  value={loyaltySettings.signupBonus}
                  onChange={(e) => setLoyaltySettings({...loyaltySettings, signupBonus: parseInt(e.target.value)})}
                  min="0"
                  className="deal-n-done-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday Bonus Points
                </label>
                <input
                  type="number"
                  value={loyaltySettings.birthdayBonus}
                  onChange={(e) => setLoyaltySettings({...loyaltySettings, birthdayBonus: parseInt(e.target.value)})}
                  min="0"
                  className="deal-n-done-input"
                />
              </div>
            </div>

            {/* Tier Settings */}
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Tier Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">{loyaltySettings.tier1Name}</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Threshold</label>
                      <input
                        type="number"
                        value={loyaltySettings.tier1Threshold}
                        onChange={(e) => setLoyaltySettings({...loyaltySettings, tier1Threshold: parseInt(e.target.value)})}
                        min="0"
                        className="deal-n-done-input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        value={loyaltySettings.tier1Discount}
                        onChange={(e) => setLoyaltySettings({...loyaltySettings, tier1Discount: parseInt(e.target.value)})}
                        min="0"
                        max="100"
                        className="deal-n-done-input text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">{loyaltySettings.tier2Name}</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Threshold</label>
                      <input
                        type="number"
                        value={loyaltySettings.tier2Threshold}
                        onChange={(e) => setLoyaltySettings({...loyaltySettings, tier2Threshold: parseInt(e.target.value)})}
                        min="0"
                        className="deal-n-done-input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        value={loyaltySettings.tier2Discount}
                        onChange={(e) => setLoyaltySettings({...loyaltySettings, tier2Discount: parseInt(e.target.value)})}
                        min="0"
                        max="100"
                        className="deal-n-done-input text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">{loyaltySettings.tier3Name}</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Threshold</label>
                      <input
                        type="number"
                        value={loyaltySettings.tier3Threshold}
                        onChange={(e) => setLoyaltySettings({...loyaltySettings, tier3Threshold: parseInt(e.target.value)})}
                        min="0"
                        className="deal-n-done-input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        value={loyaltySettings.tier3Discount}
                        onChange={(e) => setLoyaltySettings({...loyaltySettings, tier3Discount: parseInt(e.target.value)})}
                        min="0"
                        max="100"
                        className="deal-n-done-input text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">{loyaltySettings.tier4Name}</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Threshold</label>
                      <input
                        type="number"
                        value={loyaltySettings.tier4Threshold}
                        onChange={(e) => setLoyaltySettings({...loyaltySettings, tier4Threshold: parseInt(e.target.value)})}
                        min="0"
                        className="deal-n-done-input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        value={loyaltySettings.tier4Discount}
                        onChange={(e) => setLoyaltySettings({...loyaltySettings, tier4Discount: parseInt(e.target.value)})}
                        min="0"
                        max="100"
                        className="deal-n-done-input text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="mt-8">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Notification Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={loyaltySettings.autoEnrollment}
                    onChange={(e) => setLoyaltySettings({...loyaltySettings, autoEnrollment: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Auto-enroll new customers</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={loyaltySettings.emailNotifications}
                    onChange={(e) => setLoyaltySettings({...loyaltySettings, emailNotifications: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Email notifications</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={loyaltySettings.smsNotifications}
                    onChange={(e) => setLoyaltySettings({...loyaltySettings, smsNotifications: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">SMS notifications</label>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rewards</h3>
              <button 
                onClick={() => setShowAddReward(true)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Reward
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <div key={reward.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      reward.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {reward.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <p><span className="font-medium">Points Required:</span> {reward.pointsRequired}</p>
                    <p><span className="font-medium">Usage Count:</span> {reward.usageCount}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleRewardStatus(reward.id)}
                      className={`px-3 py-1 text-xs rounded-md ${
                        reward.active 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {reward.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.includes('successfully') ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

        {/* Add Reward Modal */}
        {showAddReward && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Reward</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reward Name</label>
                    <input
                      type="text"
                      value={newReward.name}
                      onChange={(e) => setNewReward({...newReward, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points Required</label>
                    <input
                      type="number"
                      value={newReward.pointsRequired}
                      onChange={(e) => setNewReward({...newReward, pointsRequired: e.target.value})}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newReward.description}
                      onChange={(e) => setNewReward({...newReward, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddReward(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddReward}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Add Reward
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default LoyaltyProgram; 