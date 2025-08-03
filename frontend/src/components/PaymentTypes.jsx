import React, { useState } from 'react';

const PaymentTypes = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: 'Cash',
      type: 'cash',
      active: true,
      requiresChange: true,
      maxAmount: 1000,
      description: 'Physical cash payments'
    },
    {
      id: 2,
      name: 'Credit Card',
      type: 'card',
      active: true,
      requiresChange: false,
      maxAmount: 5000,
      description: 'Visa, MasterCard, American Express',
      processingFee: 2.5
    },
    {
      id: 3,
      name: 'Debit Card',
      type: 'card',
      active: true,
      requiresChange: false,
      maxAmount: 2000,
      description: 'Direct bank account payments',
      processingFee: 1.5
    },
    {
      id: 4,
      name: 'Mobile Payment',
      type: 'digital',
      active: true,
      requiresChange: false,
      maxAmount: 1000,
      description: 'Apple Pay, Google Pay, Samsung Pay'
    },
    {
      id: 5,
      name: 'Check',
      type: 'check',
      active: false,
      requiresChange: false,
      maxAmount: 5000,
      description: 'Personal and business checks'
    },
    {
      id: 6,
      name: 'Gift Card',
      type: 'gift',
      active: true,
      requiresChange: false,
      maxAmount: 500,
      description: 'Store and third-party gift cards'
    }
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    name: '',
    type: 'card',
    description: '',
    maxAmount: '',
    processingFee: '',
    requiresChange: false
  });

  const [globalSettings, setGlobalSettings] = useState({
    allowPartialPayments: true,
    requirePaymentConfirmation: true,
    autoCalculateChange: true,
    roundToNearestDollar: false,
    allowMultiplePayments: true,
    requireReceipt: true,
    allowRefunds: true,
    refundTimeLimit: 30
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Payment settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPayment = () => {
    const payment = {
      id: Date.now(),
      ...newPayment,
      maxAmount: parseFloat(newPayment.maxAmount),
      processingFee: newPayment.processingFee ? parseFloat(newPayment.processingFee) : 0,
      active: true
    };
    setPaymentMethods([...paymentMethods, payment]);
    setNewPayment({ name: '', type: 'card', description: '', maxAmount: '', processingFee: '', requiresChange: false });
    setShowAddPayment(false);
  };

  const togglePaymentStatus = (paymentId) => {
    setPaymentMethods(paymentMethods.map(payment =>
      payment.id === paymentId
        ? { ...payment, active: !payment.active }
        : payment
    ));
  };

  const deletePayment = (paymentId) => {
    setPaymentMethods(paymentMethods.filter(payment => payment.id !== paymentId));
  };

  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case 'cash': return '💰';
      case 'card': return '💳';
      case 'digital': return '📱';
      case 'check': return '🏦';
      case 'gift': return '🎁';
      default: return '💳';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Payment Types</h1>
          <div className="text-sm text-gray-500">
            Configure payment methods and processing settings
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
            onClick={() => setShowAddPayment(true)}
            className="deal-n-done-btn-secondary"
          >
            <span>💳</span>
            Add Payment Method
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
                <span className="text-2xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Methods</p>
                <p className="text-2xl font-bold text-gray-900">{paymentMethods.length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Methods</p>
                <p className="text-2xl font-bold text-gray-900">{paymentMethods.filter(p => p.active).length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Processing Fee</p>
                <p className="text-2xl font-bold text-gray-900">2.1%</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">98.5%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
                Payment Methods
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Global Settings
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Processing Fees
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Analytics
              </button>
            </nav>
          </div>

          {/* Payment Methods Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              <button 
                onClick={() => setShowAddPayment(true)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Payment Method
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentMethods.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-gray-100 mr-3">
                        <span className="text-xl">{getPaymentTypeIcon(payment.type)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{payment.name}</h4>
                        <p className="text-sm text-gray-600">{payment.description}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      payment.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><span className="font-medium">Type:</span> <span className="capitalize">{payment.type}</span></p>
                    <p><span className="font-medium">Max Amount:</span> ${payment.maxAmount.toLocaleString()}</p>
                    {payment.processingFee && (
                      <p><span className="font-medium">Processing Fee:</span> {payment.processingFee}%</p>
                    )}
                    <p><span className="font-medium">Change Required:</span> {payment.requiresChange ? 'Yes' : 'No'}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => togglePaymentStatus(payment.id)}
                      className={`px-3 py-1 text-xs rounded-md ${
                        payment.active 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {payment.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                      Edit
                    </button>
                    <button 
                      onClick={() => deletePayment(payment.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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
                    checked={globalSettings.allowPartialPayments}
                    onChange={(e) => setGlobalSettings({...globalSettings, allowPartialPayments: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Allow partial payments</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.requirePaymentConfirmation}
                    onChange={(e) => setGlobalSettings({...globalSettings, requirePaymentConfirmation: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Require payment confirmation</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.autoCalculateChange}
                    onChange={(e) => setGlobalSettings({...globalSettings, autoCalculateChange: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Auto-calculate change</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.roundToNearestDollar}
                    onChange={(e) => setGlobalSettings({...globalSettings, roundToNearestDollar: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Round to nearest dollar</label>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.allowMultiplePayments}
                    onChange={(e) => setGlobalSettings({...globalSettings, allowMultiplePayments: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Allow multiple payment methods</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.requireReceipt}
                    onChange={(e) => setGlobalSettings({...globalSettings, requireReceipt: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Require receipt printing</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={globalSettings.allowRefunds}
                    onChange={(e) => setGlobalSettings({...globalSettings, allowRefunds: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-900">Allow refunds</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Time Limit (days)
                  </label>
                  <input
                    type="number"
                    value={globalSettings.refundTimeLimit}
                    onChange={(e) => setGlobalSettings({...globalSettings, refundTimeLimit: parseInt(e.target.value)})}
                    min="0"
                    max="365"
                    className="deal-n-done-input"
                  />
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

        {/* Add Payment Method Modal */}
        {showAddPayment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Payment Method</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Name</label>
                    <input
                      type="text"
                      value={newPayment.name}
                      onChange={(e) => setNewPayment({...newPayment, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newPayment.type}
                      onChange={(e) => setNewPayment({...newPayment, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="digital">Digital</option>
                      <option value="check">Check</option>
                      <option value="gift">Gift Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newPayment.description}
                      onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount ($)</label>
                    <input
                      type="number"
                      value={newPayment.maxAmount}
                      onChange={(e) => setNewPayment({...newPayment, maxAmount: e.target.value})}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Processing Fee (%)</label>
                    <input
                      type="number"
                      value={newPayment.processingFee}
                      onChange={(e) => setNewPayment({...newPayment, processingFee: e.target.value})}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPayment.requiresChange}
                      onChange={(e) => setNewPayment({...newPayment, requiresChange: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Requires change calculation
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddPayment(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPayment}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Add Payment Method
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default PaymentTypes; 