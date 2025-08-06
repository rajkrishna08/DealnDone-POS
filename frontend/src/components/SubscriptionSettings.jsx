import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowUpRight,
  Download,
  Settings,
  Crown,
  Zap,
  Globe,
  Building
} from 'lucide-react';

const SubscriptionSettings = ({ user, currentStore, onNavigate }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mock subscription data - replace with API call
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        // Simulate API call
        const mockSubscription = {
          plan: {
            id: 'professional',
            name: 'Professional',
            price: 79,
            period: 'month',
            features: [
              '2 Outlets',
              '10,000 Products',
              'Advanced POS',
              'Priority Support',
              'Advanced Analytics',
              'Multi-user Access',
              'Employee Management',
              'Loyalty Program',
              'Appointment Booking'
            ]
          },
          status: 'active',
          trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days left
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          autoRenew: true,
          paymentMethod: {
            type: 'card',
            last4: '4242',
            brand: 'Visa',
            expiry: '12/25'
          },
          usage: {
            outlets: 1,
            maxOutlets: 5,
            products: 150,
            maxProducts: 10000,
            users: 3,
            maxUsers: 10
          }
        };
        
        setSubscription(mockSubscription);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'Great for growing stores',
      features: [
        '1 Outlet',
        '1,000 Products',
        'Advanced POS',
        'Priority Support',
        'Basic Analytics'
      ],
      icon: <Zap className="w-6 h-6" />,
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      period: 'month',
      description: 'For established businesses',
      features: [
        '2 Outlets',
        '10,000 Products',
        'Advanced POS',
        'Priority Support',
        'Advanced Analytics',
        'Multi-user Access',
        'Employee Management',
        'Loyalty Program',
        'Appointment Booking'
      ],
      icon: <Crown className="w-6 h-6" />,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      description: 'For large franchises',
      features: [
        '5 Outlets',
        'Unlimited Products',
        'Advanced POS',
        '24/7 Support',
        'Advanced Analytics',
        'Multi-user Access',
        'Custom Branding',
        'API Access',
        'White-label Options',
        'Dedicated Account Manager',
        'Restaurant Features'
      ],
      icon: <Globe className="w-6 h-6" />,
      popular: false
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Contact Us',
      period: '',
      description: 'For enterprise needs',
      features: [
        'Unlimited Outlets',
        'Unlimited Products',
        'Custom Integrations',
        'Dedicated Support',
        'Custom Development',
        'White-label Solution',
        'On-premise Option'
      ],
      icon: <Building className="w-6 h-6" />,
      popular: false
    }
  ];

  const getTrialDaysLeft = () => {
    if (!subscription?.trialEnd) return 0;
    const daysLeft = Math.ceil((subscription.trialEnd - new Date()) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  };

  const getUsagePercentage = (current, max) => {
    if (max === -1) return 0; // Unlimited
    return Math.round((current / max) * 100);
  };

  const handleUpgrade = async (planId) => {
    setUpgrading(true);
    try {
      // Simulate upgrade API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update subscription
      const newPlan = plans.find(p => p.id === planId);
      setSubscription(prev => ({
        ...prev,
        plan: newPlan
      }));
      
      setShowUpgradeModal(false);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setUpgrading(false);
    }
  };

  const handleBillingUpdate = () => {
    // Navigate to billing update page
    onNavigate('billing-settings');
  };

  const handleDownloadInvoice = () => {
    // Download invoice logic
    console.log('Downloading invoice...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const trialDaysLeft = getTrialDaysLeft();
  const currentPlan = subscription?.plan;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="text-gray-600 mt-2">Manage your plan, billing, and payment methods</p>
        </div>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upgrade Plan
        </button>
      </div>

      {/* Trial Alert */}
      {trialDaysLeft > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Trial Ending Soon
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have {trialDaysLeft} days left in your trial. Upgrade now to retain access to all features.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Overview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Active
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{currentPlan?.name}</h3>
                <p className="text-gray-600">${currentPlan?.price}/{currentPlan?.period}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Next billing: {subscription?.nextBilling?.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Auto-renewal</p>
                <p className={`text-sm font-medium ${subscription?.autoRenew ? 'text-green-600' : 'text-red-600'}`}>
                  {subscription?.autoRenew ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            {/* Plan Features */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Included Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlan?.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Outlets</span>
                  <span className="text-sm text-gray-500">
                    {subscription?.usage.outlets}/{subscription?.usage.maxOutlets}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getUsagePercentage(subscription?.usage.outlets, subscription?.usage.maxOutlets)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Products</span>
                  <span className="text-sm text-gray-500">
                    {subscription?.usage.products}/{subscription?.usage.maxProducts}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${getUsagePercentage(subscription?.usage.products, subscription?.usage.maxProducts)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Users</span>
                  <span className="text-sm text-gray-500">
                    {subscription?.usage.users}/{subscription?.usage.maxUsers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${getUsagePercentage(subscription?.usage.users, subscription?.usage.maxUsers)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing & Payment */}
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {subscription?.paymentMethod.brand} •••• {subscription?.paymentMethod.last4}
                  </p>
                  <p className="text-xs text-gray-500">Expires {subscription?.paymentMethod.expiry}</p>
                </div>
              </div>
              <button
                onClick={handleBillingUpdate}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Update
              </button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing History</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">March 2024</p>
                  <p className="text-xs text-gray-500">Professional Plan</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">$79.00</span>
                  <button
                    onClick={handleDownloadInvoice}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">February 2024</p>
                  <p className="text-xs text-gray-500">Professional Plan</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">$79.00</span>
                  <button
                    onClick={handleDownloadInvoice}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <ArrowUpRight className="w-4 h-4 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Upgrade Plan</span>
                </div>
              </button>
              
              <button
                onClick={handleBillingUpdate}
                className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Settings className="w-4 h-4 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Billing Settings</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-lg p-6 ${
                    plan.id === currentPlan?.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-3">
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-blue-600">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {plan.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading || plan.id === currentPlan?.id}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      plan.id === currentPlan?.id
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {plan.id === currentPlan?.id ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSettings; 