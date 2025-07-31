import React, { useState } from 'react';

const PaymentTypesSettings = ({ onBackToSettings, user }) => {
  const [activeTab, setActiveTab] = useState('payment-methods');
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [showAddPaymentGateway, setShowAddPaymentGateway] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);

  // Mock data for payment types settings
  const [paymentMethods] = useState([
    {
      id: 1,
      name: 'Cash',
      type: 'cash',
      status: 'active',
      defaultChange: 20,
      allowPartialPayment: true,
      description: 'Physical cash payments'
    },
    {
      id: 2,
      name: 'Credit Card',
      type: 'card',
      status: 'active',
      gateway: 'Stripe',
      processingFee: 2.9,
      allowPartialPayment: false,
      description: 'Credit and debit card payments'
    },
    {
      id: 3,
      name: 'Digital Wallet',
      type: 'digital',
      status: 'active',
      gateway: 'PayPal',
      processingFee: 2.5,
      allowPartialPayment: true,
      description: 'Apple Pay, Google Pay, PayPal'
    },
    {
      id: 4,
      name: 'Check',
      type: 'check',
      status: 'inactive',
      requireApproval: true,
      allowPartialPayment: false,
      description: 'Physical check payments'
    }
  ]);

  const [paymentGateways] = useState([
    {
      id: 1,
      name: 'Stripe',
      type: 'card_processor',
      status: 'active',
      apiKey: 'pk_test_...',
      webhookUrl: 'https://your-domain.com/webhooks/stripe',
      supportedMethods: ['Credit Card', 'Debit Card'],
      processingFee: 2.9
    },
    {
      id: 2,
      name: 'PayPal',
      type: 'digital_wallet',
      status: 'active',
      clientId: 'client_id_...',
      webhookUrl: 'https://your-domain.com/webhooks/paypal',
      supportedMethods: ['PayPal', 'Venmo'],
      processingFee: 2.5
    },
    {
      id: 3,
      name: 'Square',
      type: 'pos_integration',
      status: 'inactive',
      accessToken: 'access_token_...',
      webhookUrl: 'https://your-domain.com/webhooks/square',
      supportedMethods: ['Credit Card', 'Cash App'],
      processingFee: 2.6
    }
  ]);

  const [discounts] = useState([
    {
      id: 1,
      name: 'Employee Discount',
      type: 'percentage',
      value: 15,
      code: 'EMP15',
      status: 'active',
      minAmount: 10,
      maxDiscount: 50,
      description: '15% discount for employees'
    },
    {
      id: 2,
      name: 'Loyalty Discount',
      type: 'percentage',
      value: 10,
      code: 'LOYAL10',
      status: 'active',
      minAmount: 25,
      maxDiscount: 25,
      description: '10% discount for loyalty members'
    },
    {
      id: 3,
      name: 'Bulk Purchase',
      type: 'fixed',
      value: 5,
      code: 'BULK5',
      status: 'active',
      minAmount: 100,
      maxDiscount: 20,
      description: '$5 off for purchases over $100'
    }
  ]);

  const [paymentReports] = useState([
    {
      id: 1,
      period: 'January 2024',
      totalTransactions: 1250,
      totalAmount: 45000,
      paymentMethods: [
        { name: 'Cash', count: 450, amount: 15000 },
        { name: 'Credit Card', count: 600, amount: 25000 },
        { name: 'Digital Wallet', count: 200, amount: 5000 }
      ],
      status: 'completed'
    },
    {
      id: 2,
      period: 'February 2024',
      totalTransactions: 1380,
      totalAmount: 52000,
      paymentMethods: [
        { name: 'Cash', count: 480, amount: 16000 },
        { name: 'Credit Card', count: 650, amount: 28000 },
        { name: 'Digital Wallet', count: 250, amount: 8000 }
      ],
      status: 'pending'
    }
  ]);

  const handleAddPaymentMethod = (e) => {
    e.preventDefault();
    // Handle adding new payment method
    setShowAddPaymentMethod(false);
  };

  const handleAddPaymentGateway = (e) => {
    e.preventDefault();
    // Handle adding new payment gateway
    setShowAddPaymentGateway(false);
  };

  const handleAddDiscount = (e) => {
    e.preventDefault();
    // Handle adding new discount
    setShowAddDiscount(false);
  };

  const handleDeletePaymentMethod = (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      // Handle deletion
    }
  };

  const handleDeletePaymentGateway = (id) => {
    if (window.confirm('Are you sure you want to delete this payment gateway?')) {
      // Handle deletion
    }
  };

  const handleDeleteDiscount = (id) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
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
                <h1 className="text-2xl font-bold text-gray-900">Payment Types Settings</h1>
                <p className="text-sm text-gray-600">Manage payment methods, gateways, and discounts</p>
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
                <span className="material-icons text-blue-600">payment</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Payment Methods</p>
                <p className="text-2xl font-bold text-gray-900">{paymentMethods.filter(p => p.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="material-icons text-green-600">account_balance</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Payment Gateways</p>
                <p className="text-2xl font-bold text-gray-900">{paymentGateways.filter(g => g.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="material-icons text-yellow-600">local_offer</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Discounts</p>
                <p className="text-2xl font-bold text-gray-900">{discounts.filter(d => d.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="material-icons text-purple-600">assessment</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{paymentReports[0]?.totalTransactions || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'payment-methods', name: 'Payment Methods', icon: 'payment' },
                { id: 'payment-gateways', name: 'Payment Gateways', icon: 'account_balance' },
                { id: 'discounts', name: 'Discounts', icon: 'local_offer' },
                { id: 'reports', name: 'Payment Reports', icon: 'assessment' }
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
            {/* Payment Methods Tab */}
            {activeTab === 'payment-methods' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                  <button
                    onClick={() => setShowAddPaymentMethod(true)}
                    className="btn-primary"
                  >
                    <span className="material-icons text-lg mr-2">add</span>
                    Add Payment Method
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gateway
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Processing Fee
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
                      {paymentMethods.map((method) => (
                        <tr key={method.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-500">{method.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {method.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {method.gateway || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {method.processingFee ? `${method.processingFee}%` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              method.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {method.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeletePaymentMethod(method.id)}
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

            {/* Payment Gateways Tab */}
            {activeTab === 'payment-gateways' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Payment Gateways</h3>
                  <button
                    onClick={() => setShowAddPaymentGateway(true)}
                    className="btn-primary"
                  >
                    <span className="material-icons text-lg mr-2">add</span>
                    Add Payment Gateway
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gateway Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supported Methods
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Processing Fee
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
                      {paymentGateways.map((gateway) => (
                        <tr key={gateway.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {gateway.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {gateway.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {gateway.supportedMethods.join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {gateway.processingFee}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              gateway.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {gateway.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-4">
                              Configure
                            </button>
                            <button
                              onClick={() => handleDeletePaymentGateway(gateway.id)}
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

            {/* Discounts Tab */}
            {activeTab === 'discounts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Discounts & Promotions</h3>
                  <button
                    onClick={() => setShowAddDiscount(true)}
                    className="btn-primary"
                  >
                    <span className="material-icons text-lg mr-2">add</span>
                    Add Discount
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Discount Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
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
                      {discounts.map((discount) => (
                        <tr key={discount.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{discount.name}</div>
                              <div className="text-sm text-gray-500">{discount.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {discount.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {discount.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              discount.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {discount.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteDiscount(discount.id)}
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

            {/* Payment Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Payment Reports</h3>
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
                          Total Transactions
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Methods
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
                      {paymentReports.map((report) => (
                        <tr key={report.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {report.period}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {report.totalTransactions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${report.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {report.paymentMethods.length} methods
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              report.status === 'completed' 
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

      {/* Add Payment Method Modal */}
      {showAddPaymentMethod && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Payment Method</h3>
              <form onSubmit={handleAddPaymentMethod}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Credit Card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>cash</option>
                      <option>card</option>
                      <option>digital</option>
                      <option>check</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Gateway</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>None</option>
                      <option>Stripe</option>
                      <option>PayPal</option>
                      <option>Square</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Processing Fee (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2.9"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description of the payment method"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddPaymentMethod(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Payment Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Gateway Modal */}
      {showAddPaymentGateway && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Payment Gateway</h3>
              <form onSubmit={handleAddPaymentGateway}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gateway Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Stripe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>card_processor</option>
                      <option>digital_wallet</option>
                      <option>pos_integration</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">API Key</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Processing Fee (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2.9"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddPaymentGateway(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Payment Gateway
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Discount Modal */}
      {showAddDiscount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Discount</h3>
              <form onSubmit={handleAddDiscount}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Employee Discount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>percentage</option>
                      <option>fixed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Discount Code</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., EMP15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Minimum Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description of the discount"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddDiscount(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Discount
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

export default PaymentTypesSettings; 