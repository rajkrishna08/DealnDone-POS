import React, { useState } from 'react';

const OutletsRegisters = () => {
  const [activeTab, setActiveTab] = useState('outlets');
  const [outlets, setOutlets] = useState([
    {
      id: 1,
      name: 'Downtown Store',
      address: '123 Main St, Downtown',
      phone: '+1 (555) 123-4567',
      email: 'downtown@dealndone.com',
      manager: 'Sarah Johnson',
      status: 'active',
      openingHours: '9:00 AM - 6:00 PM',
      timezone: 'EST',
      registers: [
        {
          id: 1,
          name: 'Register 1',
          status: 'active',
          lastUsed: '2025-07-31 14:30:25',
          cashier: 'John Smith',
          sales: 1250.50
        },
        {
          id: 2,
          name: 'Register 2',
          status: 'active',
          lastUsed: '2025-07-31 13:45:10',
          cashier: 'Mike Davis',
          sales: 890.25
        }
      ]
    },
    {
      id: 2,
      name: 'Mall Location',
      address: '456 Shopping Center Blvd',
      phone: '+1 (555) 987-6543',
      email: 'mall@dealndone.com',
      manager: 'David Wilson',
      status: 'active',
      openingHours: '10:00 AM - 8:00 PM',
      timezone: 'EST',
      registers: [
        {
          id: 3,
          name: 'Register 1',
          status: 'active',
          lastUsed: '2025-07-31 15:20:30',
          cashier: 'Lisa Brown',
          sales: 2100.75
        }
      ]
    },
    {
      id: 3,
      name: 'Airport Store',
      address: '789 Airport Terminal 2',
      phone: '+1 (555) 456-7890',
      email: 'airport@dealndone.com',
      manager: 'Alex Chen',
      status: 'inactive',
      openingHours: '6:00 AM - 10:00 PM',
      timezone: 'EST',
      registers: [
        {
          id: 4,
          name: 'Register 1',
          status: 'inactive',
          lastUsed: '2025-07-30 18:15:45',
          cashier: 'Unassigned',
          sales: 0
        }
      ]
    }
  ]);
  const [newOutlet, setNewOutlet] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    openingHours: '9:00 AM - 6:00 PM',
    timezone: 'EST'
  });
  const [newRegister, setNewRegister] = useState({
    name: '',
    outletId: ''
  });

  const [showAddOutlet, setShowAddOutlet] = useState(false);
  const [showAddRegister, setShowAddRegister] = useState(false);

  const handleAddOutlet = () => {
    const outlet = {
      id: outlets.length + 1,
      ...newOutlet,
      status: 'active',
      registers: []
    };
    setOutlets([...outlets, outlet]);
    setNewOutlet({ name: '', address: '', phone: '', email: '', manager: '', openingHours: '9:00 AM - 6:00 PM', timezone: 'EST' });
    setShowAddOutlet(false);
  };

  const handleAddRegister = () => {
    const register = {
      id: Date.now(),
      name: newRegister.name,
      status: 'active',
      lastUsed: new Date().toLocaleString(),
      cashier: 'Unassigned',
      sales: 0
    };

    const updatedOutlets = outlets.map(outlet => {
      if (outlet.id === parseInt(newRegister.outletId)) {
        return {
          ...outlet,
          registers: [...outlet.registers, register]
        };
      }
      return outlet;
    });

    setOutlets(updatedOutlets);
    setNewRegister({ name: '', outletId: '' });
    setShowAddRegister(false);
  };

  const toggleOutletStatus = (outletId) => {
    setOutlets(outlets.map(outlet => 
      outlet.id === outletId 
        ? { ...outlet, status: outlet.status === 'active' ? 'inactive' : 'active' }
        : outlet
    ));
  };

  const toggleRegisterStatus = (outletId, registerId) => {
    setOutlets(outlets.map(outlet => {
      if (outlet.id === outletId) {
        return {
          ...outlet,
          registers: outlet.registers.map(register =>
            register.id === registerId
              ? { ...register, status: register.status === 'active' ? 'inactive' : 'active' }
              : register
          )
        };
      }
      return outlet;
    }));
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getTotalRegisters = () => {
    return outlets.reduce((total, outlet) => total + outlet.registers.length, 0);
  };

  const getActiveOutlets = () => {
    return outlets.filter(outlet => outlet.status === 'active').length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Outlets & Registers</h1>
          <div className="text-sm text-gray-500">
            Manage store locations and POS terminals
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button 
            onClick={() => setShowAddOutlet(true)}
            className="deal-n-done-btn-primary"
          >
            <span>🏪</span>
            Add Outlet
          </button>
          <button 
            onClick={() => setShowAddRegister(true)}
            className="deal-n-done-btn-secondary"
          >
            <span>💻</span>
            Add Register
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
                <span className="text-2xl">🏪</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Outlets</p>
                <p className="text-2xl font-bold text-gray-900">{outlets.length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Outlets</p>
                <p className="text-2xl font-bold text-gray-900">{getActiveOutlets()}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">💻</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Registers</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalRegisters()}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{outlets.length * 2}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deal-n-done-card">
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
                Outlets
              </button>
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
            </nav>
          </div>

          {activeTab === 'outlets' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Store Outlets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outlets.map((outlet) => (
                  <div key={outlet.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{outlet.name}</h4>
                        <p className="text-sm text-gray-600">{outlet.address}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(outlet.status)}`}>
                        {outlet.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">Manager:</span> {outlet.manager}</p>
                      <p><span className="font-medium">Phone:</span> {outlet.phone}</p>
                      <p><span className="font-medium">Email:</span> {outlet.email}</p>
                      <p><span className="font-medium">Hours:</span> {outlet.openingHours}</p>
                      <p><span className="font-medium">Timezone:</span> {outlet.timezone}</p>
                      <p><span className="font-medium">Registers:</span> {outlet.registers.length}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleOutletStatus(outlet.id)}
                        className={`px-3 py-1 text-xs rounded-md ${
                          outlet.status === 'active' 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {outlet.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'registers' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">POS Registers</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Register
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Outlet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cashier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Today's Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {outlets.map((outlet) =>
                      outlet.registers.map((register) => (
                        <tr key={register.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {register.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {outlet.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {register.cashier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(register.status)}`}>
                              {register.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {register.lastUsed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${register.sales.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => toggleRegisterStatus(outlet.id, register.id)}
                              className={`mr-2 px-2 py-1 text-xs rounded ${
                                register.status === 'active' 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {register.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                              Edit
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Outlet</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Outlet Name</label>
                  <input
                    type="text"
                    value={newOutlet.name}
                    onChange={(e) => setNewOutlet({...newOutlet, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter outlet name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={newOutlet.address}
                    onChange={(e) => setNewOutlet({...newOutlet, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter complete address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newOutlet.phone}
                      onChange={(e) => setNewOutlet({...newOutlet, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newOutlet.email}
                      onChange={(e) => setNewOutlet({...newOutlet, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="outlet@dealndone.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                    <input
                      type="text"
                      value={newOutlet.manager}
                      onChange={(e) => setNewOutlet({...newOutlet, manager: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Manager name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={newOutlet.openingHours}
                      onChange={(e) => setNewOutlet({...newOutlet, openingHours: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="9:00 AM - 6:00 PM"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddOutlet(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOutlet}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Add Outlet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Register Modal */}
      {showAddRegister && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Register</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Register Name</label>
                  <input
                    type="text"
                    value={newRegister.name}
                    onChange={(e) => setNewRegister({...newRegister, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Register 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Outlet</label>
                  <select
                    value={newRegister.outletId}
                    onChange={(e) => setNewRegister({...newRegister, outletId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an outlet</option>
                    {outlets.map((outlet) => (
                      <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddRegister(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRegister}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Add Register
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutletsRegisters; 