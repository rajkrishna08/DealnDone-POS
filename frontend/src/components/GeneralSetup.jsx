import React, { useState, useEffect } from 'react';
import settingsService from '../utils/settingsService';

const GeneralSetup = () => {
  const [settings, setSettings] = useState({
    storeName: 'Deal n Done Store',
    storeAddress: '123 Main Street, City, State 12345',
    storePhone: '+1 (555) 123-4567',
    storeEmail: 'contact@dealndone.com',
    storeWebsite: 'https://dealndone.com',
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true }
    },
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
    currency: 'USD',
    language: 'English',
    taxRate: 8.5,
    receiptHeader: 'Deal n Done Store',
    receiptFooter: 'Thank you for your business!',
    receiptLogo: null,
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lowStockAlerts: true,
    salesReports: true,
    inventoryAlerts: true,
    customerNotifications: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    systemMaintenance: 'sunday',
    maintenanceTime: '02:00'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('store-info');
  const [storeData, setStoreData] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        // const user = settingsService.getUser(); // Commented out unused variable
        const orgId = settingsService.getOrgId();

        // Load store settings
        const storeSettings = await settingsService.getStoreSettings(orgId);
        setStoreData(storeSettings);

        // Load plan data
        const planInfo = await settingsService.getStorePlan(orgId);
        setPlanData(planInfo);

        // Load organization settings
        const orgSettings = await settingsService.getOrganizationSettings(orgId);
        
        // Merge settings from API with defaults
        const mergedSettings = { ...settings };
        
        // Update settings from API data
        if (orgSettings) {
          orgSettings.forEach(setting => {
            if (setting.section === 'store_info') {
              Object.keys(setting.value || {}).forEach(key => {
                if (mergedSettings[key] !== undefined) {
                  mergedSettings[key] = setting.value[key];
                }
              });
            }
          });
        }

        setSettings(mergedSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
        setMessage('Error loading settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: field === 'closed' ? value : value
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // const user = settingsService.getUser(); // Commented out unused variable
      const orgId = settingsService.getOrgId();
      
      // Validate settings before saving
      settingsService.validateSettings(settings, activeTab);
      
      // Prepare settings for API
      const settingsToSave = {};
      
      switch (activeTab) {
        case 'store-info':
          settingsToSave.store_name = settings.storeName;
          settingsToSave.store_phone = settings.storePhone;
          settingsToSave.store_email = settings.storeEmail;
          settingsToSave.store_website = settings.storeWebsite;
          settingsToSave.store_address = settings.storeAddress;
          break;
          
        case 'regional':
          settingsToSave.timezone = settings.timezone;
          settingsToSave.currency = settings.currency;
          settingsToSave.date_format = settings.dateFormat;
          settingsToSave.time_format = settings.timeFormat;
          settingsToSave.language = settings.language;
          settingsToSave.tax_rate = settings.taxRate;
          break;
          
        case 'business-hours':
          settingsToSave.business_hours = settings.businessHours;
          break;
          
        case 'receipts':
          settingsToSave.receipt_header = settings.receiptHeader;
          settingsToSave.receipt_footer = settings.receiptFooter;
          settingsToSave.receipt_logo = settings.receiptLogo;
          break;
          
        case 'notifications':
          settingsToSave.email_notifications = settings.emailNotifications;
          settingsToSave.sms_notifications = settings.smsNotifications;
          settingsToSave.push_notifications = settings.pushNotifications;
          settingsToSave.low_stock_alerts = settings.lowStockAlerts;
          settingsToSave.sales_reports = settings.salesReports;
          settingsToSave.customer_notifications = settings.customerNotifications;
          break;
          
        case 'system':
          settingsToSave.auto_backup = settings.autoBackup;
          settingsToSave.backup_frequency = settings.backupFrequency;
          settingsToSave.backup_retention = settings.backupRetention;
          settingsToSave.system_maintenance = settings.systemMaintenance;
          settingsToSave.maintenance_time = settings.maintenanceTime;
          break;
        default:
          // Handle default case to satisfy ESLint
          break;
      }
      
      // Save settings to API
      await settingsService.updateStoreSettings(orgId, settingsToSave, activeTab);
      
      setMessage('Settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage(error.message || 'Error saving settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradePlan = async () => {
    try {
      // const user = settingsService.getUser(); // Commented out unused variable
      const orgId = settingsService.getOrgId();
      
      // For demo purposes, upgrade to next plan
      const currentPlan = planData?.plan_type || 'basic';
      const planUpgrades = {
        'free': 'basic',
        'basic': 'pro',
        'pro': 'enterprise',
        'enterprise': 'enterprise'
      };
      
      const newPlan = planUpgrades[currentPlan];
      
      if (newPlan && newPlan !== currentPlan) {
        await settingsService.upgradeStorePlan(orgId, newPlan);
        setMessage(`Plan upgraded to ${newPlan}!`);
        
        // Reload plan data
        const updatedPlan = await settingsService.getStorePlan(orgId);
        setPlanData(updatedPlan);
        
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      setMessage('Error upgrading plan. Please try again.');
    }
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">General Setup</h1>
          <div className="text-sm text-gray-500">
            Configure your store's basic settings and preferences
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="deal-n-done-btn-primary"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="deal-n-done-card">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('store-info')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'store-info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Store Information
              </button>
              <button
                onClick={() => setActiveTab('store-settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'store-settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Store Settings
              </button>
              <button
                onClick={() => setActiveTab('regional')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'regional'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Regional Settings
              </button>
              <button
                onClick={() => setActiveTab('business-hours')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'business-hours'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Business Hours
              </button>
              <button
                onClick={() => setActiveTab('receipts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'receipts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Receipt Settings
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'system'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                System Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'store-info' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                    placeholder="Enter store name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Phone
                  </label>
                  <input
                    type="tel"
                    name="storePhone"
                    value={settings.storePhone}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Email
                  </label>
                  <input
                    type="email"
                    name="storeEmail"
                    value={settings.storeEmail}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                    placeholder="contact@dealndone.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Website
                  </label>
                  <input
                    type="url"
                    name="storeWebsite"
                    value={settings.storeWebsite}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                    placeholder="https://dealndone.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Address
                  </label>
                  <textarea
                    name="storeAddress"
                    value={settings.storeAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="deal-n-done-input"
                    placeholder="Enter complete store address"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'store-settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Store Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeData?.store_info?.store_name || 'logintest'}
                    disabled
                    className="deal-n-done-input bg-gray-50 text-gray-700"
                    placeholder="Store name"
                  />
                  <p className="mt-1 text-sm text-gray-500">This is your unique store identifier</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store URL
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={`${storeData?.store_info?.store_name || 'logintest'}.dealndone.com`}
                      disabled
                      className="flex-1 deal-n-done-input bg-gray-50 text-gray-700 font-mono"
                      placeholder="Store URL"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${storeData?.store_info?.store_name || 'logintest'}.dealndone.com`);
                        alert('URL copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Your unique store URL</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <input
                    type="text"
                    value={storeData?.store_info?.business_type || 'Retail'}
                    disabled
                    className="deal-n-done-input bg-gray-50 text-gray-700 capitalize"
                    placeholder="Business type"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Plan
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={planData?.plan_type || 'Basic'}
                      disabled
                      className="flex-1 deal-n-done-input bg-gray-50 text-gray-700 capitalize"
                      placeholder="Plan type"
                    />
                    <button 
                      onClick={handleUpgradePlan}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={storeData?.store_info?.email || 'login@test.com'}
                    disabled
                    className="deal-n-done-input bg-gray-50 text-gray-700"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 font-medium">Active</span>
                  </div>
                </div>
              </div>
              
              {/* Plan Limits Section */}
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Plan Limits</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {planData?.limits?.outlets || 1}
                    </div>
                    <div className="text-sm text-blue-700">Outlets</div>
                    <div className="text-xs text-blue-600">
                      Used: {planData?.usage?.outlets?.used || 0}/{planData?.limits?.outlets || 1}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {planData?.limits?.products || 1000}
                    </div>
                    <div className="text-sm text-green-700">Products</div>
                    <div className="text-xs text-green-600">
                      Used: {planData?.usage?.products?.used || 0}/{planData?.limits?.products || 1000}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {planData?.limits?.employees || 3}
                    </div>
                    <div className="text-sm text-purple-700">Employees</div>
                    <div className="text-xs text-purple-600">
                      Used: {planData?.usage?.employees?.used || 1}/{planData?.limits?.employees || 3}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'regional' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Regional Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Kolkata">India (IST)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    name="dateFormat"
                    value={settings.dateFormat}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Format
                  </label>
                  <select
                    name="timeFormat"
                    value={settings.timeFormat}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                  >
                    <option value="12-hour">12-hour</option>
                    <option value="24-hour">24-hour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={settings.language}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    name="taxRate"
                    value={settings.taxRate}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="100"
                    className="deal-n-done-input"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business-hours' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
              <div className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div key={day.key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-700">{day.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={!settings.businessHours[day.key].closed}
                        onChange={(e) => handleBusinessHoursChange(day.key, 'closed', !e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">Open</span>
                    </div>
                    {!settings.businessHours[day.key].closed && (
                      <>
                        <input
                          type="time"
                          value={settings.businessHours[day.key].open}
                          onChange={(e) => handleBusinessHoursChange(day.key, 'open', e.target.value)}
                          className="deal-n-done-input w-32"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={settings.businessHours[day.key].close}
                          onChange={(e) => handleBusinessHoursChange(day.key, 'close', e.target.value)}
                          className="deal-n-done-input w-32"
                        />
                      </>
                    )}
                    {settings.businessHours[day.key].closed && (
                      <span className="text-sm text-gray-500">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'receipts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Receipt Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receipt Header
                  </label>
                  <input
                    type="text"
                    name="receiptHeader"
                    value={settings.receiptHeader}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                    placeholder="Store name or custom header"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receipt Footer
                  </label>
                  <input
                    type="text"
                    name="receiptFooter"
                    value={settings.receiptFooter}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                    placeholder="Thank you message"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receipt Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      className="deal-n-done-input"
                    />
                    <span className="text-sm text-gray-500">Upload your store logo (PNG, JPG)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive important updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-600">Receive alerts via text message</p>
                  </div>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={settings.smsNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Get real-time alerts on your device</p>
                  </div>
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={settings.pushNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Low Stock Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified when inventory is running low</p>
                  </div>
                  <input
                    type="checkbox"
                    name="lowStockAlerts"
                    checked={settings.lowStockAlerts}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Sales Reports</h4>
                    <p className="text-sm text-gray-600">Daily and weekly sales summaries</p>
                  </div>
                  <input
                    type="checkbox"
                    name="salesReports"
                    checked={settings.salesReports}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Customer Notifications</h4>
                    <p className="text-sm text-gray-600">Order confirmations and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    name="customerNotifications"
                    checked={settings.customerNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto Backup
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="autoBackup"
                      checked={settings.autoBackup}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Enable automatic backup</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    name="backupFrequency"
                    value={settings.backupFrequency}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Retention (days)
                  </label>
                  <input
                    type="number"
                    name="backupRetention"
                    value={settings.backupRetention}
                    onChange={handleInputChange}
                    min="1"
                    max="365"
                    className="deal-n-done-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Maintenance Day
                  </label>
                  <select
                    name="systemMaintenance"
                    value={settings.systemMaintenance}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                  >
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Time
                  </label>
                  <input
                    type="time"
                    name="maintenanceTime"
                    value={settings.maintenanceTime}
                    onChange={handleInputChange}
                    className="deal-n-done-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Success/Error Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.includes('successfully') ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralSetup; 