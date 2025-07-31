import React, { useState } from 'react';

const LandingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'Perfect for small businesses just getting started',
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
      description: 'Ideal for growing businesses with multiple locations',
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
      description: 'For large businesses with complex needs',
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
      period: '',
      description: 'Tailored solutions for enterprise needs',
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

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleGetStarted = (planId) => {
    if (planId === 'custom') {
      console.log('Contact sales team');
    } else {
      console.log(`Selected plan: ${planId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Pricing Plans</h1>
          <div className="text-sm text-gray-500">
            Choose the perfect plan for your business
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your business needs. All plans include our core POS features with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                selectedPlan === plan.id ? 'border-blue-500 shadow-blue-100' : 'border-gray-200'
              } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    {typeof plan.price === 'number' ? (
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-500 ml-1">/{plan.period}</span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-900">{plan.price}</div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    selectedPlan === plan.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>

                {selectedPlan === plan.id && (
                  <button
                    onClick={() => handleGetStarted(plan.id)}
                    className="w-full mt-3 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h4>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-gray-600 text-sm">
                Yes, we offer a 14-day free trial on all plans. No credit card required to start.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer discounts for annual billing?</h4>
              <p className="text-gray-600 text-sm">
                Yes, annual plans come with a 20% discount compared to monthly billing.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need a custom solution?
          </h3>
          <p className="text-gray-600 mb-6">
            Contact our sales team to discuss your specific requirements
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 