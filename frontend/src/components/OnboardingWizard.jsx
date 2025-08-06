import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  ShoppingBag, 
  Scissors, 
  Utensils,
  Package,
  Receipt,
  Calendar,
  Users,
  Settings,
  BarChart3,
  Zap,
  Star
} from 'lucide-react';

const OnboardingWizard = ({ user, businessType, onComplete, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Industry-specific wizard configurations
  const wizardConfigs = {
    retail: {
      title: "Retail Store Setup",
      description: "Let's set up your retail store for success",
      steps: [
        {
          id: 1,
          title: "Product Categories",
          description: "Select your main product categories",
          icon: <Package className="w-6 h-6" />,
          fields: ['categories']
        },
        {
          id: 2,
          title: "Tax Configuration",
          description: "Set up your tax settings",
          icon: <Receipt className="w-6 h-6" />,
          fields: ['taxRate', 'taxName']
        },
        {
          id: 3,
          title: "First Product",
          description: "Add your first product to get started",
          icon: <ShoppingBag className="w-6 h-6" />,
          fields: ['productName', 'productPrice', 'productCategory']
        },
        {
          id: 4,
          title: "First Sale",
          description: "Complete your first sale to see the magic",
          icon: <BarChart3 className="w-6 h-6" />,
          fields: ['saleAmount', 'paymentMethod']
        },
        {
          id: 5,
          title: "Welcome Dashboard",
          description: "Your store is ready! Explore your dashboard",
          icon: <Star className="w-6 h-6" />,
          fields: []
        }
      ]
    },
    services: {
      title: "Service Business Setup",
      description: "Let's configure your service business",
      steps: [
        {
          id: 1,
          title: "Service Types",
          description: "Define your service offerings",
          icon: <Scissors className="w-6 h-6" />,
          fields: ['serviceTypes']
        },
        {
          id: 2,
          title: "Staff Setup",
          description: "Add your team members",
          icon: <Users className="w-6 h-6" />,
          fields: ['staffCount', 'staffRoles']
        },
        {
          id: 3,
          title: "Appointment Settings",
          description: "Configure your booking system",
          icon: <Calendar className="w-6 h-6" />,
          fields: ['appointmentDuration', 'workingHours']
        },
        {
          id: 4,
          title: "First Appointment",
          description: "Book your first appointment",
          icon: <CheckCircle className="w-6 h-6" />,
          fields: ['clientName', 'serviceType', 'appointmentDate']
        },
        {
          id: 5,
          title: "Welcome Dashboard",
          description: "Your service business is ready!",
          icon: <Star className="w-6 h-6" />,
          fields: []
        }
      ]
    },
    restaurant: {
      title: "Restaurant Setup (Coming Q1 2026)",
      description: "Restaurant features will be available soon",
      steps: [
        {
          id: 1,
          title: "Table Setup",
          description: "Configure your restaurant layout",
          icon: <Utensils className="w-6 h-6" />,
          fields: ['tableCount', 'tableLayout']
        },
        {
          id: 2,
          title: "Menu Configuration",
          description: "Set up your menu items",
          icon: <Package className="w-6 h-6" />,
          fields: ['menuCategories', 'menuItems']
        },
        {
          id: 3,
          title: "Kitchen Display",
          description: "Configure kitchen order management",
          icon: <Settings className="w-6 h-6" />,
          fields: ['kitchenSetup', 'orderFlow']
        },
        {
          id: 4,
          title: "First Order",
          description: "Process your first restaurant order",
          icon: <CheckCircle className="w-6 h-6" />,
          fields: ['orderItems', 'tableNumber']
        },
        {
          id: 5,
          title: "Welcome Dashboard",
          description: "Your restaurant is ready!",
          icon: <Star className="w-6 h-6" />,
          fields: []
        }
      ]
    }
  };

  const config = wizardConfigs[businessType] || wizardConfigs.retail;
  const totalSteps = config.steps.length;

  useEffect(() => {
    setProgress((currentStep / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setLoading(true);
      
      // Simulate API call for step completion
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentStep(prev => prev + 1);
      } catch (error) {
        console.error('Step completion failed:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Complete onboarding
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Simulate API call to complete onboarding
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to dashboard
      onComplete({
        businessType,
        onboardingData: formData,
        completedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Onboarding completion failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const currentStepConfig = config.steps.find(step => step.id === currentStep);
    
    if (!currentStepConfig) return null;

    switch (businessType) {
      case 'retail':
        return renderRetailStep(currentStepConfig);
      case 'services':
        return renderServicesStep(currentStepConfig);
      case 'restaurant':
        return renderRestaurantStep(currentStepConfig);
      default:
        return renderRetailStep(currentStepConfig);
    }
  };

  const renderRetailStep = (stepConfig) => {
    switch (stepConfig.id) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Select Your Product Categories</h3>
            <p className="text-gray-600">Choose the main categories for your products</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Clothing', 'Electronics', 'Groceries', 'Home & Garden', 'Beauty', 'Sports', 'Books', 'Toys', 'Automotive', 'Health'].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    const currentCategories = formData.categories || [];
                    const newCategories = currentCategories.includes(category)
                      ? currentCategories.filter(c => c !== category)
                      : [...currentCategories, category];
                    handleInputChange('categories', newCategories);
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    (formData.categories || []).includes(category)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{category}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Configure Tax Settings</h3>
            <p className="text-gray-600">Set up your tax configuration for accurate pricing</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.taxRate || ''}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 12 for 12%"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Name
                </label>
                <input
                  type="text"
                  value={formData.taxName || ''}
                  onChange={(e) => handleInputChange('taxName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., GST, VAT, Sales Tax"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Add Your First Product</h3>
            <p className="text-gray-600">Create your first product to get started</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.productName || ''}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Cotton T-Shirt"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.productPrice || ''}
                  onChange={(e) => handleInputChange('productPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 899"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.productCategory || ''}
                  onChange={(e) => handleInputChange('productCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {(formData.categories || []).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Complete Your First Sale</h3>
            <p className="text-gray-600">Let's process your first transaction</p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <h4 className="font-medium text-green-800">Demo Sale Completed!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Product: {formData.productName || 'Demo Product'}<br/>
                    Amount: ₹{formData.productPrice || '899'}<br/>
                    Payment: Cash
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600">Your first sale has been processed successfully!</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DealNDone!</h3>
              <p className="text-gray-600 mb-6">
                Your retail store is now set up and ready to go. You can start managing your inventory, 
                processing sales, and growing your business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-blue-900">Manage Products</h4>
                <p className="text-sm text-blue-700">Add, edit, and organize your inventory</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-green-900">Process Sales</h4>
                <p className="text-sm text-green-700">Ring up sales and track transactions</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-purple-900">Manage Customers</h4>
                <p className="text-sm text-purple-700">Build relationships and loyalty</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderServicesStep = (stepConfig) => {
    switch (stepConfig.id) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Define Your Services</h3>
            <p className="text-gray-600">Select the types of services you offer</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Hair Styling', 'Tailoring', 'Repairs', 'Consultation', 'Training', 'Cleaning', 'Massage', 'Beauty', 'Photography', 'Design'].map(service => (
                <button
                  key={service}
                  onClick={() => {
                    const currentServices = formData.serviceTypes || [];
                    const newServices = currentServices.includes(service)
                      ? currentServices.filter(s => s !== service)
                      : [...currentServices, service];
                    handleInputChange('serviceTypes', newServices);
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    (formData.serviceTypes || []).includes(service)
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{service}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Staff Setup</h3>
            <p className="text-gray-600">Configure your team members</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Staff Members
                </label>
                <input
                  type="number"
                  value={formData.staffCount || ''}
                  onChange={(e) => handleInputChange('staffCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Roles
                </label>
                <div className="space-y-2">
                  {['Stylist', 'Assistant', 'Manager', 'Receptionist', 'Technician'].map(role => (
                    <label key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.staffRoles || []).includes(role)}
                        onChange={(e) => {
                          const currentRoles = formData.staffRoles || [];
                          const newRoles = e.target.checked
                            ? [...currentRoles, role]
                            : currentRoles.filter(r => r !== role);
                          handleInputChange('staffRoles', newRoles);
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Appointment Settings</h3>
            <p className="text-gray-600">Configure your booking system</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Appointment Duration (minutes)
                </label>
                <select
                  value={formData.appointmentDuration || ''}
                  onChange={(e) => handleInputChange('appointmentDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select duration</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.workingHoursStart || '09:00'}
                      onChange={(e) => handleInputChange('workingHoursStart', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.workingHoursEnd || '18:00'}
                      onChange={(e) => handleInputChange('workingHoursEnd', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Book Your First Appointment</h3>
            <p className="text-gray-600">Let's schedule your first appointment</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.clientName || ''}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={formData.serviceType || ''}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a service</option>
                  {(formData.serviceTypes || []).map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.appointmentDate || ''}
                  onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to DealNDone!</h3>
              <p className="text-gray-600 mb-6">
                Your service business is now set up and ready to go. You can start managing appointments, 
                scheduling services, and growing your business.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-blue-900">Manage Appointments</h4>
                <p className="text-sm text-blue-700">Schedule and track appointments</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-green-900">Staff Management</h4>
                <p className="text-sm text-green-700">Manage your team and schedules</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-purple-900">Service Analytics</h4>
                <p className="text-sm text-purple-700">Track performance and growth</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRestaurantStep = (stepConfig) => {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Utensils className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Features Coming Soon!</h3>
          <p className="text-gray-600 mb-6">
            Restaurant-specific features including table management, kitchen display system, 
            and menu management will be available in Q1 2026.
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 font-medium">Join the waitlist for early access!</span>
          </div>
        </div>
        
        <button
          onClick={handleComplete}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue to Dashboard
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-gray-600 mt-2">{config.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</div>
              <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="p-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : currentStep === totalSteps ? (
                <>
                  Complete Setup
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard; 