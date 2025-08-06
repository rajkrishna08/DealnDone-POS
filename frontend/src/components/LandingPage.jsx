import React, { useState } from 'react';
import { 
  CheckCircle, 
  Zap, 
  Crown, 
  Globe, 
  ArrowRight, 
  AlertCircle,
  Users,
  BarChart3,
  Rocket,
  Building,
  ShoppingCart,
  Package
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
        'Loyalty Program',
        'Appointment Booking'
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

  const checkSubdomainAvailability = async (name) => {
    if (!name) return;
    
    try {
      const response = await fetch(`/api/subdomain/check?subdomain=${name.toLowerCase()}`);
      const data = await response.json();
      setIsSubdomainAvailable(data.available);
    } catch (error) {
      console.error('Error checking subdomain:', error);
      setIsSubdomainAvailable(true); // Default to available
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Navigate to signup page with selected plan
      onNavigate('signup');
    } catch (error) {
      setError('Failed to start signup process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSubdomainStatus = () => {
    if (!storeName) return null;
    if (isSubdomainAvailable === null) return null;
    return isSubdomainAvailable ? 'available' : 'unavailable';
  };

  const getSubdomainUrl = () => {
    if (!storeName) return '';
    return `${storeName.toLowerCase().replace(/\s+/g, '')}.dealndone.com`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">DealNDone</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('login')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('signup')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gradient-to-br from-blue-50 to-indigo-100 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Modern POS System</span>{' '}
                  <span className="block text-blue-600 xl:inline">for Modern Business</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Transform your business with our comprehensive point-of-sale solution. 
                  Manage sales, inventory, customers, and analytics all in one platform.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => onNavigate('signup')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => onNavigate('login')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to run your business
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              From sales to inventory, customers to analytics - we've got you covered.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Advanced POS</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Complete point-of-sale system with barcode scanning, payment processing, and receipt printing.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Package className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Inventory Management</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Track stock levels, manage suppliers, and automate reordering with smart alerts.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Customer Management</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Build customer relationships with loyalty programs, feedback systems, and personalized marketing.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Analytics & Reports</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Get insights into your business performance with detailed reports and real-time analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Choose the perfect plan for your business
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Start with our free trial and upgrade as you grow.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg shadow-lg p-6 ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 transform -translate-y-1/2">
                    <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold tracking-wide uppercase text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                </div>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <button
                    onClick={() => onNavigate('signup')}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.id === 'custom' ? 'Contact Sales' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => onNavigate('signup')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              © 2025 DealNDone. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 