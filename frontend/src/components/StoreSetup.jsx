import React, { useState } from 'react';

const StoreSetup = ({ selectedPlan, onSetupComplete, onBackToPricing }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { id: 1, title: 'Plan Confirmation', description: 'Review your selected plan' },
    { id: 2, title: 'Store Information', description: 'Set up your store details' },
    { id: 3, title: 'Account Creation', description: 'Create your login credentials' },
    { id: 4, title: 'Setup Complete', description: 'Your store is ready!' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful setup
      onSetupComplete({
        storeName: formData.storeName,
        email: formData.email,
        plan: selectedPlan
      });
    } catch (err) {
      setError('Setup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <div className="mb-6">
              <span className="material-icons text-6xl text-blue-600 mb-4">verified</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Plan Selected: {selectedPlan.name}
              </h3>
              <p className="text-gray-600 mb-4">
                You've selected the {selectedPlan.name} plan for ${selectedPlan.price}/month
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Plan Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {selectedPlan.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="material-icons text-green-600 text-sm mr-2">check</span>
                    {feature}
                  </li>
                ))}
                {selectedPlan.features.length > 5 && (
                  <li className="text-blue-600 text-sm">+{selectedPlan.features.length - 5} more features</li>
                )}
              </ul>
            </div>

            <button
              onClick={handleNext}
              className="deal-n-done-btn-primary px-8 py-3"
            >
              Continue to Store Setup
            </button>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your store name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be your store's display name in the system
                </p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be your login email and used for important notifications
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="deal-n-done-btn-secondary px-6 py-2"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.storeName || !formData.email}
                className="deal-n-done-btn-primary px-6 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Account</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a strong password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="deal-n-done-btn-secondary px-6 py-2"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.password || !formData.confirmPassword || isLoading}
                className="deal-n-done-btn-primary px-6 py-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="mb-6">
              <span className="material-icons text-6xl text-green-600 mb-4">check_circle</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Setup Complete!
              </h3>
              <p className="text-gray-600 mb-4">
                Your store "{formData.storeName}" has been successfully created
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-green-900 mb-2">Store Details:</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div><strong>Store Name:</strong> {formData.storeName}</div>
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Plan:</strong> {selectedPlan.name}</div>
                <div><strong>Status:</strong> Active</div>
              </div>
            </div>

            <button
              onClick={() => onSetupComplete({
                storeName: formData.storeName,
                email: formData.email,
                plan: selectedPlan
              })}
              className="deal-n-done-btn-primary px-8 py-3"
            >
              <span className="material-icons mr-2">dashboard</span>
              Go to Dashboard
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h1 className="deal-n-done-logo text-3xl mb-2">
            Deal n <span>Done</span>
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Setup</h2>
          <p className="text-sm text-gray-600">
            Let's get your store up and running
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="deal-n-done-card">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    step.id <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id < currentStep ? (
                      <span className="material-icons text-sm">check</span>
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-center">
              <span className="text-sm font-medium text-gray-900">
                {steps[currentStep - 1].title}
              </span>
              <p className="text-xs text-gray-500">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <span className="material-icons text-red-400 mr-2">error</span>
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Step Content */}
          {renderStepContent()}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onBackToPricing}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to Pricing Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSetup; 