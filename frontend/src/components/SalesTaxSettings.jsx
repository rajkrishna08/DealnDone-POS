import React, { useState } from 'react';

const SalesTaxSettings = ({ onBackToSettings, user }) => {
  const [activeTab, setActiveTab] = useState('tax-rates');
  const [showAddTaxRate, setShowAddTaxRate] = useState(false);
  const [showAddTaxCode, setShowAddTaxCode] = useState(false);
  const [showAddExemption, setShowAddExemption] = useState(false);

  // Mock data for sales tax settings
  const [taxRates] = useState([
    {
      id: 1,
      name: 'Standard Sales Tax',
      rate: 8.5,
      type: 'percentage',
      appliesTo: 'All Products',
      effectiveDate: '2024-01-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'Food & Beverage Tax',
      rate: 6.0,
      type: 'percentage',
      appliesTo: 'Food & Beverages',
      effectiveDate: '2024-01-01',
      status: 'active'
    },
    {
      id: 3,
      name: 'Luxury Goods Tax',
      rate: 12.0,
      type: 'percentage',
      appliesTo: 'Luxury Items',
      effectiveDate: '2024-01-01',
      status: 'active'
    }
  ]);

  const [taxCodes] = useState([
    {
      id: 1,
      code: 'STD',
      description: 'Standard Sales Tax',
      rate: 8.5,
      category: 'General'
    },
    {
      id: 2,
      code: 'FBT',
      description: 'Food & Beverage Tax',
      rate: 6.0,
      category: 'Food'
    },
    {
      id: 3,
      code: 'LUX',
      description: 'Luxury Goods Tax',
      rate: 12.0,
      category: 'Luxury'
    }
  ]);

  const [exemptions] = useState([
    {
      id: 1,
      name: 'Resale Certificate',
      code: 'RESALE',
      description: 'Tax exemption for resale items',
      status: 'active'
    },
    {
      id: 2,
      name: 'Government Exemption',
      code: 'GOVT',
      description: 'Tax exemption for government purchases',
      status: 'active'
    },
    {
      id: 3,
      name: 'Non-Profit Exemption',
      code: 'NONPROFIT',
      description: 'Tax exemption for non-profit organizations',
      status: 'active'
    }
  ]);

  const [taxReports] = useState([
    {
      id: 1,
      period: 'January 2024',
      totalSales: 125000,
      totalTax: 10625,
      taxRates: [
        { name: 'Standard Sales Tax', amount: 8500 },
        { name: 'Food & Beverage Tax', amount: 1800 },
        { name: 'Luxury Goods Tax', amount: 325 }
      ],
      status: 'filed'
    },
    {
      id: 2,
      period: 'February 2024',
      totalSales: 138000,
      totalTax: 11730,
      taxRates: [
        { name: 'Standard Sales Tax', amount: 9380 },
        { name: 'Food & Beverage Tax', amount: 1980 },
        { name: 'Luxury Goods Tax', amount: 370 }
      ],
      status: 'pending'
    }
  ]);

  const handleAddTaxRate = (e) => {
    e.preventDefault();
    // Handle adding new tax rate
    setShowAddTaxRate(false);
  };

  const handleAddTaxCode = (e) => {
    e.preventDefault();
    // Handle adding new tax code
    setShowAddTaxCode(false);
  };

  const handleAddExemption = (e) => {
    e.preventDefault();
    // Handle adding new exemption
    setShowAddExemption(false);
  };

  const handleDeleteTaxRate = (id) => {
    if (window.confirm('Are you sure you want to delete this tax rate?')) {
      // Handle deletion
    }
  };

  const handleDeleteTaxCode = (id) => {
    if (window.confirm('Are you sure you want to delete this tax code?')) {
      // Handle deletion
    }
  };

  const handleDeleteExemption = (id) => {
    if (window.confirm('Are you sure you want to delete this exemption?')) {
      // Handle deletion
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBackToSettings}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <span className="material-icons text-xl">arrow_back</span>
              </button>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Sales Tax Settings</h1>
                <p className="text-sm text-gray-600">Manage tax rates, codes, and exemptions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="material-icons text-blue-600">receipt</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tax Rates</p>
                <p className="text-2xl font-bold text-gray-900">{taxRates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="material-icons text-green-600">code</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tax Codes</p>
                <p className="text-2xl font-bold text-gray-900">{taxCodes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="material-icons text-yellow-600">verified</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Exemptions</p>
                <p className="text-2xl font-bold text-gray-900">{exemptions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="material-icons text-purple-600">assessment</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reports Filed</p>
                <p className="text-2xl font-bold text-gray-900">{taxReports.filter(r => r.status === 'filed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'tax-rates', name: 'Tax Rates', icon: 'receipt' },
                { id: 'tax-codes', name: 'Tax Codes', icon: 'code' },
                { id: 'exemptions', name: 'Exemptions', icon: 'verified' },
                { id: 'reports', name: 'Tax Reports', icon: 'assessment' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="material-icons text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Tax Rates Tab */}
            {activeTab === 'tax-rates' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Tax Rates</h3>
                  <button
                    onClick={() => setShowAddTaxRate(true)}
                    className="btn-primary"
                  >
                    <span className="material-icons text-lg mr-2">add</span>
                    Add Tax Rate
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tax Rate Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applies To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Effective Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taxRates.map((rate) => (
                        <tr key={rate.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {rate.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {rate.rate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {rate.appliesTo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {rate.effectiveDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              rate.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {rate.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteTaxRate(rate.id)}
                              className="text-red-600 hover:text-red-900"
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
            )}

            {/* Tax Codes Tab */}
            {activeTab === 'tax-codes' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Tax Codes</h3>
                  <button
                    onClick={() => setShowAddTaxCode(true)}
                    className="btn-primary"
                  >
                    <span className="material-icons text-lg mr-2">add</span>
                    Add Tax Code
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taxCodes.map((code) => (
                        <tr key={code.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {code.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {code.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {code.rate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {code.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteTaxCode(code.id)}
                              className="text-red-600 hover:text-red-900"
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
            )}

            {/* Exemptions Tab */}
            {activeTab === 'exemptions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Tax Exemptions</h3>
                  <button
                    onClick={() => setShowAddExemption(true)}
                    className="btn-primary"
                  >
                    <span className="material-icons text-lg mr-2">add</span>
                    Add Exemption
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exemption Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {exemptions.map((exemption) => (
                        <tr key={exemption.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {exemption.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {exemption.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {exemption.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              exemption.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {exemption.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteExemption(exemption.id)}
                              className="text-red-600 hover:text-red-900"
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
            )}

            {/* Tax Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Tax Reports</h3>
                  <button className="btn-primary">
                    <span className="material-icons text-lg mr-2">download</span>
                    Export Reports
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Period
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Sales
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Tax
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taxReports.map((report) => (
                        <tr key={report.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {report.period}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${report.totalSales.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${report.totalTax.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              report.status === 'filed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-4">
                              View
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Tax Rate Modal */}
      {showAddTaxRate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Tax Rate</h3>
              <form onSubmit={handleAddTaxRate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tax Rate Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Standard Sales Tax"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applies To</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>All Products</option>
                      <option>Food & Beverages</option>
                      <option>Luxury Items</option>
                      <option>Electronics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                    <input
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddTaxRate(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Tax Rate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Tax Code Modal */}
      {showAddTaxCode && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Tax Code</h3>
              <form onSubmit={handleAddTaxCode}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tax Code</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., STD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Standard Sales Tax"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="8.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>General</option>
                      <option>Food</option>
                      <option>Luxury</option>
                      <option>Electronics</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddTaxCode(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Tax Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Exemption Modal */}
      {showAddExemption && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Tax Exemption</h3>
              <form onSubmit={handleAddExemption}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Exemption Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Resale Certificate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Exemption Code</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., RESALE"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Tax exemption for resale items"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddExemption(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Exemption
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTaxSettings; 