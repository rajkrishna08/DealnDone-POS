import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Star, ShoppingBag, Scissors, Utensils } from 'lucide-react';

const SignUp = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    storeName: '',
    phone: '',
    businessType: '', // NEW: Business type selection
    planType: 'basic',
    agreeToTerms: false
  });
  
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [step, setStep] = useState(1); // Start with business type selection
  const [subdomain, setSubdomain] = useState('');
  const [subdomainAvailable, setSubdomainAvailable] = useState(null);
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Business types with icons and descriptions
  const businessTypes = [
    {
      id: 'retail',
      name: 'Retail Store',
      icon: <ShoppingBag className="w-8 h-8" />,
      description: 'Sell products in-store or online',
      examples: 'Clothing, Electronics, Groceries',
      features: ['Inventory Management', 'Barcode Scanning', 'Sales Tracking'],
      recommendedPlan: 'basic'
    },
    {
      id: 'services',
      name: 'Service Business',
      icon: <Scissors className="w-8 h-8" />,
      description: 'Provide services to customers',
      examples: 'Salon, Tailoring, Repairs',
      features: ['Appointment Booking', 'Service Scheduling', 'Customer Management'],
      recommendedPlan: 'professional'
    },
    {
      id: 'restaurant',
      name: 'Restaurant (Coming Q1 2026)',
      icon: <Utensils className="w-8 h-8" />,
      description: 'Food service and dining',
      examples: 'Restaurant, Cafe, Food Truck',
      features: ['Table Management', 'Kitchen Display', 'Delivery Integration'],
      recommendedPlan: 'enterprise',
      comingSoon: true
    }
  ];

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
        'Basic Reports'
      ],
      popular: false
    },
    {
      id: 'basic',
      name: 'Basic',
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
        'Inventory Management'
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
        'All Basic Features',
        'Advanced Analytics',
        'Multi-user Access',
        'Employee Management',
        'Customer Loyalty Program',
        'Integration Support',
        'Phone Support'
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
        'All Professional Features',
        'Unlimited Store Locations',
        'Warehouse Management',
        'Custom Integrations',
        'Dedicated Account Manager',
        '24/7 Priority Support'
      ],
      popular: false
    }
  ];

  useEffect(() => {
    setFormData(prev => ({ ...prev, planType: selectedPlan }));
  }, [selectedPlan]);

  // Auto-select recommended plan based on business type
  useEffect(() => {
    if (formData.businessType) {
      const businessType = businessTypes.find(bt => bt.id === formData.businessType);
      if (businessType && !businessType.comingSoon) {
        setSelectedPlan(businessType.recommendedPlan);
      }
    }
  }, [formData.businessType]);

  // Generate subdomain from store name
  useEffect(() => {
    if (formData.storeName) {
      const generatedSubdomain = formData.storeName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
      setSubdomain(generatedSubdomain);
      checkSubdomainAvailability(generatedSubdomain);
    }
  }, [formData.storeName]);

  const checkSubdomainAvailability = async (subdomain) => {
    if (subdomain.length < 3) return;
    
    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch(`/api/check-subdomain?store_name=${subdomain}`);
      const data = await response.json();
      setSubdomainAvailable(data.available);
    } catch (error) {
      // For demo, assume available
      setSubdomainAvailable(true);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Business type validation
    if (!formData.businessType) {
      newErrors.businessType = 'Please select your business type';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Store name validation
    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    } else if (formData.storeName.length < 3) {
      newErrors.storeName = 'Store name must be at least 3 characters';
    }
    
    // Subdomain validation
    if (subdomain && subdomain.length < 3) {
      newErrors.subdomain = 'Subdomain must be at least 3 characters';
    }
    
    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBusinessTypeSelect = (businessTypeId) => {
    setFormData(prev => ({ ...prev, businessType: businessTypeId }));
    setErrors(prev => ({ ...prev, businessType: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user account with enhanced data
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeName: formData.storeName,
          subdomain: subdomain,
          businessType: formData.businessType,
          email: formData.email,
          phone: formData.phone || '',
          planType: formData.planType,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: formData.agreeToTerms
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store user data for login
        localStorage.setItem('signupEmail', formData.email);
        localStorage.setItem('signupStoreName', formData.storeName);
        localStorage.setItem('signupPlan', formData.planType);
        localStorage.setItem('businessType', formData.businessType);
        localStorage.setItem('subdomain', subdomain);
        
        // If onLogin is provided, use it directly
        if (onLogin && data.user) {
          onLogin({
            ...data.user,
            token: data.token || data.access_token,
            store: data.store,
            plan: formData.planType,
            businessType: formData.businessType,
            subdomain: subdomain
          });
        } else {
          // Navigate to login with success message
          onNavigate('login', { 
            message: 'Account created successfully! Please sign in with your credentials.',
            email: formData.email,
            storeName: formData.storeName,
            businessType: formData.businessType
          });
        }
      } else {
        setErrors({ general: data.detail || data.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const BusinessTypeCard = ({ businessType, isSelected, onSelect }) => (
    <div 
      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-600 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300'
      } ${businessType.comingSoon ? 'opacity-60' : ''}`}
      onClick={() => !businessType.comingSoon && onSelect(businessType.id)}
    >
      {businessType.comingSoon && (
        <div className="absolute top-2 right-2">
          <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
            Coming Soon
          </span>
        </div>
      )}
      
      <div className="text-center mb-4">
        <div className="flex justify-center mb-3">
          {businessType.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{businessType.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{businessType.description}</p>
        <p className="text-xs text-gray-500">{businessType.examples}</p>
      </div>

      <ul className="space-y-1 mb-4">
        {businessType.features.map((feature, index) => (
          <li key={index} className="flex items-center text-xs">
            <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );

  const PlanCard = ({ plan, isSelected, onSelect }) => (
    <div 
      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-600 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onSelect(plan.id)}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-4">
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
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Store Account
          </h1>
          <p className="text-lg text-gray-600">
            Choose your business type and set up your online store
          </p>
          
          {/* Step Indicator */}
          <div className="flex justify-center mt-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Business Type</span>
              </div>
              <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Plan Selection</span>
              </div>
              <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Account Info</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Business Type Selection */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                What type of business do you run?
              </h2>
              <p className="text-gray-600 mb-8">
                This helps us personalize your experience and recommend the right features.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {businessTypes.map((businessType) => (
                <BusinessTypeCard 
                  key={businessType.id}
                  businessType={businessType}
                  isSelected={formData.businessType === businessType.id}
                  onSelect={handleBusinessTypeSelect}
                />
              ))}
            </div>
            
            {errors.businessType && (
              <p className="text-sm text-red-600 text-center">{errors.businessType}</p>
            )}
            
            <div className="flex justify-center">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.businessType}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Plan Selection
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Plan Selection */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 mb-8">
                {formData.businessType && (
                  <>
                    Recommended for {businessTypes.find(bt => bt.id === formData.businessType)?.name}: 
                    <span className="font-semibold text-blue-600 ml-1">
                      {businessTypes.find(bt => bt.id === formData.businessType)?.recommendedPlan.charAt(0).toUpperCase() + 
                       businessTypes.find(bt => bt.id === formData.businessType)?.recommendedPlan.slice(1)} Plan
                    </span>
                  </>
                )}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <PlanCard 
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlan === plan.id}
                  onSelect={setSelectedPlan}
                />
              ))}
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-700 px-6 py-2"
              >
                ← Back to Business Type
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue to Account Setup
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Account Information */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Selected Plan Summary */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Selected Plan
                </h2>
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Change Plan
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                {(() => {
                  const plan = plans.find(p => p.id === selectedPlan);
                  const businessType = businessTypes.find(bt => bt.id === formData.businessType);
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">{plan?.name}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">${plan?.price}</div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>
                      <p className="text-gray-600">{plan?.description}</p>
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Perfect for {businessType?.name}</h4>
                        <ul className="space-y-1">
                          {businessType?.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Account Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Store & Account Information
                </h2>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  ← Back to Plans
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Store Name */}
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.storeName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your store name (e.g., Krishna Garments)"
                  />
                  {formData.storeName && (
                    <p className="mt-1 text-xs text-gray-600">
                      Your store will be available at: <span className="font-mono text-blue-600">{subdomain}.dealndone.com</span>
                      {subdomainAvailable === false && (
                        <span className="text-red-500 ml-2">(Not available)</span>
                      )}
                      {subdomainAvailable === true && (
                        <span className="text-green-500 ml-2">✓ Available</span>
                      )}
                    </p>
                  )}
                  {errors.storeName && (
                    <p className="mt-1 text-sm text-red-600">{errors.storeName}</p>
                  )}
                </div>
                
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a secure password (min 8 characters)"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </button>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account & Start Free Trial'
                )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    onClick={() => onNavigate('login')}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp; 