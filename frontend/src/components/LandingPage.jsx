import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Crown, 
  Globe, 
  Shield, 
  Users, 
  BarChart3,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        '1 Outlet',
        '50 Products',
        'Basic POS',
        'Email Support'
      ],
      icon: <Star className="w-6 h-6" />,
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '$29',
      period: '/month',
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
      price: '$79',
      period: '/month',
      description: 'For established businesses',
      features: [
        '2 Outlets',
        '10,000 Products',
        'Advanced POS',
        'Priority Support',
        'Advanced Analytics',
        'Multi-user Access',
        'Employee Management',
        'Loyalty Program'
      ],
      icon: <Crown className="w-6 h-6" />,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
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
        'Dedicated Account Manager'
      ],
      icon: <Globe className="w-6 h-6" />,
      popular: false
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Contact Us',
      period: '',
      description: 'Tailored solutions',
      features: [
        'Unlimited Outlets',
        'Unlimited Products',
        'Custom Development',
        'On-premise Deployment',
        'Custom Integrations',
        'Dedicated Support Team',
        'SLA Guarantees',
        'Training & Onboarding',
        'Custom Branding',
        'Advanced Security Compliance'
      ],
      icon: <Crown className="w-6 h-6" />,
      popular: false
    }
  ];

  // Real-time subdomain availability check
  useEffect(() => {
    if (storeName.length >= 3) {
      setError("");
      checkSubdomainAvailability(storeName);
    } else {
      setIsSubdomainAvailable(null);
      setError("");
    }
  }, [storeName]);

  const checkSubdomainAvailability = async (name) => {
    try {
      const response = await fetch(`/api/check-subdomain?store_name=${name}`);
      
      if (!response.ok) {
        throw new Error("Network error");
      }
      
      const data = await response.json();
      setIsSubdomainAvailable(data.available);
      
      if (!data.available && data.reason) {
        setError(data.reason);
      } else {
        setError("");
      }
    } catch (error) {
      console.error('Error checking subdomain:', error);
      setError("Service unavailable. Try again later.");
      setIsSubdomainAvailable(null);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!storeName || !email || !phone) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (isSubdomainAvailable === false) {
      setError('Store name is already taken');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeName,
          email,
          phone,
          planType: selectedPlan
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login or dashboard
        onNavigate('login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSubdomainStatus = () => {
    if (!storeName) return null;
    if (storeName.length < 3) return { text: 'Enter at least 3 characters', color: 'text-gray-500' };
    if (isSubdomainAvailable === null) return { text: 'Checking availability...', color: 'text-blue-500' };
    if (isSubdomainAvailable) return { text: '✓ Available', color: 'text-green-500' };
    return { text: '✗ Already taken', color: 'text-red-500' };
  };

  const getSubdomainUrl = () => {
    if (!storeName) return '';
    return `${storeName.toLowerCase().replace(/\s+/g, '-')}.dealndone.com`;
  };

  const subdomainStatus = getSubdomainStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Honey Tailors POS</h1>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The Future of
            <span className="text-blue-600"> Retail</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-powered point of sale that grows with your business. 
            From single store to franchise empire.
          </p>
        </div>

        {/* Plan Selection */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Choose Your Plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-lg border-2 p-6 transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  <div className="text-blue-600 mr-3">{plan.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Signup Form */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Create Your Store
            </h3>
            
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Store Name with Subdomain Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your store name"
                    required
                  />
                  {storeName && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-600">Your store will be available at: </span>
                      <span className="font-mono text-blue-600">
                        {getSubdomainUrl()}
                      </span>
                      {subdomainStatus && (
                        <div className={`mt-1 flex items-center ${subdomainStatus.color}`}>
                          {subdomainStatus.text.includes('Checking') && (
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                          )}
                          {subdomainStatus.text}
                        </div>
                      )}
                      {error && (
                        <div className="mt-1 flex items-center text-orange-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              {/* Selected Plan Display */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">Selected Plan:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {plans.find(p => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {plans.find(p => p.id === selectedPlan)?.price}
                    <span className="text-sm text-gray-500">
                      {plans.find(p => p.id === selectedPlan)?.period}
                    </span>
                  </span>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSubdomainAvailable === false}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Store...
                  </>
                ) : (
                  <>
                    Create Store
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in here
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Honey Tailors POS?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Bank-level security with 99.9% uptime guarantee</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-User Access</h3>
              <p className="text-gray-600">Manage multiple employees with role-based permissions</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Real-time insights to grow your business</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 