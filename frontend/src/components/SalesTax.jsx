import React, { useState } from 'react';

const SalesTax = () => {
  const [taxRates, setTaxRates] = useState([
    {
      id: 1,
      name: 'State Tax',
      rate: 6.25,
      type: 'percentage',
      appliesTo: 'all',
      active: true,
      description: 'Standard state sales tax'
    },
    {
      id: 2,
      name: 'County Tax',
      rate: 1.5,
      type: 'percentage',
      appliesTo: 'all',
      active: true,
      description: 'Local county tax'
    },
    {
      id: 3,
      name: 'City Tax',
      rate: 1.0,
      type: 'percentage',
      appliesTo: 'all',
      active: true,
      description: 'City sales tax'
    },
    {
      id: 4,
      name: 'Food Tax',
      rate: 2.0,
      type: 'percentage',
      appliesTo: 'food',
      active: true,
      description: 'Reduced rate for food items'
    },
    {
      id: 5,
      name: 'Luxury Tax',
      rate: 10.0,
      type: 'percentage',
      appliesTo: 'luxury',
      active: false,
      description: 'Additional tax on luxury items'
    }
  ]);

  const [showAddTax, setShowAddTax] = useState(false);
  const [newTax, setNewTax] = useState({
    name: '',
    rate: '',
    type: 'percentage',
    appliesTo: 'all',
    description: ''
  });

  const [globalSettings, setGlobalSettings] = useState({
    taxInclusive: false,
    roundTax: true,
    taxOnShipping: false,
    taxOnDiscounts: false,
    exemptCategories: ['groceries', 'prescription-drugs'],
    taxExemptionThreshold: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Tax settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTax = () => {
    const tax = {
      id: Date.now(),
      ...newTax,
      rate: parseFloat(newTax.rate),
      active: true
    };
    setTaxRates([...taxRates, tax]);
    setNewTax({ name: '', rate: '', type: 'percentage', appliesTo: 'all', description: '' });
    setShowAddTax(false);
  };

  const toggleTaxStatus = (taxId) => {
    setTaxRates(taxRates.map(tax =>
      tax.id === taxId
        ? { ...tax, active: !tax.active }
        : tax
    ));
  };

  const deleteTax = (taxId) => {
    setTaxRates(taxRates.filter(tax => tax.id !== taxId));
  };

  const calculateTotalTaxRate = () => {
    return taxRates
      .filter(tax => tax.active)
      .reduce((total, tax) => total + tax.rate, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Sales Tax</h1>
          <div className="text-sm text-gray-500">
            Configure tax rates and settings for your business
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={handleSaveSettings}
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
                Save Settings
              </>
            )}
          </button>
          <button 
            onClick={() => setShowAddTax(true)}
            className="deal-n-done-btn-secondary"
          >
            <span>➕</span>
            Add Tax Rate
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tax Rate</p>
                <p className="text-2xl font-bold text-gray-900">{calculateTotalTaxRate().toFixed(2)}%</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tax Rates</p>
                <p className="text-2xl font-bold text-gray-900">{taxRates.filter(t => t.active).length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Tax Collected</p>
                <p className="text-2xl font-bold text-gray-900">$12,450</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Exempt Categories</p>
                <p className="text-2xl font-bold text-gray-900">{globalSettings.exemptCategories.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
                Tax Rates
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Global Settings
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Exemptions
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Reports
              </button>
            </nav>
          </div>

          {/* Tax Rates Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Tax Rates</h3>
              <button 
                onClick={() => setShowAddTax(true)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Tax Rate
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applies To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxRates.map((tax) => (
                    <tr key={tax.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{tax.name}</div>
                          <div className="text-sm text-gray-500">{tax.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tax.rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="capitalize">{tax.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="capitalize">{tax.appliesTo}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          tax.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tax.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => toggleTaxStatus(tax.id)}
                          className={`mr-2 px-2 py-1 text-xs rounded ${
                            tax.active 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {tax.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mr-2">
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteTax(tax.id)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Global Settings Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.taxInclusive}
                    onChange={(e) => setGlobalSettings({...globalSettings, taxInclusive: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Prices include tax</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.roundTax}
                    onChange={(e) => setGlobalSettings({...globalSettings, roundTax: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Round tax to nearest cent</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.taxOnShipping}
                    onChange={(e) => setGlobalSettings({...globalSettings, taxOnShipping: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Apply tax to shipping</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.taxOnDiscounts}
                    onChange={(e) => setGlobalSettings({...globalSettings, taxOnDiscounts: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Apply tax to discounts</label>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Exemption Threshold
                  </label>
                  <input
                    type="number"
                    value={globalSettings.taxExemptionThreshold}
                    onChange={(e) => setGlobalSettings({...globalSettings, taxExemptionThreshold: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                    className="deal-n-done-input"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exempt Categories
                  </label>
                  <div className="space-y-2">
                    {['groceries', 'prescription-drugs', 'clothing', 'books'].map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={globalSettings.exemptCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGlobalSettings({
                                ...globalSettings, 
                                exemptCategories: [...globalSettings.exemptCategories, category]
                              });
                            } else {
                              setGlobalSettings({
                                ...globalSettings, 
                                exemptCategories: globalSettings.exemptCategories.filter(c => c !== category)
                              });
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-900 capitalize">{category.replace('-', ' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

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

        {/* Add Tax Rate Modal */}
        {showAddTax && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Tax Rate</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Name</label>
                    <input
                      type="text"
                      value={newTax.name}
                      onChange={(e) => setNewTax({...newTax, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate (%)</label>
                    <input
                      type="number"
                      value={newTax.rate}
                      onChange={(e) => setNewTax({...newTax, rate: e.target.value})}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newTax.type}
                      onChange={(e) => setNewTax({...newTax, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Applies To</label>
                    <select
                      value={newTax.appliesTo}
                      onChange={(e) => setNewTax({...newTax, appliesTo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Items</option>
                      <option value="food">Food Items</option>
                      <option value="luxury">Luxury Items</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newTax.description}
                      onChange={(e) => setNewTax({...newTax, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddTax(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTax}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Add Tax Rate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default SalesTax; 