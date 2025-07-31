import React, { useState } from 'react';

const CashRegisters = () => {
  const [activeTab, setActiveTab] = useState('registers');
  const [showAddRegister, setShowAddRegister] = useState(false);
  const [selectedRegister, setSelectedRegister] = useState(null);

  // Dummy data for cash registers
  const cashRegisters = [
    {
      id: 'REG-001',
      name: 'Register 1',
      location: 'Main Store - Front Counter',
      status: 'Active',
      cashier: 'Sarah Johnson',
      lastActivity: '2025-01-30 15:30',
      currentBalance: 1250.75,
      todaySales: 2450.50,
      todayTransactions: 45,
      drawerCount: {
        hundreds: 10,
        fifties: 5,
        twenties: 15,
        tens: 8,
        fives: 12,
        ones: 25,
        quarters: 40,
        dimes: 60,
        nickels: 80,
        pennies: 100
      }
    },
    {
      id: 'REG-002',
      name: 'Register 2',
      location: 'Main Store - Back Counter',
      status: 'Active',
      cashier: 'David Wilson',
      lastActivity: '2025-01-30 14:45',
      currentBalance: 890.25,
      todaySales: 1890.75,
      todayTransactions: 32,
      drawerCount: {
        hundreds: 8,
        fifties: 3,
        twenties: 12,
        tens: 6,
        fives: 8,
        ones: 15,
        quarters: 35,
        dimes: 50,
        nickels: 70,
        pennies: 85
      }
    },
    {
      id: 'REG-003',
      name: 'Register 3',
      location: 'Downtown Branch',
      status: 'Inactive',
      cashier: 'Mike Chen',
      lastActivity: '2025-01-29 18:00',
      currentBalance: 0.00,
      todaySales: 0.00,
      todayTransactions: 0,
      drawerCount: {
        hundreds: 0,
        fifties: 0,
        twenties: 0,
        tens: 0,
        fives: 0,
        ones: 0,
        quarters: 0,
        dimes: 0,
        nickels: 0,
        pennies: 0
      }
    }
  ];

  const registerActivities = [
    {
      id: 1,
      registerId: 'REG-001',
      action: 'Cash Drawer Opened',
      cashier: 'Sarah Johnson',
      timestamp: '2025-01-30 15:30',
      amount: 0,
      notes: 'Regular drawer count'
    },
    {
      id: 2,
      registerId: 'REG-001',
      action: 'Sale Completed',
      cashier: 'Sarah Johnson',
      timestamp: '2025-01-30 15:25',
      amount: 159.50,
      notes: 'Transaction TXN-001'
    },
    {
      id: 3,
      registerId: 'REG-002',
      action: 'Cash Drawer Opened',
      cashier: 'David Wilson',
      timestamp: '2025-01-30 14:45',
      amount: 0,
      notes: 'End of shift count'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDrawerTotal = (drawerCount) => {
    return (
      drawerCount.hundreds * 100 +
      drawerCount.fifties * 50 +
      drawerCount.twenties * 20 +
      drawerCount.tens * 10 +
      drawerCount.fives * 5 +
      drawerCount.ones * 1 +
      drawerCount.quarters * 0.25 +
      drawerCount.dimes * 0.10 +
      drawerCount.nickels * 0.05 +
      drawerCount.pennies * 0.01
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Cash Registers</h1>
          <div className="text-sm text-gray-500">
            Manage cash registers and drawer counts
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddRegister(true)}
            className="deal-n-done-btn-primary"
          >
            <span>➕</span>
            Add Register
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">🏪</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Registers</p>
                <p className="text-2xl font-bold text-gray-900">{cashRegisters.length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cash</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${cashRegisters.reduce((sum, reg) => sum + reg.currentBalance, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${cashRegisters.reduce((sum, reg) => sum + reg.todaySales, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Cashiers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {cashRegisters.filter(reg => reg.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('registers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'registers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Registers
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activities
              </button>
            </nav>
          </div>

          {activeTab === 'registers' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Register</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Cashier</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Current Balance</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Today's Sales</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Last Activity</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashRegisters.map((register) => (
                      <tr key={register.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{register.name}</td>
                        <td className="py-3 px-4 text-gray-600">{register.location}</td>
                        <td className="py-3 px-4 text-gray-600">{register.cashier}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(register.status)}`}>
                            {register.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ${register.currentBalance.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          ${register.todaySales.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          <div className="text-sm">
                            <div>{register.lastActivity.split(' ')[0]}</div>
                            <div className="text-gray-500">{register.lastActivity.split(' ')[1]}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex space-x-2 justify-center">
                            <button 
                              onClick={() => setSelectedRegister(register)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Drawer
                            </button>
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                              Count
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Register</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Cashier</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registerActivities.map((activity) => (
                      <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{activity.registerId}</td>
                        <td className="py-3 px-4 text-gray-600">{activity.action}</td>
                        <td className="py-3 px-4 text-gray-600">{activity.cashier}</td>
                        <td className="py-3 px-4 text-center font-medium text-gray-900">
                          ${activity.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">
                          <div className="text-sm">
                            <div>{activity.timestamp.split(' ')[0]}</div>
                            <div className="text-gray-500">{activity.timestamp.split(' ')[1]}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{activity.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Count Modal */}
        {selectedRegister && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Drawer Count - {selectedRegister.name}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">$100 Bills</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.hundreds} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">$50 Bills</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.fifties} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">$20 Bills</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.twenties} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">$10 Bills</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.tens} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">$5 Bills</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.fives} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">$1 Bills</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.ones} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quarters</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.quarters} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dimes</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.dimes} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nickels</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.nickels} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pennies</label>
                      <input type="number" defaultValue={selectedRegister.drawerCount.pennies} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm font-medium text-gray-900">
                      Total: ${calculateDrawerTotal(selectedRegister.drawerCount).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setSelectedRegister(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                    Save Count
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashRegisters; 