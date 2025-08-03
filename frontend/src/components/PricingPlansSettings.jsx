import React, { useState, useEffect, useCallback } from 'react';

const PricingPlansSettings = ({ onBackToSettings }) => {
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [currentBillingCycle, setCurrentBillingCycle] = useState('monthly');
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [planDetails, setPlanDetails] = useState(null);

  // Simulate backend API call
  const fetchPlanFromBackend = useCallback(async (planType, billingCycle) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response based on plan type
    const planData = {
      planType: planType,
      billingCycle: billingCycle,
      nextBillingDate: getNextBillingDate(),
      usage: {
        registers: 1,
        outlets: 1,
        products: 150,
        customers: 45
      },
      limits: getPlanLimits(planType),
      status: 'active'
    };
    
    return planData;
  }, []);

  const getPlanLimits = (planType) => {
    const limits = {
      basic: {
        registers: 1,
        outlets: 1,
        products: 1000,
        customers: 500
      },
      professional: {
        registers: 3,
        outlets: 2,
        products: 10000,
        customers: 2000
      },
      enterprise: {
        registers: 10,
        outlets: 5,
        products: -1, // unlimited
        customers: -1 // unlimited
      },
      custom: {
        registers: -1, // unlimited
        outlets: -1, // unlimited
        products: -1, // unlimited
        customers: -1 // unlimited
      }
    };
    
    return limits[planType] || limits.basic;
  };

  const fetchCurrentPlan = useCallback(async () => {
    setIsLoadingPlan(true);
    try {
      // First try to get from localStorage
      const storeData = localStorage.getItem('storeData');
      const userData = localStorage.getItem('user');
      
      let planType = 'basic'; // default
      let billingCycle = 'monthly'; // default
      
      if (storeData) {
        const parsedStoreData = JSON.parse(storeData);
        planType = parsedStoreData.planType || 'basic';
      }
      
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        billingCycle = parsedUserData.billingCycle || 'monthly';
      }

      // In a real app, this would be an API call to /settings/plan
      // For now, we'll simulate the API call
      const mockApiResponse = await fetchPlanFromBackend(planType, billingCycle);
      
      setCurrentPlan(mockApiResponse.planType);
      setCurrentBillingCycle(mockApiResponse.billingCycle);
      setPlanDetails(mockApiResponse);
      
    } catch (error) {
      console.error('Error fetching plan:', error);
      // Fallback to localStorage data
      const storeData = localStorage.getItem('storeData');
      if (storeData) {
        const parsedStoreData = JSON.parse(storeData);
        setCurrentPlan(parsedStoreData.planType || 'basic');
      }
    } finally {
      setIsLoadingPlan(false);
    }
  }, [fetchPlanFromBackend]);

  // Fetch current plan from localStorage and backend
  useEffect(() => {
    fetchCurrentPlan();
  }, [fetchCurrentPlan]);

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'month',
      registers: 1,
      outlets: 1,
      features: [
        'Up to 1,000 products',
        'Basic inventory management',
        'Simple sales reports',
        'Email support',
        'Mobile app access',
        'Basic integrations'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      period: 'month',
      registers: 3,
      outlets: 2,
      features: [
        'Up to 10,000 products',
        'Advanced inventory management',
        'Detailed analytics & reports',
        'Priority email & phone support',
        'Multi-location support',
        'Advanced integrations',
        'Employee management',
        'Loyalty program'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      registers: 10,
      outlets: 5,
      features: [
        'Unlimited products',
        'Full inventory suite',
        'Custom reporting & analytics',
        '24/7 dedicated support',
        'Unlimited locations',
        'Custom integrations',
        'Advanced security',
        'API access',
        'White-label options',
        'Dedicated account manager'
      ],
      popular: false
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Contact Us',
      period: 'custom',
      registers: 'Unlimited',
      outlets: 'Unlimited',
      features: [
        'Custom feature development',
        'On-premise deployment',
        'Custom integrations',
        'Dedicated support team',
        'SLA guarantees',
        'Training & onboarding',
        'Custom branding',
        'Advanced security compliance'
      ],
      popular: false
    }
  ];

  const billingOptions = [
    { id: 'monthly', name: 'Monthly', discount: 0 },
    { id: 'quarterly', name: 'Quarterly (3 months)', discount: 10 },
    { id: 'half-yearly', name: 'Half-Yearly (6 months)', discount: 15 },
    { id: 'yearly', name: 'Yearly', discount: 25 }
  ];

  const currentPlanData = pricingPlans.find(plan => plan.id === currentPlan);

  const handlePlanChange = async () => {
    if (!selectedNewPlan) {
      alert('Please select a new plan');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to change plan
      console.log('Changing plan from', currentPlan, 'to', selectedNewPlan);
      
      setTimeout(() => {
        setCurrentPlan(selectedNewPlan);
        setShowChangePlan(false);
        setSelectedNewPlan('');
        alert('Plan changed successfully! Your new plan will be effective from the next billing cycle.');
      }, 2000);

    } catch (error) {
      console.error('Plan change error:', error);
      alert('Failed to change plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextBillingDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return nextMonth.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToSettings}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="deal-n-done-header title">Billing & Subscription</h1>
          <div className="text-sm text-gray-500">
            Manage your subscription and billing
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {isLoadingPlan ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your plan details...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Plan */}
            <div className="lg:col-span-1">
              <div className="deal-n-done-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
                
                {currentPlanData && planDetails && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Plan Name</span>
                        <span className="text-lg font-bold text-gray-900">{currentPlanData.name}</span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Monthly Price</span>
                        <span className="text-lg font-bold text-gray-900">
                          {typeof currentPlanData?.price === 'number' ? `$${currentPlanData.price}` : currentPlanData?.price}
                        </span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Billing Cycle</span>
                        <span className="text-lg font-bold text-gray-900 capitalize">{currentBillingCycle}</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Next Billing Date</span>
                        <span className="text-lg font-bold text-gray-900">{planDetails.nextBillingDate}</span>
                      </div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <span className="text-lg font-bold text-green-600 capitalize">{planDetails.status}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Plan Limits */}
              <div className="deal-n-done-card mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Limits</h3>
                {planDetails && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Registers</span>
                      <span className="text-sm font-bold text-gray-900">
                        {planDetails.usage.registers} / {planDetails.limits.registers === -1 ? '∞' : planDetails.limits.registers}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Outlets</span>
                      <span className="text-sm font-bold text-gray-900">
                        {planDetails.usage.outlets} / {planDetails.limits.outlets === -1 ? '∞' : planDetails.limits.outlets}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Products</span>
                      <span className="text-sm font-bold text-gray-900">
                        {planDetails.usage.products} / {planDetails.limits.products === -1 ? '∞' : planDetails.limits.products}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Customers</span>
                      <span className="text-sm font-bold text-gray-900">
                        {planDetails.usage.customers} / {planDetails.limits.customers === -1 ? '∞' : planDetails.limits.customers}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          {/* Available Plans */}
          <div className="lg:col-span-2">
            <div className="deal-n-done-card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Plans</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${
                      currentPlan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <div className="text-3xl font-bold text-gray-900">
                        {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                        <span className="text-sm font-normal text-gray-600">/{plan.period}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">{plan.registers} Register{plan.registers !== 1 ? 's' : ''}</span> • <span className="font-medium">{plan.outlets} Outlet{plan.outlets !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {currentPlan === plan.id ? (
                      <div className="text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Current Plan
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedNewPlan(plan.id);
                          setShowChangePlan(true);
                        }}
                        className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                      >
                        Select Plan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Billing Cycle Management */}
        <div className="mt-6">
          <div className="deal-n-done-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Cycle Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Billing Cycle */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Billing Cycle</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Current Cycle</span>
                    <span className="text-lg font-bold text-gray-900 capitalize">{currentBillingCycle}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Next billing: {getNextBillingDate()}
                  </div>
                </div>
              </div>

              {/* Billing Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Billing Cycle</h3>
                <div className="space-y-3">
                  {billingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        currentBillingCycle === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => setCurrentBillingCycle(option.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{option.name}</div>
                          {option.discount > 0 && (
                            <div className="text-sm text-green-600">Save {option.discount}%</div>
                          )}
                        </div>
                        <div className="text-right">
                          {currentBillingCycle === option.id ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current
                            </span>
                          ) : (
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Select
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Register & Outlet Management */}
        <div className="mt-6">
          <div className="deal-n-done-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Register & Outlet Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Registers */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Registers</h3>
                  <button
                    onClick={() => alert('Add Register functionality not implemented yet')}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                  >
                    Add Register
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Register 1</span>
                    <span className="text-sm text-gray-600">Main Store</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Register 2</span>
                    <span className="text-sm text-gray-600">Back Counter</span>
                  </div>
                </div>
              </div>

              {/* Outlets */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Outlets</h3>
                  <button
                    onClick={() => alert('Add Outlet functionality not implemented yet')}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                  >
                    Add Outlet
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Main Store</span>
                    <span className="text-sm text-gray-600">Downtown</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Branch Store</span>
                    <span className="text-sm text-gray-600">Uptown</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="mt-6">
          <div className="deal-n-done-card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing History</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-600">Jan 30, 2025</td>
                    <td className="py-3 px-4 text-gray-600">Monthly Plan - January 2025</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">$49.00</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Download
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-600">Dec 30, 2024</td>
                    <td className="py-3 px-4 text-gray-600">Monthly Plan - December 2024</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">$49.00</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Download
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Change Plan Modal */}
        {showChangePlan && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Change Subscription Plan
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Plan
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span className="font-medium text-gray-900">
                        {currentPlanData?.name} - ${currentPlanData?.price}/{currentPlanData?.period}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Plan
                    </label>
                    <select
                      value={selectedNewPlan}
                      onChange={(e) => setSelectedNewPlan(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a plan</option>
                      {pricingPlans
                        .filter(plan => plan.id !== currentPlan)
                        .map(plan => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.price}/{plan.period}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Plan changes will take effect at the next billing cycle. 
                      You will be charged the prorated difference.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowChangePlan(false);
                      setSelectedNewPlan('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlanChange}
                    disabled={isLoading || !selectedNewPlan}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Changing Plan...' : 'Change Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPlansSettings; 