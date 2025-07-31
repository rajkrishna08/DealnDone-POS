import React, { useState } from 'react';

const CashManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Dummy data for cash management
  const cashOverview = {
    totalCash: 2140.00,
    cashInDrawers: 1890.00,
    pettyCash: 250.00,
    cashInTransit: 0.00,
    todayCashSales: 2450.50,
    todayCashPayments: 1250.75,
    todayCashReceipts: 0.00,
    todayCashDisbursements: 0.00
  };

  const cashTransactions = [
    {
      id: 'CT-001',
      date: '2025-01-30',
      time: '15:30',
      type: 'Cash Sale',
      description: 'Register 1 - Sale TXN-001',
      amount: 159.50,
      category: 'Sales',
      register: 'Register 1',
      cashier: 'Sarah Johnson',
      status: 'Completed'
    },
    {
      id: 'CT-002',
      date: '2025-01-30',
      time: '14:45',
      type: 'Cash Sale',
      description: 'Register 2 - Sale TXN-002',
      amount: 136.40,
      category: 'Sales',
      register: 'Register 2',
      cashier: 'David Wilson',
      status: 'Completed'
    },
    {
      id: 'CT-003',
      date: '2025-01-30',
      time: '12:00',
      type: 'Petty Cash',
      description: 'Office supplies purchase',
      amount: -45.25,
      category: 'Expenses',
      register: 'N/A',
      cashier: 'Manager',
      status: 'Completed'
    },
    {
      id: 'CT-004',
      date: '2025-01-29',
      time: '18:00',
      type: 'Bank Deposit',
      description: 'End of day deposit',
      amount: -1850.00,
      category: 'Banking',
      register: 'All Registers',
      cashier: 'Manager',
      status: 'Completed'
    }
  ];

  const pettyCashFund = {
    allocatedAmount: 500.00,
    currentBalance: 250.00,
    transactions: [
      {
        id: 1,
        date: '2025-01-30',
        description: 'Office supplies',
        amount: -45.25,
        category: 'Supplies',
        approvedBy: 'Manager'
      },
      {
        id: 2,
        date: '2025-01-29',
        description: 'Coffee for staff meeting',
        amount: -25.50,
        category: 'Refreshments',
        approvedBy: 'Manager'
      },
      {
        id: 3,
        date: '2025-01-28',
        description: 'Replenishment',
        amount: 200.00,
        category: 'Replenishment',
        approvedBy: 'Manager'
      }
    ]
  };

  const bankReconciliations = [
    {
      id: 'BR-001',
      date: '2025-01-30',
      bankBalance: 15420.75,
      bookBalance: 15420.75,
      outstandingDeposits: 1850.00,
      outstandingChecks: 0.00,
      adjustedBalance: 15420.75,
      status: 'Reconciled'
    },
    {
      id: 'BR-002',
      date: '2025-01-29',
      bankBalance: 13570.75,
      bookBalance: 13570.75,
      outstandingDeposits: 0.00,
      outstandingChecks: 0.00,
      adjustedBalance: 13570.75,
      status: 'Reconciled'
    }
  ];

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'Cash Sale': return 'bg-green-100 text-green-800';
      case 'Petty Cash': return 'bg-blue-100 text-blue-800';
      case 'Bank Deposit': return 'bg-purple-100 text-purple-800';
      case 'Cash Withdrawal': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Reconciled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Cash Management</h1>
          <div className="text-sm text-gray-500">
            Monitor and manage all cash transactions
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddTransaction(true)}
            className="deal-n-done-btn-primary"
          >
            <span>💰</span>
            Add Transaction
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Cash Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cash</p>
                <p className="text-2xl font-bold text-gray-900">${cashOverview.totalCash.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">🏪</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Drawers</p>
                <p className="text-2xl font-bold text-gray-900">${cashOverview.cashInDrawers.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Petty Cash</p>
                <p className="text-2xl font-bold text-gray-900">${cashOverview.pettyCash.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-gray-900">${cashOverview.todayCashSales.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('petty-cash')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'petty-cash'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Petty Cash
              </button>
              <button
                onClick={() => setActiveTab('reconciliation')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reconciliation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reconciliation
              </button>
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cash Flow Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Cash Sales Today</span>
                    <span className="font-medium text-green-600">+${cashOverview.todayCashSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Cash Payments Today</span>
                    <span className="font-medium text-red-600">-${cashOverview.todayCashPayments.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Cash Receipts Today</span>
                    <span className="font-medium text-green-600">+${cashOverview.todayCashReceipts.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Cash Disbursements Today</span>
                    <span className="font-medium text-red-600">-${cashOverview.todayCashDisbursements.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Cash Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Cash in Drawers</span>
                    <span className="font-medium text-gray-900">${cashOverview.cashInDrawers.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Petty Cash Fund</span>
                    <span className="font-medium text-gray-900">${cashOverview.pettyCash.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Cash in Transit</span>
                    <span className="font-medium text-gray-900">${cashOverview.cashInTransit.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date & Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Register</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{transaction.id}</td>
                        <td className="py-3 px-4 text-gray-600">
                          <div>
                            <div>{transaction.date}</div>
                            <div className="text-sm text-gray-500">{transaction.time}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{transaction.description}</td>
                        <td className={`py-3 px-4 text-right font-medium ${
                          transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">{transaction.register}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'petty-cash' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Petty Cash Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Petty Cash Fund</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Allocated Amount</span>
                      <span className="text-lg font-bold text-gray-900">${pettyCashFund.allocatedAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Current Balance</span>
                      <span className="text-lg font-bold text-gray-900">${pettyCashFund.currentBalance.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Available for Use</span>
                      <span className="text-lg font-bold text-gray-900">${(pettyCashFund.currentBalance - 50).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Petty Cash Transactions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {pettyCashFund.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-600">{transaction.date} - {transaction.category}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Approved by {transaction.approvedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reconciliation' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Reconciliation ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Bank Balance</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Book Balance</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Outstanding Deposits</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Outstanding Checks</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Adjusted Balance</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankReconciliations.map((reconciliation) => (
                      <tr key={reconciliation.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{reconciliation.id}</td>
                        <td className="py-3 px-4 text-gray-600">{reconciliation.date}</td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ${reconciliation.bankBalance.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ${reconciliation.bookBalance.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          ${reconciliation.outstandingDeposits.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          ${reconciliation.outstandingChecks.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ${reconciliation.adjustedBalance.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reconciliation.status)}`}>
                            {reconciliation.status}
                          </span>
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
  );
};

export default CashManagement; 