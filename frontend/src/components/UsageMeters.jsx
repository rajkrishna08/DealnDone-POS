import React, { useState, useEffect } from 'react';

const UsageMeters = ({ onBackToSettings }) => {
  const [usage, setUsage] = useState({
    outlets: { used: 2, limit: 3, percentage: 67 },
    products: { used: 450, limit: 500, percentage: 90 },
    employees: { used: 8, limit: 10, percentage: 80 },
    storage: { used: 2.5, limit: 5, percentage: 50, unit: 'GB' },
    apiCalls: { used: 8500, limit: 10000, percentage: 85 },
    transactions: { used: 1200, limit: 1500, percentage: 80 }
  });

  const [currentPlan, setCurrentPlan] = useState({
    name: 'Pro',
    price: 79,
    billingCycle: 'monthly',
    nextBilling: '2025-02-01',
    features: [
      'Up to 3 outlets',
      '500 products',
      '10 employees',
      '5GB storage',
      '10,000 API calls/month',
      '1,500 transactions/month'
    ]
  });

  const [upgradePlans, setUpgradePlans] = useState([
    {
      name: 'Enterprise',
      price: 199,
      billingCycle: 'monthly',
      features: [
        'Unlimited outlets',
        'Unlimited products',
        'Unlimited employees',
        '50GB storage',
        'Unlimited API calls',
        'Unlimited transactions'
      ],
      popular: true
    },
    {
      name: 'Business',
      price: 129,
      billingCycle: 'monthly',
      features: [
        'Up to 10 outlets',
        '2,000 products',
        '25 employees',
        '20GB storage',
        '50,000 API calls/month',
        '5,000 transactions/month'
      ]
    }
  ]);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUsageData();
    loadPlanData();
  }, []);

  const loadUsageData = async () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('No user data found');
        return;
      }

      const user = JSON.parse(userData);
      const orgId = user.id; // For demo, using user ID as org ID

              const response = await fetch(`http://127.0.0.1:8005/api/auth/usage/${orgId}`);
      if (response.ok) {
        const data = await response.json();
        
        // Transform backend data to match component structure
        const transformedUsage = {
          outlets: {
            used: data.outlets?.used || 0,
            limit: data.outlets?.limit || 3,
            percentage: data.outlets?.percentage || 0
          },
          products: {
            used: data.products?.used || 0,
            limit: data.products?.limit || 500,
            percentage: data.products?.percentage || 0
          },
          employees: {
            used: data.employees?.used || 0,
            limit: data.employees?.limit || 10,
            percentage: data.employees?.percentage || 0
          },
          storage: {
            used: data.storage_gb?.used || 0,
            limit: data.storage_gb?.limit || 5,
            percentage: data.storage_gb?.percentage || 0,
            unit: 'GB'
          },
          apiCalls: {
            used: data.api_calls?.used || 0,
            limit: data.api_calls?.limit || 10000,
            percentage: data.api_calls?.percentage || 0
          },
          transactions: {
            used: data.transactions?.used || 0,
            limit: data.transactions?.limit || 1500,
            percentage: data.transactions?.percentage || 0
          }
        };
        
        setUsage(transformedUsage);
      }
    } catch (error) {
      console.error('Error loading usage data:', error);
    }
  };

  const loadPlanData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/settings/organization/123/plan');
      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(data);
      }
    } catch (error) {
      console.error('Error loading plan data:', error);
    }
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleUpgrade = async (plan) => {
    setSelectedUpgradePlan(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedUpgradePlan) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/settings/organization/123/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedUpgradePlan.name,
          billingCycle: selectedUpgradePlan.billingCycle
        })
      });

      if (response.ok) {
        alert(`Successfully upgraded to ${selectedUpgradePlan.name} plan!`);
        setShowUpgradeModal(false);
        loadPlanData(); // Refresh plan data
      } else {
        alert('Failed to upgrade plan. Please try again.');
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('Error upgrading plan');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const UsageMeter = ({ title, used, limit, percentage, unit = '', showUpgrade = false }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUsageColor(percentage)}`}>
          {percentage}% used
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {formatNumber(used)} / {formatNumber(limit)} {unit}
          </span>
          <span className="text-gray-900 font-medium">
            {formatNumber(limit - used)} {unit} remaining
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>

        {showUpgrade && percentage >= 75 && (
          <button
            onClick={() => handleUpgrade(upgradePlans[0])}
            className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Upgrade Plan
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <button 
            onClick={onBackToSettings}
            className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
          >
            ← Back to Settings
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Usage & Limits</h2>
          <p className="text-sm text-gray-500">Monitor your plan usage and upgrade when needed</p>
        </div>
      </div>

      {/* Current Plan Summary */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan: {currentPlan.name}</h3>
            <p className="text-sm text-gray-500">
              ${currentPlan.price}/{currentPlan.billingCycle} • Next billing: {currentPlan.nextBilling}
            </p>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Upgrade Plan
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UsageMeter
          title="Outlets"
          used={usage.outlets.used}
          limit={usage.outlets.limit}
          percentage={usage.outlets.percentage}
          showUpgrade={true}
        />
        <UsageMeter
          title="Products"
          used={usage.products.used}
          limit={usage.products.limit}
          percentage={usage.products.percentage}
          showUpgrade={true}
        />
        <UsageMeter
          title="Employees"
          used={usage.employees.used}
          limit={usage.employees.limit}
          percentage={usage.employees.percentage}
          showUpgrade={true}
        />
        <UsageMeter
          title="Storage"
          used={usage.storage.used}
          limit={usage.storage.limit}
          percentage={usage.storage.percentage}
          unit={usage.storage.unit}
          showUpgrade={true}
        />
        <UsageMeter
          title="API Calls"
          used={usage.apiCalls.used}
          limit={usage.apiCalls.limit}
          percentage={usage.apiCalls.percentage}
          showUpgrade={true}
        />
        <UsageMeter
          title="Transactions"
          used={usage.transactions.used}
          limit={usage.transactions.limit}
          percentage={usage.transactions.percentage}
          showUpgrade={true}
        />
      </div>

      {/* Usage Analytics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((usage.outlets.used / usage.outlets.limit) * 100)}%
            </div>
            <div className="text-sm text-gray-500">Outlet Utilization</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((usage.products.used / usage.products.limit) * 100)}%
            </div>
            <div className="text-sm text-gray-500">Product Catalog Usage</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((usage.transactions.used / usage.transactions.limit) * 100)}%
            </div>
            <div className="text-sm text-gray-500">Transaction Volume</div>
          </div>
        </div>
      </div>

      {/* Upgrade Plans */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upgradePlans.map((plan, index) => (
            <div key={index} className={`p-6 border rounded-lg ${plan.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h4 className="text-xl font-semibold text-gray-900">{plan.name}</h4>
                <div className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-500">/{plan.billingCycle}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan)}
                className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upgrade to {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upgrade to {selectedUpgradePlan?.name}
            </h3>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${selectedUpgradePlan?.price}/{selectedUpgradePlan?.billingCycle}
                </div>
                <p className="text-sm text-gray-500">
                  Your billing cycle will remain the same
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">New Features:</h4>
                {selectedUpgradePlan?.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpgrade}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Upgrading...' : 'Confirm Upgrade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageMeters; 