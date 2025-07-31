import React, { useState } from 'react';

const OutletsRegistersSettings = ({ onBackToSettings, user }) => {
  const [activeTab, setActiveTab] = useState('outlets');
  const [showAddOutlet, setShowAddOutlet] = useState(false);
  const [showAddRegister, setShowAddRegister] = useState(false);

  // Mock plan limits based on user's subscription
  const planLimits = {
    'Free': { outlets: 1, registers: 1 },
    'Starter': { outlets: 3, registers: 6 },
    'Professional': { outlets: 10, registers: 30 },
    'Enterprise': { outlets: 50, registers: 200 }
  };

  // Mock current plan (this would come from user data)
  const currentPlan = 'Professional';
  const limits = planLimits[currentPlan];

  // Mock outlets data
  const [outlets, setOutlets] = useState([
    {
      id: 1,
      name: "NYC Outlet",
      address: "123 Broadway, New York, NY 10001",
      taxId: "TAX-001-NYC",
      taxRate: 8.875,
      coordinates: { lat: 40.7589, lng: -73.9851 },
      registers: [
        { id: 1, name: "Register 1", status: "active", lastUsed: "2024-01-15" },
        { id: 2, name: "Register 2", status: "active", lastUsed: "2024-01-15" }
      ],
      status: "active"
    },
    {
      id: 2,
      name: "Manhattan 11",
      address: "456 5th Avenue, New York, NY 10018",
      taxId: "TAX-002-MAN",
      taxRate: 8.875,
      coordinates: { lat: 40.7505, lng: -73.9934 },
      registers: [
        { id: 3, name: "Register 1", status: "active", lastUsed: "2024-01-15" },
        { id: 4, name: "Register 2", status: "active", lastUsed: "2024-01-15" },
        { id: 5, name: "Register 3", status: "inactive", lastUsed: "2024-01-10" }
      ],
      status: "active"
    }
  ]);

  const [newOutlet, setNewOutlet] = useState({
    name: '',
    address: '',
    taxId: '',
    taxRate: '',
    coordinates: { lat: '', lng: '' }
  });

  const [newRegister, setNewRegister] = useState({
    name: '',
    outletId: ''
  });

  const totalRegisters = outlets.reduce((sum, outlet) => sum + outlet.registers.length, 0);
  const activeRegisters = outlets.reduce((sum, outlet) => 
    sum + outlet.registers.filter(r => r.status === 'active').length, 0
  );

  const handleAddOutlet = () => {
    if (outlets.length >= limits.outlets) {
      alert(`You've reached the maximum number of outlets (${limits.outlets}) for your ${currentPlan} plan.`);
      return;
    }

    const outlet = {
      id: Date.now(),
      ...newOutlet,
      registers: [],
      status: 'active'
    };

    setOutlets([...outlets, outlet]);
    setNewOutlet({ name: '', address: '', taxId: '', taxRate: '', coordinates: { lat: '', lng: '' } });
    setShowAddOutlet(false);
  };

  const handleAddRegister = () => {
    if (totalRegisters >= limits.registers) {
      alert(`You've reached the maximum number of registers (${limits.registers}) for your ${currentPlan} plan.`);
      return;
    }

    const register = {
      id: Date.now(),
      name: newRegister.name,
      status: 'active',
      lastUsed: new Date().toISOString().split('T')[0]
    };

    setOutlets(outlets.map(outlet => 
      outlet.id === parseInt(newRegister.outletId)
        ? { ...outlet, registers: [...outlet.registers, register] }
        : outlet
    ));

    setNewRegister({ name: '', outletId: '' });
    setShowAddRegister(false);
  };

  const handleDeleteOutlet = (outletId) => {
    setOutlets(outlets.filter(outlet => outlet.id !== outletId));
  };

  const handleDeleteRegister = (outletId, registerId) => {
    setOutlets(outlets.map(outlet => 
      outlet.id === outletId
        ? { ...outlet, registers: outlet.registers.filter(register => register.id !== registerId) }
        : outlet
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToSettings}
            className="deal-n-done-btn-secondary"
          >
            ← Back to Settings
          </button>
          <h1 className="deal-n-done-header title">Outlets & Registers</h1>
        </div>
        <div className="deal-n-done-header actions">
          <div className="deal-n-done-header user-profile">
            <div className="deal-n-done-header user-avatar">{user?.name?.charAt(0) || 'U'}</div>
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="deal-n-done-card">
          {/* Plan Limits Summary */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Plan Limits</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Current Plan:</span>
                <span className="ml-2 text-blue-900">{currentPlan}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Outlets:</span>
                <span className="ml-2 text-blue-900">{outlets.length}/{limits.outlets}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Registers:</span>
                <span className="ml-2 text-blue-900">{totalRegisters}/{limits.registers}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Active Registers:</span>
                <span className="ml-2 text-blue-900">{activeRegisters}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('outlets')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'outlets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Outlets ({outlets.length})
              </button>
              <button
                onClick={() => setActiveTab('registers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'registers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Registers ({totalRegisters})
              </button>
            </nav>
          </div>

          {/* Outlets Tab */}
          {activeTab === 'outlets' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Store Outlets</h2>
                <button
                  onClick={() => setShowAddOutlet(true)}
                  className="deal-n-done-btn-primary"
                >
                  <span>➕</span>
                  Add Outlet
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outlets.map((outlet) => (
                  <div key={outlet.id} className="deal-n-done-card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{outlet.name}</h3>
                        <p className="text-sm text-gray-600">{outlet.address}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteOutlet(outlet.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Tax ID:</span>
                        <span className="ml-2 text-gray-600">{outlet.taxId}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Tax Rate:</span>
                        <span className="ml-2 text-gray-600">{outlet.taxRate}%</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Registers:</span>
                        <span className="ml-2 text-gray-600">{outlet.registers.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          outlet.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {outlet.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registers Tab */}
          {activeTab === 'registers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Point of Sale Registers</h2>
                <button
                  onClick={() => setShowAddRegister(true)}
                  className="deal-n-done-btn-primary"
                >
                  <span>➕</span>
                  Add Register
                </button>
              </div>

              <div className="deal-n-done-table">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Register Name</th>
                      <th>Outlet</th>
                      <th>Status</th>
                      <th>Last Used</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outlets.flatMap(outlet => 
                      outlet.registers.map(register => (
                        <tr key={register.id}>
                          <td className="font-medium">{register.name}</td>
                          <td>{outlet.name}</td>
                          <td>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              register.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {register.status}
                            </span>
                          </td>
                          <td>{register.lastUsed}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteRegister(outlet.id, register.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Outlet Modal */}
      {showAddOutlet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Outlet</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Outlet Name"
                value={newOutlet.name}
                onChange={(e) => setNewOutlet({...newOutlet, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Address"
                value={newOutlet.address}
                onChange={(e) => setNewOutlet({...newOutlet, address: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
              />
              <input
                type="text"
                placeholder="Tax ID"
                value={newOutlet.taxId}
                onChange={(e) => setNewOutlet({...newOutlet, taxId: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Tax Rate (%)"
                value={newOutlet.taxRate}
                onChange={(e) => setNewOutlet({...newOutlet, taxRate: parseFloat(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded"
                step="0.01"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddOutlet(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOutlet}
                className="deal-n-done-btn-primary"
              >
                Add Outlet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Register Modal */}
      {showAddRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Register</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Register Name"
                value={newRegister.name}
                onChange={(e) => setNewRegister({...newRegister, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <select
                value={newRegister.outletId}
                onChange={(e) => setNewRegister({...newRegister, outletId: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Outlet</option>
                {outlets.map(outlet => (
                  <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddRegister(false)}
                className="deal-n-done-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRegister}
                className="deal-n-done-btn-primary"
              >
                Add Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletsRegistersSettings; 