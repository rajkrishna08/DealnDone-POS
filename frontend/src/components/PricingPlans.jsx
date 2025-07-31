import React, { useState } from 'react';

const PricingPlans = ({ currentPlan, onPlanChange }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for small businesses getting started',
      features: [
        '1 Store Location',
        'Basic POS Features',
        'Up to 100 Products',
        'Email Support',
        'Basic Reports',
        'Mobile App Access'
      ],
      limitations: [
        'Limited to 1 store',
        'No advanced analytics',
        'No multi-currency support'
      ],
      popular: false
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      period: 'month',
      description: 'Great for growing retail businesses',
      features: [
        '1 Store Location',
        'Advanced POS Features',
        'Unlimited Products',
        'Priority Email Support',
        'Advanced Reports & Analytics',
        'Multi-currency Support',
        'Inventory Management',
        'Customer Management',
        'Mobile App Access',
        'API Access'
      ],
      limitations: [
        'Limited to 1 store',
        'Contact us for additional stores'
      ],
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      period: 'month',
      description: 'For established businesses with multiple locations',
      features: [
        '1 Store Location',
        'All Starter Features',
        'Advanced Analytics',
        'Custom Reports',
        'Multi-location Management',
        'Advanced Inventory',
        'Customer Loyalty Program',
        'Integration Support',
        'Phone Support',
        'Custom Branding'
      ],
      limitations: [
        'Limited to 1 store',
        'Contact us for additional stores'
      ],
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      description: 'For large businesses and franchises',
      features: [
        'Unlimited Store Locations',
        'All Professional Features',
        'Warehouse Management',
        'Franchise Model Support',
        'Custom Integrations',
        'Dedicated Account Manager',
        '24/7 Priority Support',
        'Custom Development',
        'Advanced Security',
        'White-label Options'
      ],
      limitations: [
        'Custom pricing for additional features',
        'Requires consultation for setup'
      ],
      popular: false
    }
  ];

  const handlePlanSelect = (plan) => {
    if (plan.id === currentPlan.id) {
      return; // Can't select current plan
    }
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  const handleConfirmPlanChange = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onPlanChange(selectedPlan);
      setShowConfirmation(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Plan change failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPlan = () => {
    return plans.find(plan => plan.id === currentPlan.id) || plans[0];
  };

  const PlanCard = ({ plan, isCurrent = false }) => (
    <div className={`deal-n-done-card relative ${
      isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''
    }`}>
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Current Plan
          </span>
        </div>
      )}
      
      {plan.popular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">
            ${plan.price}
          </span>
          <span className="text-gray-500">/{plan.period}</span>
        </div>
        <p className="text-sm text-gray-600">{plan.description}</p>
      </div>

      <div className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <span className="material-icons text-green-600 text-sm mr-2">check</span>
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {plan.limitations && plan.limitations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Limitations:</h4>
          <div className="space-y-1">
            {plan.limitations.map((limitation, index) => (
              <div key={index} className="flex items-center">
                <span className="material-icons text-gray-400 text-sm mr-2">info</span>
                <span className="text-xs text-gray-500">{limitation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => handlePlanSelect(plan)}
        disabled={isCurrent}
        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          isCurrent
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'deal-n-done-btn-primary'
        }`}
      >
        {isCurrent ? 'Current Plan' : 'Select Plan'}
      </button>
    </div>
  );

  const ConfirmationDialog = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="deal-n-done-card max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Plan Change</h3>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Current Plan:</span>
            <span className="text-sm font-medium">{getCurrentPlan().name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">New Plan:</span>
            <span className="text-sm font-medium">{selectedPlan?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price Change:</span>
            <span className={`text-sm font-medium ${
              selectedPlan?.price > getCurrentPlan().price ? 'text-green-600' : 'text-red-600'
            }`}>
              {selectedPlan?.price > getCurrentPlan().price ? '+' : ''}
              ${selectedPlan?.price - getCurrentPlan().price}/month
            </span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <div className="flex">
            <span className="material-icons text-yellow-600 mr-2">warning</span>
            <div className="text-sm text-yellow-800">
              <strong>Important:</strong> Plan changes will be effective immediately. 
              Any unused features will be lost when downgrading.
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowConfirmation(false)}
            className="deal-n-done-btn-secondary flex-1"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPlanChange}
            disabled={isLoading}
            className="deal-n-done-btn-primary flex-1"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              'Confirm Change'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pricing Plans</h2>
          <p className="text-sm text-gray-500">Manage your subscription and plan features</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Current Plan</div>
          <div className="text-lg font-semibold text-gray-900">{getCurrentPlan().name}</div>
        </div>
      </div>

      {/* Current Plan Summary */}
      <div className="deal-n-done-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">${getCurrentPlan().price}</div>
            <div className="text-sm text-blue-700">Monthly Cost</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">1</div>
            <div className="text-sm text-green-700">Store Location</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{getCurrentPlan().features.length}</div>
            <div className="text-sm text-purple-700">Features Included</div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              isCurrent={plan.id === currentPlan.id}
            />
          ))}
        </div>
      </div>

      {/* Multi-Outlet Information */}
      <div className="deal-n-done-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="material-icons mr-2">store</span>
          Multi-Outlet Support
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Additional Stores</h4>
            <p className="text-sm text-gray-600 mb-4">
              Need more than one store location? Contact us for custom pricing based on your business needs.
            </p>
            <button className="deal-n-done-btn-secondary text-sm">
              <span className="material-icons text-sm mr-1">contact_support</span>
              Contact Sales
            </button>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Enterprise Features</h4>
            <p className="text-sm text-gray-600 mb-4">
              Warehouse management and franchise model support available for Enterprise customers.
            </p>
            <button className="deal-n-done-btn-secondary text-sm">
              <span className="material-icons text-sm mr-1">info</span>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && <ConfirmationDialog />}
    </div>
  );
};

export default PricingPlans; 