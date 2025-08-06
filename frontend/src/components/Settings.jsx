import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Building,
  Zap,
  Crown,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Settings = ({ onNavigate, user, currentStore }) => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [usage, setUsage] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const response = await fetch('/api/user/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(data);
        setUsage({
          outlets: data.current_outlets || 0,
          products: data.current_products || 0,
          employees: data.current_employees || 0
        });
      } else {
        setError('Failed to load plan information');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$29',
      period: '/month',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-blue-500',
      limits: {
        outlets: 1,
        products: 1000,
        employees: 5
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$79',
      period: '/month',
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-purple-500',
      limits: {
        outlets: 2,
        products: 10000,
        employees: 15
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-green-500',
      limits: {
        outlets: 5,
        products: -1, // Unlimited
        employees: 50
      }
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Contact Us',
      period: '',
      icon: <Building className="w-6 h-6" />,
      color: 'bg-gray-500',
      limits: {
        outlets: -1, // Unlimited
        products: -1, // Unlimited
        employees: -1 // Unlimited
      }
    }
  ];

  const getCurrentPlan = () => {
    return plans.find(p => p.id === currentPlan?.plan_type) || plans[0];
  };

  const getUsagePercentage = (current, max) => {
    if (max === -1) return 0; // Unlimited
    return Math.min((current / max) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  const currentPlanData = getCurrentPlan();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and subscription</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Current Plan</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Details */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg ${currentPlanData.color} text-white mr-4`}>
                {currentPlanData.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{currentPlanData.name}</h3>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">{currentPlanData.price}</span>
                  <span className="text-gray-500 ml-1">{currentPlanData.period}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                {currentPlanData.limits.outlets === -1 ? 'Unlimited Outlets' : `${currentPlanData.limits.outlets} Outlets`}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                {currentPlanData.limits.products === -1 ? 'Unlimited Products' : `${currentPlanData.limits.products.toLocaleString()} Products`}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                {currentPlanData.limits.employees === -1 ? 'Unlimited Employees' : `${currentPlanData.limits.employees} Employees`}
              </div>
            </div>
          </div>

          {/* Usage Meters */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-4">Usage</h4>
            
            {/* Outlets Usage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Building className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Outlets</span>
                </div>
                <span className="text-sm text-gray-500">
                  {usage.outlets} / {currentPlanData.limits.outlets === -1 ? '∞' : currentPlanData.limits.outlets}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.outlets, currentPlanData.limits.outlets)).split(' ')[1]}`}
                  style={{ width: `${getUsagePercentage(usage.outlets, currentPlanData.limits.outlets)}%` }}
                ></div>
          </div>
      </div>

            {/* Products Usage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Products</span>
                </div>
                <span className="text-sm text-gray-500">
                  {usage.products.toLocaleString()} / {currentPlanData.limits.products === -1 ? '∞' : currentPlanData.limits.products.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.products, currentPlanData.limits.products)).split(' ')[1]}`}
                  style={{ width: `${getUsagePercentage(usage.products, currentPlanData.limits.products)}%` }}
                ></div>
              </div>
              </div>

            {/* Employees Usage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Employees</span>
                </div>
                <span className="text-sm text-gray-500">
                  {usage.employees} / {currentPlanData.limits.employees === -1 ? '∞' : currentPlanData.limits.employees}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getUsageColor(getUsagePercentage(usage.employees, currentPlanData.limits.employees)).split(' ')[1]}`}
                  style={{ width: `${getUsagePercentage(usage.employees, currentPlanData.limits.employees)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border-2 rounded-lg p-4 transition-all ${
                plan.id === currentPlanData.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className={`inline-flex p-3 rounded-lg ${plan.color} text-white mb-3`}>
                  {plan.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                
                <ul className="text-xs text-gray-600 space-y-1 mb-4">
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                    {plan.limits.outlets === -1 ? 'Unlimited Outlets' : `${plan.limits.outlets} Outlets`}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                    {plan.limits.products === -1 ? 'Unlimited Products' : `${plan.limits.products.toLocaleString()} Products`}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                    {plan.limits.employees === -1 ? 'Unlimited Employees' : `${plan.limits.employees} Employees`}
                  </li>
                </ul>
                
                {plan.id === currentPlanData.id ? (
                  <div className="text-blue-600 text-sm font-medium">Current Plan</div>
                ) : (
                  <button className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                    Upgrade
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input
                type="text"
                value={currentStore?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subdomain</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={currentStore?.subdomain ? `${currentStore.subdomain}.dealndone.com` : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
                <button className="ml-2 text-blue-600 hover:text-blue-700 text-sm">
                  Edit
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={user?.role || 'Owner'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
              <input
                type="text"
                value={currentPlan?.created_at ? new Date(currentPlan.created_at).toLocaleDateString() : ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
            </div>
          </div>
          </div>
        </div>
    </div>
  );
};

export default Settings; 