import React, { useState } from 'react';

const EmployeeRoles = () => {
  const [roles] = useState([
    'Junior Cashier',
    'Cashier', 
    'Manager',
    'Admin',
    'Store Administrator',
    'Owner'
  ]);

  const [features] = useState([
    'Web',
    'Locations',
    'Employees',
    'Sales',
    'Orders',
    'Quick Inventory Adjustments',
    'Products',
    'Gift Cards',
    'Reporting',
    'Customers',
    'Timesheets',
    'Business Settings',
    'Loyalty Program Settings',
    'Email Marketing',
    'Vendors',
    'Purchase Shipping Labels',
    'Conversations',
    'iPad',
    'Process Transactions',
    'Open/Close Register'
  ]);

  const [permissions] = useState({
    'Web': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Locations': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Employees': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Sales': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Orders': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Quick Inventory Adjustments': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Products': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Gift Cards': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Reporting': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Customers': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Timesheets': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Business Settings': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Loyalty Program Settings': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Email Marketing': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'view-only',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Vendors': {
      'Junior Cashier': 'none',
      'Cashier': 'view-only',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Purchase Shipping Labels': {
      'Junior Cashier': 'none',
      'Cashier': 'none',
      'Manager': 'add-edit',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Conversations': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'iPad': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Process Transactions': {
      'Junior Cashier': 'view-only',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    },
    'Open/Close Register': {
      'Junior Cashier': 'none',
      'Cashier': 'add-edit',
      'Manager': 'full',
      'Admin': 'full',
      'Store Administrator': 'full',
      'Owner': 'full'
    }
  });

  const getPermissionText = (permission) => {
    switch (permission) {
      case 'none':
        return 'No Access';
      case 'view-only':
        return 'View Only';
      case 'add-edit':
        return 'Add/Edit';
      case 'full':
        return 'Full Access';
      default:
        return 'Unknown';
    }
  };

  const getPermissionClass = (permission) => {
    switch (permission) {
      case 'none':
        return 'bg-red-100 text-red-800';
      case 'view-only':
        return 'bg-yellow-100 text-yellow-800';
      case 'add-edit':
        return 'bg-blue-100 text-blue-800';
      case 'full':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="deal-n-done-header">
        <div className="flex items-center gap-4">
          <h1 className="deal-n-done-header title">Employee Roles & Permissions</h1>
          <div className="text-sm text-gray-500">
            Manage role-based access control and permissions matrix
          </div>
        </div>
        <div className="deal-n-done-header actions">
          <button className="deal-n-done-btn-primary">
            <span>🛡️</span>
            Add Role
          </button>
          <button className="deal-n-done-btn-secondary">
            <span>📋</span>
            Export Matrix
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
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Roles</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">🔐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Features</p>
                <p className="text-2xl font-bold text-gray-900">{features.length}</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>
          <div className="deal-n-done-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Permissions</p>
                <p className="text-2xl font-bold text-gray-900">120</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deal-n-done-card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600">
                Permissions Matrix
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Role Management
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Access Logs
              </button>
              <button className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Security Settings
              </button>
            </nav>
          </div>

          {/* Permissions Matrix */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Permissions Matrix</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Export CSV
                </button>
                <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                  Print Matrix
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                      Features
                    </th>
                    {roles.map((role) => (
                      <th key={role} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {role}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {features.map((feature) => (
                    <tr key={feature} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                        {feature}
                      </td>
                      {roles.map((role) => (
                        <td key={`${feature}-${role}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPermissionClass(permissions[feature]?.[role] || 'none')}`}>
                            {getPermissionText(permissions[feature]?.[role] || 'none')}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Role Summary */}
          <div className="mt-8">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Role Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => {
                const rolePermissions = features.map(feature => permissions[feature]?.[role] || 'none');
                const fullAccess = rolePermissions.filter(p => p === 'full').length;
                const addEdit = rolePermissions.filter(p => p === 'add-edit').length;
                const viewOnly = rolePermissions.filter(p => p === 'view-only').length;
                const noAccess = rolePermissions.filter(p => p === 'none').length;
                
                return (
                  <div key={role} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">{role}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Access:</span>
                        <span className="font-medium text-green-600">{fullAccess}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Add/Edit:</span>
                        <span className="font-medium text-blue-600">{addEdit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">View Only:</span>
                        <span className="font-medium text-yellow-600">{viewOnly}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">No Access:</span>
                        <span className="font-medium text-red-600">{noAccess}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRoles; 