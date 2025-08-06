import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  Crown, 
  Zap, 
  Globe, 
  Building,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  BarChart3,
  Settings,
  Shield,
  Clock
} from 'lucide-react';
import usageTracker from '../utils/usageTracking';

const PlanSelectionModal = ({ isOpen, onClose, triggerType = 'usage', onPlanSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usageStats, setUsageStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const stats = usageTracker.getUsageStats();
      const recs = usageTracker.getPlanRecommendations();
      setUsageStats(stats);
      setRecommendations(recs);
      
      // Auto-select recommended plan
      if (recs.length > 0) {
        setSelectedPlan(recs[0].plan);
      }
    }
  }, [isOpen]);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      period: 'month',
      description: 'Perfect for small stores',
      features: [
        '1 Outlet',
        '1,000 Products',
        'Basic POS',
        'Email Support',
        'Basic Reports',
        'Mobile App',
        'Offline Mode'
      ],
      icon: <Zap className="w-6 h-6" />,
      popular: false,
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 79,
      period: 'month',
      description: 'For growing businesses',
      features: [
        '5 Outlets',
        '10,000 Products',
        'Advanced POS',
        'Priority Support',
        'Advanced Analytics',
        'Multi-user Access',
        'Employee Management',
        'Loyalty Program',
        'Appointment Booking',
        'API Access'
      ],
      icon: <Crown className="w-6 h-6" />,
      popular: true,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 199,
      period: 'month',
      description: 'For large operations',
      features: [
        'Unlimited Outlets',
        'Unlimited Products',
        'Advanced POS',
        '24/7 Support',
        'Advanced Analytics',
        'Multi-user Access',
        'Custom Branding',
        'API Access',
        'White-label Options',
        'Dedicated Account Manager',
        'AI Forecasting',
        'Restaurant Features'
      ],
      icon: <Globe className="w-6 h-6" />,
      popular: false,
      color: 'green'
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Contact Us',
      period: '',
      description: 'For enterprise needs',
      features: [
        'Unlimited Everything',
        'Custom Integrations',
        'Dedicated Support',
        'Custom Development',
        'White-label Solution',
        'On-premise Option',
        'SLA Guarantee'
      ],
      icon: <Building className="w-6 h-6" />,
      popular: false,
      color: 'gray'
    }
  ];

  const getTriggerMessage = () => {
    switch (triggerType) {
      case 'usage':
        return 'Based on your usage, we recommend upgrading your plan to unlock more features.';
      case 'milestone':
        return 'Congratulations! You\'ve reached a milestone. Consider upgrading to continue growing.';
      case 'feature':
        return 'You\'re using advanced features. Upgrade to get the most out of DealNDone.';
      case 'manual':
        return 'Choose the plan that best fits your business needs.';
      default:
        return 'Select a plan that matches your business growth.';
    }
  };

  const getUsageBasedRecommendation = () => {
    if (!usageStats) return null;

    const { products, sales, features, daysActive } = usageStats;
    
    if (products >= 200 || sales >= 50) {
      return {
        plan: 'enterprise',
        reason: 'Large-scale operations detected',
        icon: <TrendingUp className="w-5 h-5" />
      };
    } else if (products >= 50 || sales >= 10) {
      return {
        plan: 'professional',
        reason: 'Growing business needs',
        icon: <BarChart3 className="w-5 h-5" />
      };
    } else if (products >= 3 || sales >= 1) {
      return {
        plan: 'basic',
        reason: 'Getting started',
        icon: <Star className="w-5 h-5" />
      };
    }
    
    return null;
  };

  const handlePlanSelect = async (planId) => {
    setSelectedPlan(planId);
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Track the upgrade
      usageTracker.trackFeature('plan_upgrade');
      
      // Call the callback
      onPlanSelect({
        plan: selectedPlan,
        usageStats,
        recommendations,
        upgradedAt: new Date().toISOString()
      });
      
      onClose();
    } catch (error) {
      console.error('Plan upgrade failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Track that user skipped
    usageTracker.trackFeature('plan_selection_skipped');
    onClose();
  };

  if (!isOpen) return null;

  const recommendation = getUsageBasedRecommendation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose Your Plan</h2>
              <p className="text-gray-600 mt-2">{getTriggerMessage()}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Usage Stats */}
          {usageStats && (
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{usageStats.products}</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{usageStats.sales}</div>
                    <div className="text-sm text-gray-600">Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{usageStats.features}</div>
                    <div className="text-sm text-gray-600">Features Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{usageStats.daysActive}</div>
                    <div className="text-sm text-gray-600">Days Active</div>
                  </div>
                </div>
                {recommendation && (
                  <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2">
                    {recommendation.icon}
                    <span className="text-sm font-medium text-gray-700">
                      Recommended: {plans.find(p => p.id === recommendation.plan)?.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isRecommended = recommendation?.plan === plan.id;
              const isSelected = selectedPlan === plan.id;
              
              return (
                <div
                  key={plan.id}
                  className={`relative border-2 rounded-lg p-6 transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {isRecommended && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-full bg-${plan.color}-100`}>
                        {plan.icon}
                      </div>
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

                  <ul className="space-y-2 mb-6">
                    {plan.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 6 && (
                      <li className="text-sm text-gray-500">
                        +{plan.features.length - 6} more features
                      </li>
                    )}
                  </ul>

                  <button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Upgrade?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">{rec.plan} Plan</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Maybe Later
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpgrade}
                disabled={!selectedPlan || loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Upgrading...
                  </>
                ) : (
                  <>
                    Upgrade Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal; 