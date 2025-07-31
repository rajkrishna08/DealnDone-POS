import React, { useState } from 'react';

const Settings = ({ onNavigateToPricing, onNavigateToOutletsRegisters, onNavigateToLoyalty, onNavigateToEmployees, onNavigateToSalesTax, onNavigateToPaymentTypes, onNavigateToGeneralSetup }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC-5');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' }
  ];

  const timezones = [
    { value: 'UTC-8', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC-7', label: 'Mountain Time (UTC-7)' },
    { value: 'UTC-6', label: 'Central Time (UTC-6)' },
    { value: 'UTC-5', label: 'Eastern Time (UTC-5)' },
    { value: 'UTC+0', label: 'UTC (UTC+0)' },
    { value: 'UTC+1', label: 'Central European Time (UTC+1)' },
    { value: 'UTC+5:30', label: 'India Standard Time (UTC+5:30)' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
  ];

  const handleSaveSettings = () => {
    // Save settings to backend/localStorage
    console.log('Saving settings:', {
      currency: selectedCurrency,
      timezone,
      language,
      notifications
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-sm text-gray-500">Configure your Deal n Done preferences</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          className="deal-n-done-btn-primary flex items-center"
        >
          <span className="text-lg mr-1">💾</span>
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Settings */}
        <div className="deal-n-done-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">💰</span>
            Currency & Regional Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Currency
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => setSelectedCurrency(currency.code)}
                    className={`p-3 border rounded-lg text-left transition-all duration-200 ${
                      selectedCurrency === currency.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{currency.flag}</span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {currency.symbol} {currency.name}
                        </div>
                        <div className="text-sm text-gray-500">{currency.code}</div>
                      </div>
                      {selectedCurrency === currency.code && (
                        <span className="text-blue-600 ml-auto">✅</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`p-3 border rounded-lg text-left transition-all duration-200 ${
                      language === lang.code
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{lang.flag}</span>
                      <div className="font-medium text-gray-900">{lang.name}</div>
                                             {language === lang.code && (
                         <span className="text-blue-600 ml-auto">✅</span>
                       )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="deal-n-done-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">🔔</span>
            Notification Preferences
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-500">Receive updates via email</div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Push Notifications</div>
                <div className="text-sm text-gray-500">Get real-time alerts</div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.push ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">SMS Notifications</div>
                <div className="text-sm text-gray-500">Receive text messages</div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.sms ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Assistant Settings */}
        <div className="deal-n-done-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">🤖</span>
            AI Assistant Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">DealBot AI</div>
                <div className="text-sm text-gray-500">Enable AI-powered assistance</div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Predictive Analytics</div>
                <div className="text-sm text-gray-500">AI-powered insights and recommendations</div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Auto-suggestions</div>
                <div className="text-sm text-gray-500">Smart product and pricing suggestions</div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Billing & Subscription */}
        <div className="deal-n-done-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">💳</span>
            Billing & Subscription
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">Current Plan</div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Starter
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                $29/month • Next billing: Feb 15, 2025
              </div>
              <button 
                onClick={() => onNavigateToPricing && onNavigateToPricing()}
                className="deal-n-done-btn-secondary text-sm"
              >
                <span className="text-sm mr-1">✏️</span>
                Manage Subscription
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Auto-renewal</div>
                <div className="text-sm text-gray-500">Automatically renew your subscription</div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="deal-n-done-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">🔒</span>
            Security & Privacy
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                <div className="text-sm text-gray-500">Add an extra layer of security</div>
              </div>
              <button className="deal-n-done-btn-secondary text-sm">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Data Export</div>
                <div className="text-sm text-gray-500">Download your data</div>
              </div>
              <button className="deal-n-done-btn-secondary text-sm">
                Export
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Delete Account</div>
                <div className="text-sm text-gray-500">Permanently delete your account</div>
              </div>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Outlets & Registers */}
        <div className="deal-n-done-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-lg mr-2">🏪</span>
            Outlets & Registers
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">Store Management</div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                2 outlets • 5 registers • Professional Plan
              </div>
              <button 
                onClick={() => onNavigateToOutletsRegisters && onNavigateToOutletsRegisters()}
                className="deal-n-done-btn-secondary text-sm"
              >
                <span className="text-sm mr-1">⚙️</span>
                Manage Outlets & Registers
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Multi-location Support</div>
                <div className="text-sm text-gray-500">Manage multiple store locations</div>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
          </div>
        </div>

                 {/* Loyalty Program */}
         <div className="deal-n-done-card">
           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
             <span className="text-lg mr-2">🎁</span>
             Loyalty Program
           </h3>
           
           <div className="space-y-4">
             <div className="p-4 bg-purple-50 rounded-lg">
               <div className="flex items-center justify-between mb-2">
                 <div className="font-medium text-gray-900">Deal n Done Rewards</div>
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                   Active
                 </span>
               </div>
               <div className="text-sm text-gray-600 mb-3">
                 1,247 members • 4 tiers • 3 rewards available
               </div>
               <button 
                 onClick={() => onNavigateToLoyalty && onNavigateToLoyalty()}
                 className="deal-n-done-btn-secondary text-sm"
               >
                 <span className="text-sm mr-1">⚙️</span>
                 Manage Loyalty Program
               </button>
             </div>

             <div className="flex items-center justify-between">
               <div>
                 <div className="font-medium text-gray-900">Customer Rewards</div>
                 <div className="text-sm text-gray-500">Points, tiers, and redemption</div>
               </div>
               <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                 <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
               </button>
             </div>
           </div>
         </div>

         {/* Employees & Roles */}
         <div className="deal-n-done-card">
           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
             <span className="text-lg mr-2">👥</span>
             Employees & Roles
           </h3>
           
           <div className="space-y-4">
             <div className="p-4 bg-indigo-50 rounded-lg">
               <div className="flex items-center justify-between mb-2">
                 <div className="font-medium text-gray-900">Team Management</div>
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                   Active
                 </span>
               </div>
               <div className="text-sm text-gray-600 mb-3">
                 3 employees • 4 roles • 2 outlets
               </div>
               <button 
                 onClick={() => onNavigateToEmployees && onNavigateToEmployees()}
                 className="deal-n-done-btn-secondary text-sm"
               >
                 <span className="text-sm mr-1">⚙️</span>
                 Manage Employees & Roles
               </button>
             </div>

             <div className="flex items-center justify-between">
               <div>
                 <div className="font-medium text-gray-900">Access Control</div>
                 <div className="text-sm text-gray-500">Role-based permissions and security</div>
               </div>
               <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                 <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
               </button>
             </div>
           </div>
         </div>

                     {/* Sales Tax */}
            <div className="deal-n-done-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-lg mr-2">🧾</span>
                Sales Tax
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">Tax Management</div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    3 tax rates • 3 tax codes • 3 exemptions
                  </div>
                  <button 
                    onClick={() => onNavigateToSalesTax && onNavigateToSalesTax()}
                    className="deal-n-done-btn-secondary text-sm"
                  >
                    <span className="text-sm mr-1">⚙️</span>
                    Manage Sales Tax
                  </button>
                </div>
            
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Tax Reporting</div>
                    <div className="text-sm text-gray-500">Automatic tax calculations and reporting</div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
              </div>
            </div>

                         {/* Payment Types */}
             <div className="deal-n-done-card">
               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                 <span className="text-lg mr-2">💳</span>
                 Payment Types
               </h3>
               
               <div className="space-y-4">
                 <div className="p-4 bg-blue-50 rounded-lg">
                   <div className="flex items-center justify-between mb-2">
                     <div className="font-medium text-gray-900">Payment Management</div>
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       Active
                     </span>
                   </div>
                   <div className="text-sm text-gray-600 mb-3">
                     4 payment methods • 3 payment gateways • 3 discounts
                   </div>
                   <button 
                     onClick={() => onNavigateToPaymentTypes && onNavigateToPaymentTypes()}
                     className="deal-n-done-btn-secondary text-sm"
                   >
                     <span className="text-sm mr-1">⚙️</span>
                     Manage Payment Types
                   </button>
                 </div>
             
                 <div className="flex items-center justify-between">
                   <div>
                     <div className="font-medium text-gray-900">Payment Processing</div>
                     <div className="text-sm text-gray-500">Secure payment processing and reporting</div>
                   </div>
                   <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                     <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                   </button>
                 </div>
               </div>
             </div>

             {/* General Setup */}
             <div className="deal-n-done-card">
                               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-lg mr-2">⚙️</span>
                  General Setup
                </h3>
               
               <div className="space-y-4">
                 <div className="p-4 bg-gray-50 rounded-lg">
                   <div className="flex items-center justify-between mb-2">
                     <div className="font-medium text-gray-900">Store Configuration</div>
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       Active
                     </span>
                   </div>
                   <div className="text-sm text-gray-600 mb-3">
                     2 locations • 6 business hours • 4 contact methods • 3 social media
                   </div>
                   <button 
                     onClick={() => onNavigateToGeneralSetup && onNavigateToGeneralSetup()}
                     className="deal-n-done-btn-secondary text-sm"
                   >
                                           <span className="text-sm mr-1">⚙️</span>
                      Manage General Setup
                   </button>
                 </div>
             
                 <div className="flex items-center justify-between">
                   <div>
                     <div className="font-medium text-gray-900">Store Information</div>
                     <div className="text-sm text-gray-500">Business hours, contact info, and locations</div>
                   </div>
                   <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                     <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                   </button>
                 </div>
               </div>
             </div>
       </div>
    </div>
  );
};

export default Settings; 