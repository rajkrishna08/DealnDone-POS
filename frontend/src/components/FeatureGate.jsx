import React, { useState } from 'react';
import { 
  Lock, 
  Crown, 
  Zap, 
  Globe, 
  Building,
  ArrowUpRight,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const FeatureGate = ({ 
  children, 
  requiredPlan = 'basic', 
  currentPlan = 'free',
  featureName = 'Feature',
  onUpgrade,
  showUpgradePrompt = true,
  fallback = null
}) => {
  const [showModal, setShowModal] = useState(false);

  const planHierarchy = {
    'free': 0,
    'basic': 1,
    'professional': 2,
    'enterprise': 3,
    'custom': 4
  };

  const planInfo = {
    basic: {
      name: 'Basic',
      price: 29,
      icon: <Zap className="w-5 h-5" />,
      color: 'blue'
    },
    professional: {
      name: 'Professional',
      price: 79,
      icon: <Crown className="w-5 h-5" />,
      color: 'purple'
    },
    enterprise: {
      name: 'Enterprise',
      price: 199,
      icon: <Globe className="w-5 h-5" />,
      color: 'green'
    },
    custom: {
      name: 'Custom',
      price: 'Contact Us',
      icon: <Building className="w-5 h-5" />,
      color: 'gray'
    }
  };

  const hasAccess = planHierarchy[currentPlan] >= planHierarchy[requiredPlan];

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade(requiredPlan);
    } else {
      setShowModal(true);
    }
  };

  if (hasAccess) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  const requiredPlanInfo = planInfo[requiredPlan];

  return (
    <>
      <div className="relative">
        {/* Blurred Content */}
        <div className="filter blur-sm pointer-events-none opacity-50">
          {children}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {featureName} Requires {requiredPlanInfo.name} Plan
            </h3>
            <p className="text-gray-600 mb-4">
              Upgrade your plan to access this feature and unlock more capabilities.
            </p>
            
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to {requiredPlanInfo.name}
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full bg-${requiredPlanInfo.color}-100 mr-3`}>
                    {requiredPlanInfo.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Upgrade to {requiredPlanInfo.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Unlock {featureName} and more features
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Current Plan</span>
                  <span className="text-sm text-gray-500 capitalize">{currentPlan}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">Required Plan</span>
                  <span className="text-sm font-medium text-blue-700">{requiredPlanInfo.name}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-gray-900">What you'll get:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">{featureName}</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Advanced Analytics</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Priority Support</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-gray-700">Multi-user Access</span>
                  </li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleUpgrade();
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Higher-order component for feature gating
export const withFeatureGate = (WrappedComponent, options = {}) => {
  return (props) => (
    <FeatureGate {...options}>
      <WrappedComponent {...props} />
    </FeatureGate>
  );
};

// Feature gate for specific features
export const MarketplaceGate = ({ children, ...props }) => (
  <FeatureGate 
    requiredPlan="professional" 
    featureName="Marketplace Listings"
    {...props}
  >
    {children}
  </FeatureGate>
);

export const DropshippingGate = ({ children, ...props }) => (
  <FeatureGate 
    requiredPlan="professional" 
    featureName="Dropshipping"
    {...props}
  >
    {children}
  </FeatureGate>
);

export const AIForecastingGate = ({ children, ...props }) => (
  <FeatureGate 
    requiredPlan="enterprise" 
    featureName="AI Forecasting"
    {...props}
  >
    {children}
  </FeatureGate>
);

export const WhiteLabelGate = ({ children, ...props }) => (
  <FeatureGate 
    requiredPlan="enterprise" 
    featureName="White-label Options"
    {...props}
  >
    {children}
  </FeatureGate>
);

export const RestaurantGate = ({ children, ...props }) => (
  <FeatureGate 
    requiredPlan="enterprise" 
    featureName="Restaurant Features"
    {...props}
  >
    {children}
  </FeatureGate>
);

export default FeatureGate; 